import axios from 'axios';

/**
 * Validate all the parameters passed in to mapboxed.
 *
 * Returns true if all parameters are valid, throws an Error if any parameter is invalid.
 *
 * Validation rules:
 *  1  - Mapbox token must be valid
 *  2  - format must be one of: jpg90, jpg80, jpg70, png256, png128, png64, png32, png
 *  3  - zoom must be an integer larger than 0
 *  4A - If location is set, then we reach for mapbox's API to get the boundingbox for
 *       coordinate values.
 *  4B - x values must be between -180 and 180, y values between -90 and 90.
 *       x2 must be greater than x1, y2 must be less than y1.
 *  5  - tileset must be set
 *  6  - parallel must be an integer greater than 0
 *
 * @param params
 */
const validateParams = async (params) => {
  if (typeof params === 'undefined') throw new Error('params is undefined');

  // Read params
  const { tileset, key, format, zoom, res2x, parallel, location } = params;
  let { X1, X2, Y1, Y2 } = params;

  // //////////////////////////////////////////////////////
  // 1. Mapbox token must be valid.
  const MAPBOX_TOKEN = key || (typeof process === 'object' && process.env.MAPBOX_TOKEN);
  if (!MAPBOX_TOKEN) {
    throw new Error(
      'No mapbox token found, please pass your mapbox API token via --key or set the MAPBOX_TOKEN environment variable.',
    );
  }

  // //////////////////////////////////////////////////////
  // 2. format must be one of: jpg90, jpg80, jpg70, png256, png128, png64, png32, png
  const validFormats = ['jpg90', 'jpg80', 'jpg70', 'png256', 'png128', 'png64', 'png32', 'png'];
  if (validFormats.indexOf(format) < 0) {
    throw new Error(`format must be one of (${validFormats.join(' | ')})`);
  }

  // //////////////////////////////////////////////////////
  // 3. zoom must be an integer larger than 0
  const zoomInt = parseInt(zoom, 10);
  if (zoomInt < 0 || Number.isNaN(zoomInt)) throw new Error('zoom must be an integer greater than or equal to 0');
  const n = 2 ** zoomInt;

  // //////////////////////////////////////////////////////
  // 4. Get the location information

  // 4A. If the location flag is specified, we query mapbox's API for
  //     geocoded coordinates.
  if (location) {
    // Download tile using axios
    const response = await axios({
      url: `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=${MAPBOX_TOKEN}`,
      method: 'GET',
    });

    // Get the bbox from the first feature.
    if (response.data && response.data.features && response.data.features[0]) {
      [X1, Y2, X2, Y1] = response.data.features[0].bbox;
    }
  }

  // 4B. x values must be between -180 and 180, y values between -90 and 90.
  //     x2 must be greater than x1, y2 must be less than y1.
  const bounds = [
    parseFloat(X1), parseFloat(Y1), parseFloat(X2), parseFloat(Y2),
  ];

  if (
    bounds[0] >= bounds[2] || bounds[1] <= bounds[3]
      || bounds[0] > 180 || bounds[0] < -180 || bounds[2] > 180 || bounds[2] < -180
      || bounds[1] > 90 || bounds[1] < -90 || bounds[3] > 90 || bounds[3] < -90
  ) {
    throw new Error(
      `invalid latitude / longitude values. x values must be between -180 and 180, y values between -90 and 90. 
      x2 must be greater than x1, y2 must be less than y1.`,
    );
  }

  // eslint-disable-next-line no-restricted-globals
  if (bounds.some((c) => isNaN(c))) throw new Error('Coordinates could not be found / used.');

  // //////////////////////////////////////////////////////
  // 5. tileset must be set
  if (!tileset) throw new Error('tileset must be set');

  // //////////////////////////////////////////////////////
  // 6. parallel must be set
  const parallelInt = parseInt(parallel, 10);
  if (parallelInt <= 0 || Number.isNaN(parallelInt)) throw new Error('parallel must be an integer greater than 0');

  // //////////////////////////////////////////////////////
  // Return processed values
  return {
    MAPBOX_TOKEN, bounds, zoom: zoomInt, n, tileset, res2x: !!res2x, parallel: parallelInt, format,
  };
};

export default validateParams;
