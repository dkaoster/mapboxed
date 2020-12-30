import sharp from 'sharp';
import axios from 'axios';
import path from 'path';
import fs from 'fs';
import { tileURL } from './tiles';

/**
 * Server
 *
 * Functions specific to downloading / assembling tiles on the server or through the command line.
 */

/**
 * The path to the individual tile image on the filesystem.
 *
 * @param tileset
 * @param zoom
 * @param res2x
 * @param format
 * @param x
 * @param y
 * @returns {string}
 */
const imgPath = ({ tileset, zoom, res2x, format }, x, y) => `./.mapboxed/${zoom}/${tileset}-${x}-${y}${res2x ? '@2x' : ''}.${format.replace(/[0-9]/g, '')}`;

/**
 * Download this particular tile.
 *
 * @param params
 * @param x
 * @param y
 * @param onDownloadProgress
 * @returns {Promise<unknown>}
 */
const downloadTile = async (params, x, y, onDownloadProgress = () => {}) => {
  // Get parameters
  const { zoom, tileset, res2x, format } = params;

  // Get the tile mapbox api url
  const url = tileURL(params, x, y);

  // get and generate directory structure if it doesn't exist
  const imagesDir = path.resolve('./.mapboxed');
  if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir);
  const zoomDir = path.resolve(imagesDir, `${zoom}`);
  if (!fs.existsSync(zoomDir)) fs.mkdirSync(zoomDir);
  const tilePath = path.resolve(
    zoomDir,
    `${tileset}-${x}-${y}${res2x ? '@2x' : ''}.${format.replace(/[0-9]/g, '')}`,
  );

  // Download write stream
  const writer = fs.createWriteStream(tilePath);

  // Download tile using axios
  const response = await axios({ url, method: 'GET', responseType: 'stream', onDownloadProgress });

  // save to file
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};

/**
 * Takes a list of tiles and composites them into a full sharp image.
 *
 * @param params
 * @param tiles
 * @param xTilesLength
 * @param yTilesLength
 * @returns {Promise<void>}
 */
const generateImage = async (params, tiles, xTilesLength, yTilesLength) => {
  // Read the params we need
  const { format, res2x } = params;
  const tileWidth = (res2x ? 512 : 256);
  const compositeStep = 8;

  // Generate format options for sharp
  // https://sharp.pixelplumbing.com/api-output
  const formatOptions = {};
  switch (format.replace(/[0-9]/g, '')) {
    case 'jpg':
      formatOptions.quality = parseInt(format.replace(/[a-z]/g, ''), 10);
      break;
    case 'png':
      formatOptions.colors = parseInt(format.replace(/[a-z]/g, '') || '256', 10);
      break;
    default:
      break;
  }

  // base coordinates
  const [baseX, baseY] = tiles[0];

  // Create sharp object with first tile.
  let composited = sharp(imgPath(params, baseX, baseY))
    // We want to extend the size ahead of time to the final size
    .extend({
      top: 0,
      left: 0,
      bottom: yTilesLength * tileWidth,
      right: xTilesLength * tileWidth,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    });

  // composite the rest of the tiles.
  const restTiles = tiles.slice(1);

  // Janky nested raw().toBuffer() loop in chunks of compositeStep because of
  // potential out of memory error if we do them all in the same step.
  // https://github.com/lovell/sharp/issues/2286
  await composited.raw().toBuffer(async (err, buffer, info) => {
    for (let i = 0; i < restTiles.length; i += compositeStep) {
      // eslint-disable-next-line no-await-in-loop
      const innerBuffer = await composited.raw().toBuffer();

      // Set composited to image with these tiles composited.
      composited = sharp(innerBuffer, { raw: info })
        .composite(
          // Map compositeStep number of tiles at a time
          restTiles.slice(i, i + compositeStep)
            .map((n) => ({
              input: imgPath(...restTiles[n]),
              left: (restTiles[n][0] - baseX) * tileWidth,
              top: (restTiles[n][1] - baseY) * tileWidth,
            })),
        );
    }

    // Set quality
    return composited.toFormat(format.replace(/[0-9]/g, ''), formatOptions);
  });
};

export { downloadTile, generateImage, imgPath };
