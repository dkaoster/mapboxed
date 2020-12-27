const validateParams = params => {

  // Download options
  const MAPBOX_TOKEN = params.key || process.env.MAPBOX_TOKEN;
  const tileset_id = commander.tileset;
  const format = commander.format;

  // Check for mapbox token
  if (!MAPBOX_TOKEN) {
    console.error('No mapbox token found, please pass your mapbox API token via --key or set the MAPBOX_TOKEN environment variable.');
    process.exit(1);
  }

  // Process format
  if (['jpg', 'png'].indexOf(format.replace(/[0-9]/g, '')) < 0) {
    console.error('format must be one of (jpg90 | jpg80 | jpg70 | png256 | png128 | png64 | png32 | png)');
    process.exit(1);
  }

  // Process zoom value
  let zoom;
  try {
    zoom = parseInt(commander.zoom);
    if (zoom < 0) throw new Error();
  } catch (e) {
    console.error('zoom must be an integer greater than or equal to 0');
    process.exit(1);
  }

  // Process longitude / latitude values
  let layerBounds;
  try {
    layerBounds = [
      parseFloat(commander.X1),
      parseFloat(commander.Y1),
      parseFloat(commander.X2),
      parseFloat(commander.Y2)
    ];

    if (
      layerBounds[0] >= layerBounds[2]
      || layerBounds[1] <= layerBounds[3]
      || layerBounds[0] > 180
      || layerBounds[0] < -180
      || layerBounds[2] > 180
      || layerBounds[2] < -180
      || layerBounds[1] > 90
      || layerBounds[1] < -90
      || layerBounds[3] > 90
      || layerBounds[3] < -90
    ) throw new Error()
  } catch (e) {
    console.error('invalid latitude / longitude values. x values must be between -180 and 180, y values between -90 and 90. x2 must be greater than x1, y2 must be less than y1.');
    process.exit(1)
  }
};

export default validateParams;