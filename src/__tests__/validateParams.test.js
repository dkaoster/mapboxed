import validateParams from '../validateParams';

test('Test empty validateParams', () => {
  expect(() => validateParams()).toThrow();
  expect(() => validateParams({})).toThrowErrorMatchingSnapshot();
});

test('Test invalid validateParams', () => {
  process.env.MAPBOX_TOKEN = 'test_key';
  expect(() => validateParams({ format: 'pdf' })).toThrowErrorMatchingSnapshot();
  expect(() => validateParams({ format: 'png', zoom: 'q' })).toThrowErrorMatchingSnapshot();
  expect(() => validateParams({ format: 'png', zoom: '-1' })).toThrowErrorMatchingSnapshot();
  expect(() => validateParams({
    format: 'png', zoom: '2', X1: '120', X2: '120', Y1: '120', Y2: '120',
  })).toThrowErrorMatchingSnapshot();
  expect(() => validateParams({
    format: 'png', zoom: '2', X1: '120', X2: '122', Y1: '122', Y2: '120',
  })).toThrowErrorMatchingSnapshot();
  expect(() => validateParams({
    format: 'png', zoom: '2', X1: '120', X2: '122', Y1: '5', Y2: '4',
  })).toThrowErrorMatchingSnapshot();
  expect(() => validateParams({
    format: 'png', zoom: '2', X1: '120', X2: '122', Y1: '5', Y2: '4', tileset: 'terrain.rgb',
  })).toThrowErrorMatchingSnapshot();
});

test('Test valid validateParams', () => {
  expect(validateParams({
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
