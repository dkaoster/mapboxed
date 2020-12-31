/**
 * Slippy Tileset calculation functions
 *
 * https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Lon..2Flat._to_tile_numbers
 */
// Convert lat / long to tile location
const deg2num = (lonDeg, latDeg, n) => {
  const latRad = latDeg * (Math.PI / 180);
  const xtile = Math.floor(n * ((lonDeg + 180) / 360));
  const ytile = Math.floor(n * ((1 - (Math.asinh(Math.tan(latRad))) / Math.PI) / 2));
  return [xtile, ytile];
};

// Convert tile location to lat / long
const num2deg = (x, y, n) => {
  const lonDeg = (x / n) * 360 - 180;
  const latRad = Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / n)));
  const latDeg = latRad * (180 / Math.PI);
  return [lonDeg, latDeg];
};

/**
 * Generate the tiles we need for this instance
 */
const generateTiles = ({ bounds, n }) => {
  let tiles = [];
  const min = deg2num(bounds[0], bounds[1], n);
  const max = deg2num(bounds[2], bounds[3], n);
  const xRange = [min[0], max[0]].sort();
  const yRange = [min[1], max[1]].sort();
  const xTilesLength = xRange[1] - xRange[0];
  const yTilesLength = yRange[1] - yRange[0];
  for (let x = xRange[0]; x <= xRange[1]; x += 1) {
    for (let y = yRange[0]; y <= yRange[1]; y += 1) {
      tiles = tiles.concat([[x, y]]);
    }
  }
  return { tiles, min, max, xTilesLength, yTilesLength };
};

/**
 * Mapbox Tile URL
 */
const tileURL = ({ tileset, zoom, res2x, format, MAPBOX_TOKEN }, x, y) => `https://api.mapbox.com/v4/${tileset}/${zoom}/${x}/${y}${res2x ? '@2x' : ''}.${format}?access_token=${MAPBOX_TOKEN}`;

export { deg2num, num2deg, generateTiles, tileURL };
