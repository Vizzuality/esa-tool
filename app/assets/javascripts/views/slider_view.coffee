'use strict'

class SliderView extends Backbone.View

  defaults:
    infinite: false
    speed: 150

  initialize: (options)->
    @options = _.extend {}, @defaults, options
    @$el.slick @options

@Slider = SliderView
