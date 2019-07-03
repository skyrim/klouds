$(function() {
  var code = document.getElementById('fiddle-code')
  var jq_code = document.getElementById('fiddle-jq-code')
  var mySky = new Klouds({
    selector: '#myCanvas',
    layerCount: 5
  })
  onChange(mySky)

  new Klouds({
    selector: '#second-cloud',
    bgColor: 'white',
    cloudColor1: 'white',
    cloudColor2: '#fc0'
  })

  var layerCount = document.getElementById('klouds-range')
  layerCount.addEventListener('input', function(e) {
    mySky.setLayerCount(parseInt(e.target.value))
    onChange(mySky)
  })

  var speed = document.getElementById('klouds-speed')
  speed.addEventListener('input', function(e) {
    mySky.speed = e.target.value
    onChange(mySky)
  })

  $('#klouds-cloudcolor1').spectrum({
    color: '#19b2cc',
    showButtons: false,
    preferredFormat: 'hex',
    move: function(color) {
      mySky.setCloudColor1(color.toHexString())
      onChange(mySky)
    }
  })

  $('#klouds-cloudcolor2').spectrum({
    color: '#ffffff',
    showButtons: false,
    preferredFormat: 'hex',
    move: function(color) {
      mySky.setCloudColor2(color.toHexString())
      onChange(mySky)
    }
  })

  $('#klouds-bgcolor').spectrum({
    color: '#00667f',
    showButtons: false,
    preferredFormat: 'hex',
    move: function(color) {
      mySky.setBgColor(color.toHexString())
      onChange(mySky)
    }
  })

  function formatColor(color) {
    return (
      '#' +
      color
        .map(function(c) {
          return Math.round(c * 255).toString(16)
        })
        .join('')
    )
  }

  function onChange(sky) {
    var CODE =
      "<pre style='color:#000000;background:#ffffff;'><span style='color:#800000; font-weight:bold; '>var</span> mySky <span style='color:#808030; '>=</span> <span style='color:#800000; font-weight:bold; '>new</span> Klouds<span style='color:#808030; '>(</span><span style='color:#800080; '>{</span>\n" +
      "    selector<span style='color:#800080; '>:</span> <span style='color:#800000; '>'</span><span style='color:#0000e6; '>#myCanvas</span><span style='color:#800000; '>'</span><span style='color:#808030; '>,</span>\n" +
      "    layerCount<span style='color:#800080; '>:</span> <span style='color:#008c00; '>LAYER_COUNT</span><span style='color:#808030; '>,</span>\n" +
      "    speed<span style='color:#800080; '>:</span> <span style='color:#008c00; '>SPEED</span><span style='color:#808030; '>,</span>\n" +
      "    cloudColor1<span style='color:#800080; '>:</span> <span style='color:#800000; '>'</span><span style='color:#0000e6; '>CLOUD_COLOR1</span><span style='color:#800000; '>'</span><span style='color:#808030; '>,</span>\n" +
      "    cloudColor2<span style='color:#800080; '>:</span> <span style='color:#800000; '>'</span><span style='color:#0000e6; '>CLOUD_COLOR2</span><span style='color:#800000; '>'</span><span style='color:#808030; '>,</span>\n" +
      "    bgColor<span style='color:#800080; '>:</span> <span style='color:#800000; '>'</span><span style='color:#0000e6; '>BG_COLOR</span><span style='color:#800000; '>'</span>\n" +
      "<span style='color:#800080; '>}</span><span style='color:#808030; '>)</span>\n" +
      '</pre>'
    CODE = CODE.replace('LAYER_COUNT', sky.layerCount)
    CODE = CODE.replace('SPEED', sky.speed)
    CODE = CODE.replace('CLOUD_COLOR1', formatColor(sky.cloudColor1))
    CODE = CODE.replace('CLOUD_COLOR2', formatColor(sky.cloudColor2))
    CODE = CODE.replace('BG_COLOR', formatColor(sky.bgColor))
    code.innerHTML = CODE

    var JQ_CODE =
      "<pre style='color:#000000;background:#ffffff;'>$<span style='color:#808030; '>(</span><span style='color:#800000; '>'</span><span style='color:#0000e6; '>#myCanvas</span><span style='color:#800000; '>'</span><span style='color:#808030; '>)</span><span style='color:#808030; '>.</span>Klouds<span style='color:#808030; '>(</span><span style='color:#800080; '>{</span>\n" +
      "    layerCount<span style='color:#800080; '>:</span> <span style='color:#008c00; '>LAYER_COUNT</span><span style='color:#808030; '>,</span>\n" +
      "    speed<span style='color:#800080; '>:</span> <span style='color:#008c00; '>SPEED</span><span style='color:#808030; '>,</span>\n" +
      "    cloudColor1<span style='color:#800080; '>:</span> <span style='color:#800000; '>'</span><span style='color:#0000e6; '>CLOUD_COLOR1</span><span style='color:#800000; '>'</span><span style='color:#808030; '>,</span>\n" +
      "    cloudColor2<span style='color:#800080; '>:</span> <span style='color:#800000; '>'</span><span style='color:#0000e6; '>CLOUD_COLOR2</span><span style='color:#800000; '>'</span><span style='color:#808030; '>,</span>\n" +
      "    bgColor<span style='color:#800080; '>:</span> <span style='color:#800000; '>'</span><span style='color:#0000e6; '>BG_COLOR</span><span style='color:#800000; '>'</span>\n" +
      "<span style='color:#800080; '>}</span><span style='color:#808030; '>)</span>\n" +
      '</pre>'
    JQ_CODE = JQ_CODE.replace('LAYER_COUNT', sky.layerCount)
    JQ_CODE = JQ_CODE.replace('SPEED', sky.speed)
    JQ_CODE = JQ_CODE.replace('CLOUD_COLOR1', formatColor(sky.cloudColor1))
    JQ_CODE = JQ_CODE.replace('CLOUD_COLOR2', formatColor(sky.cloudColor2))
    JQ_CODE = JQ_CODE.replace('BG_COLOR', formatColor(sky.bgColor))
    jq_code.innerHTML = JQ_CODE
  }
})
