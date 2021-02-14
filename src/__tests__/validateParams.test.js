import validateParams from '../validateParams';

test('Test empty validateParams', async () => {
  await expect(() => validateParams()).rejects.toThrow();
  await expect(() => validateParams({})).rejects.toThrowErrorMatchingSnapshot();
});

test('Test invalid validateParams', async () => {
  process.env.MAPBOX_TOKEN = 'test_key';
  await expect(() => validateParams({ format: 'pdf' })).rejects.toThrowErrorMatchingSnapshot();
  await expect(() => validateParams({ format: 'png', zoom: 'q' })).rejects.toThrowErrorMatchingSnapshot();
  await expect(() => validateParams({ format: 'png', zoom: '-1' })).rejects.toThrowErrorMatchingSnapshot();
  await expect(() => validateParams({
    format: 'png', zoom: '2', X1: '120', X2: '120', Y1: '120', Y2: '120',
  })).rejects.toThrowErrorMatchingSnapshot();
  await expect(() => validateParams({
    format: 'png', zoom: '2', X1: '120', X2: '122', Y1: '122', Y2: '120',
  })).rejects.toThrowErrorMatchingSnapshot();
  await expect(() => validateParams({
    format: 'png', zoom: '2', X1: '120', X2: '122', Y1: '5', Y2: '4',
  })).rejects.toThrowErrorMatchingSnapshot();
  await expect(() => validateParams({
    format: 'png', zoom: '2', X1: '120', X2: '122', Y1: '5', Y2: '4', tileset: 'terrain.rgb',
  })).rejects.toThrowErrorMatchingSnapshot();
});

test('Test valid validateParams', async () => {
  expect(await validateParams({
    tileset: 'mapbox.satellite',
    key: 'test_key',
    format: 'jpg90',
    zoom: '4',
    X1: '120',
    X2: '122',
    Y1: '24',
    Y2: '23',
    res2x: false,
    parallel: '4',
  })).toMatchSnapshot();
});
