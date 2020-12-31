import { deg2num, num2deg, tileURL, generateTiles } from '../tiles';

test('Test deg2num', () => {
  expect(deg2num(120, 24, 2 ** 15)).toMatchSnapshot();
  expect(deg2num(120, -45, 2 ** 10)).toMatchSnapshot();
  expect(deg2num(120, -45, 2 ** 1)).toMatchSnapshot();
  expect(deg2num(-120, -45, 2 ** 10)).toMatchSnapshot();
  expect(deg2num(-120, 45, 2 ** 10)).toMatchSnapshot();
});

test('Test num2deg', () => {
  expect(num2deg(27306, 14132, 2 ** 15)).toMatchSnapshot();
  expect(num2deg(853, 655, 2 ** 10)).toMatchSnapshot();
  expect(num2deg(1, 1, 2 ** 1)).toMatchSnapshot();
  expect(num2deg(170, 655, 2 ** 10)).toMatchSnapshot();
  expect(num2deg(170, 368, 2 ** 10)).toMatchSnapshot();
});

test('Test num2deg <> deg2num', () => {
  const expectBackAndForth = (x, y, z) => {
    expect(deg2num(...num2deg(x, y, 2 ** z), 2 ** z)).toEqual([x, y]);
  };

  expectBackAndForth(18568, 23252, 15);
  expectBackAndForth(384, 728, 10);
  expectBackAndForth(0, 1, 1);
  expectBackAndForth(284, 297, 10);
  expectBackAndForth(640, 297, 10);
});

test('Test generateTiles', () => {
  expect(generateTiles({ bounds: [120, 24, 122, 22], n: 2 ** 10 })).toMatchSnapshot();
});

test('Test tileURL', () => {
  expect(tileURL(
    {
      tileset: 'stuff', zoom: '2', res2x: false, format: 'png', MAPBOX_TOKEN: 'test_token',
    },
    100,
    200,
  )).toMatchSnapshot();
});
