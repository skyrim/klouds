# Klouds

Simple JavaScript library that generates animated clouds using WebGL.

Check out the demo [here](http://skyrim.github.io/klouds)


## Usage

Assuming that you have a canvas element on a page with an id `my-canvas`.

``` html
<canvas id="my-canvas"></canvas>
```

You can use the library in the following ways:

### Using script tag

``` html
<!-- either download library files from the lib directory and link the file -->
<script src="klouds.min.js"></script>

<!-- or use a service like unpkg -->
<script src="https://unpkg.com/klouds"></script>

<!-- then call the function klouds.create -->
<script>
  klouds.create({
    selector: '#my-canvas'
  })
</script>
```

### Using jQuery

``` html
<script src="jquery.min.js"></script>

<!-- klouds must be included after jquery -->
<script src="klouds.min.js"></script>
<script>
  $('#my-canvas').Klouds()
</script>
```

### Using npm/yarn/bower etc.

```
npm install klouds
```

``` javascript
import * as klouds from 'klouds'

klouds.create({
  selector: '#my-canvas'
})
```

Note: Typescript definition files are provided with the library.

### Options

Function `klouds.create` takes a single object argument.

name | required | type | description | default value | example values
-----|----------|------|-------------|---------------|---------------
`selector` | true | `string` \| `HTMLCanvasElement` | A selector string to your canvas element or an actual canvas element <br /> <br /> Note: jQuery plugin of this library does not require selector as an option. | | `"#your-canvas-id"`
`speed` | false | `number` | Cloud movement speed. Positive speed go to the left, negative go to the right side. Zero value makes the clouds stand still. | `1` | `0` <br /> `42` <br /> `-21`
`layerCount` | false | `number` | Number of cloud paralax layers. Can go from 1 to 8. | `3` | `1` <br /> `5` <br /> `8`
`bgColor` | false | `string` \| `number[]` | Color of the sky behind the clouds | `[0.0, 102, 128]` | `"cyan"` <br /> `"#f9c900"` <br /> `"rgb(255, 128, 0)"` <br /> `[0, 128, 220]`
`cloudColor1` | false | `string` \| `number[]` | Color of the first cloud layer. Cloud layers between first and last layer have a interpolated color. | `[25, 178, 204]` | `"cyan"` <br /> `"#f9c900"` <br /> `"rgb(255, 128, 0)"` <br /> `[0, 128, 220]`
`cloudColor2` | false | `string` \| `number[]` | Color of the last cloud layer. Cloud layers between first and last layer have a interpolated color. | `[255, 255, 255]` | `"cyan"` <br /> `"#f9c900"` <br /> `"rgb(255, 128, 0)"` <br /> `[0, 128, 220]`

------------

`klouds.create` returns an object with method that allow you to change clouds after you've created them, see the current values or start and stop the rendering of the clouds. The methods are the following:

method | description
----|----
start | Start the rendering of the clouds
stop | Stop the rendering of the clouds
getSpeed | Returns the current cloud speed
setSpeed | Changes the cloud speed
getLayerCount | Returns the current number of cloud layers
setLayerCount | Changes the number of cloud layers
getBgColor | Returns the current cloud background sky color
setBgColor | Changes the cloud background sky color
getCloudColor1 | Returns the current first cloud color
setCloudColor1 | Changes the first cloud color
getCloudColor2 | Returns the current last cloud color
setCloudColor2 | Changes the last cloud color

### Example

``` javascript
var clouds = klouds.create({
  selector: '#my-cloud-canvas',
  speed: 5,
  layerCount: 7,
  bgColor: 'white',
  cloudColor1: 'white',
  cloudColor2: 'red'
})

// later you could for example changed the speed
clouds.setSpeed(10)
```