var cssSprites = function (conf) {
  var templateFunction = function (data) {
    var scale = conf.scale || 1
    var unit = conf.unit || 'px'

    var toFormat = function (data) {
      return data / scale + unit
    }

    var perSprite = data.sprites.map(function (sprite) {
      return '.ico-N { background-image: url(I); background-size: P Q ;width: W; height: H; background-position: X Y; background-repeat: no-repeat;}'
        .replace('I', sprite.image)
        .replace('P', toFormat(sprite.total_width))
        .replace('Q', toFormat(sprite.total_height))
        .replace('N', sprite.name)
        .replace('W', toFormat(sprite.width))
        .replace('H', toFormat(sprite.height))
        .replace('X', toFormat(sprite.offset_x))
        .replace('Y', toFormat(sprite.offset_y))
    }).join('\n')

    return perSprite
  }
  return templateFunction
}

module.exports = cssSprites
