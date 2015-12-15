#= require jquery2
#= require jquery_ujs
#= require slick.js/slick.js
#= require underscore
#= require backbone
#= require_tree ./views

class AppView extends @Slider

  initialize: ->
    super 'initialize'

onReady = ->
  new AppView el: '#mainSlider'

document.addEventListener 'DOMContentLoaded', onReady
