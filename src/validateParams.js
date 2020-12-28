/**
 * Validate all the parameters passed in to mapboxed.
 *
 * Returns true if all parameters are valid, throws an Error if any parameter is invalid.
 *
 * Validation rules:
 *  1 - Mapbox token must be valid
 *  2 - format must be one of: jpg90, jpg80, jpg70, png256, png128, png64, png32, png
 *  3 - zoom must be an integer larger than 0
 *  4 - x values must be between -180 and 180, y values between -90 and 90.
 *      x2 must be greater than x1, y2 must be less than y1.
 *
 * @param params
 */
const validateParams = (params) => {
  // //////////////////////////////////////////////////////
  // 1. Mapbox token must be valid.
  const MAPBOX_TOKEN = params.key || (typeof process === 'object' && process.env.MAPBOX_TOKEN);
  if (!MAPBOX_TOKEN) {
    throw new Error(
      'No mapbox token found, please pass your mapbox API token via --key or set the MAPBOX_TOKEN environment variable.',
    );
  }

  // //////////////////////////////////////////////////////
  // 2. format must be one of: jpg90, jpg80, jpg70, png256, png128, png64, png32, png
  const validFormats = ['jpg90', 'jpg80', 'jpg70', 'png256', 'png128', 'png64', 'png32', 'png'];
  if (validFormats.indexOf(params.format) < 0) {
    throw new Error(`format must be one of (${validFormats.join(' | ')})`);
  }

  // //////////////////////////////////////////////////////
  // 3. zoom must be an integer larger than 0
  if (parseInt(params.zoom, 10) < 0) throw new Error('zoom must be an integer greater than or equal to 0');

  // //////////////////////////////////////////////////////
  // 4. x values must be between -180 and 180, y values between -90 and 90.
  //    x2 must be greater than x1, y2 must be less than y1.
  const layerBounds = [
    parseFloat(params.X1), parseFloat(params.Y1), parseFloat(params.X2), parseFloat(params.Y2),
  ];

  if (
    layerBounds[0] >= layerBounds[2] || layerBounds[1] <= layerBounds[3]
    || layerBounds[0] > 180 || layerBounds[0] < -180
    || layerBounds[2] > 180 || layerBounds[2] < -180
    || layerBounds[1] > 90 || layerBounds[1] < -90
    || layerBounds[3] > 90 || layerBounds[3] < -90
  ) {
    throw new Error(
      `invalid latitude / longitude values. x values must be between -180 and 180, y values between -90 and 90. 
      x2 must be greater than x1, y2 must be less than y1.`,
    );
  }

  // //////////////////////////////////////////////////////
  // Return processed values
  return true;
};

export default validateParams;
