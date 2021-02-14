# Mapboxed
Generate assembled mapbox tilesets.

## CLI

```
Usage: mapboxed [options]

Downloads tiles from mapbox and stitches them together into one image file

Options:
  -V, --version              output the version number
  -z, --zoom <zoom>          zoom level
  -l, --location <location>  string query specifying the location of interest
  -x1 <x1>                   left longitude boundary
  -x2 <x2>                   right longitude boundary
  -y1 <y1>                   top latitude boundary
  -y2 <y2>                   bottom latitude boundary
  -o, --outfile <outfile>    output filename (default: "mapboxed.jpg")
  -t, --tileset <tileset>    mapbox tileset id (default: "mapbox.satellite")
  -k, --key <token>          mapbox token (will override read from MAPBOX_TOKEN 
                             environment variable)
  -f, --format <format>      image format to download (jpg90 | jpg80 | jpg70 | 
                             png256 | png128 | png64 | png32 | png) (default: "jpg90")
  -p, --parallel <parallel>  Number of parallel connection to make to mapbox (default: "5")
  -r, --res2x                fetch @2x size resolution
  -s, --silent               do not confirm download size
  -c, --cache                keep and read from temp tile files in .mapboxed
  -h, --help                 display help for command
```

## Examples
with [npm version 5.2.0 or up](https://github.com/npm/npm/releases/tag/v5.2.0), directly run the following commands in the terminal, no extra installation necessary. (Note: you will need a [mapbox access token](https://account.mapbox.com/) to be set with the environment variable `MAPBOX_TOKEN` or passed in with `-k`)

```
npx mapboxed -z 9 -x1 -123.0652 -y1 38.1799 -x2 -120.1163 -y2 37.1431
```

<img src="https://raw.githubusercontent.com/dkaoster/mapboxed/main/demo/mapboxed1.jpg" width="100%" />

```
npx mapboxed -z 9 -x1 -123.0652 -y1 38.1799 -x2 -120.1163 -y2 37.1431 -t mapbox.mapbox-terrain-v2
```

<img src="https://raw.githubusercontent.com/dkaoster/mapboxed/main/demo/mapboxed2.jpg" width="100%" />
