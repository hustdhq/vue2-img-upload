var scssSprites = function (conf) {
  var sprites = function (data) {
    var scale = conf.scale || 1
    var unit = conf.unit || 'px'

    var toFormat = function (data) {
      return data / scale + unit
    }

    var perSprite = data.sprites.map(function (sprite) {
      var item = '$N: (X, Y, OX, OY, W, H, TW, TH, "SCR", "NA", );'
        .replace('N', sprite.name)
        .replace('X', toFormat(sprite.x))
        .replace('Y', toFormat(sprite.y))
        .replace('OX', toFormat(sprite.offset_x))
        .replace('OY', toFormat(sprite.offset_y))
        .replace('W', toFormat(sprite.width))
        .replace('H', toFormat(sprite.height))
        .replace('TW', toFormat(sprite.total_width))
        .replace('TH', toFormat(sprite.total_height))
        .replace('SCR', sprite.image)
        .replace('NA', sprite.name)
      return item
    }).join('\n')

    var mixin = ''
    mixin += '@mixin sprite-width($sprite) {\n'
    mixin += '  width: nth($sprite, 5);\n'
    mixin += '}\n'

    mixin += '@mixin sprite-height($sprite) {\n'
    mixin += '  height: nth($sprite, 6);\n'
    mixin += '}\n'

    mixin += '@mixin sprite-position($sprite) {\n'
    mixin += '  $sprite-offset-x: nth($sprite, 3);\n'
    mixin += '  $sprite-offset-y: nth($sprite, 4);\n'
    mixin += '  background-position: $sprite-offset-x  $sprite-offset-y;\n'
    mixin += '}\n'

    mixin += '@mixin sprite-size($sprite) {\n'
    mixin += '  $sprite-width: nth($sprite, 7);\n'
    mixin += '  $sprite-height: nth($sprite, 8);\n'
    mixin += '  background-size: $sprite-width  $sprite-height;\n'
    mixin += '}\n'

    mixin += '@mixin sprite-image($sprite) {\n'
    mixin += '  $sprite-image: nth($sprite, 9);\n'
    mixin += '  background-image: url(#{$sprite-image});\n'
    mixin += '}\n'

    mixin += '@mixin sprite($sprite) {\n'
    mixin += '  @include sprite-image($sprite);\n'
    mixin += '  @include sprite-position($sprite);\n'
    mixin += '  @include sprite-size($sprite);\n'
    mixin += '  @include sprite-width($sprite);\n'
    mixin += '  @include sprite-height($sprite);\n'
    mixin += '  background-repeat: no-repeat;\n'
    mixin += '}\n'

    mixin += '@mixin sprites($sprites) {\n'
    mixin += '  @each $sprite in $sprites {\n'
    mixin += '    $sprite-name: nth($sprite, 10);\n'
    mixin += '    .#{$sprite-name} {\n'
    mixin += '      @include sprite($sprite);\n'
    mixin += '    }\n'
    mixin += '  }\n'
    mixin += '}\n'

    return perSprite + '\n' + mixin
  }
  return sprites
}

module.exports = scssSprites
