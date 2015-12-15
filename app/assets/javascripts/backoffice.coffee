#= require jquery2
#= require jquery_ujs
#= require cocoon
#= require tagsinput
#= require underscore
#= require backbone

class BoxSelector extends Backbone.View

  events:
    'click .item': 'onClickItem'
    'change .input': 'toggleCustomPalette'

  initialize: ->
    @$input = @$el.find '.input'
    @$palette = $ '#customPalette'

  # Function when a box is clicked
  onClickItem: (e)->
    @$current = $ e.currentTarget
    @selectCurrent()
    @updateValue()

  # Function to select current box
  selectCurrent: ->
    @$current.addClass('_selected')
      .siblings().removeClass('_selected')

  # Function to update input value
  updateValue: ->
    @$input.val(@$current.data('value')).trigger('change')

  # Function to toggle custom palette
  toggleCustomPalette: (e)->
    value = e.currentTarget.value
    if value != ''
      @$palette.addClass('_hidden')
    else
      @$palette.removeClass('_hidden')


class AppView extends Backbone.View

  initialize: ->
    @inputAsTags()
    @previewImage()

    @$el.find('.box-selector').each ->
      new BoxSelector(el: @)

  # Function to create interactive tags for text inputs
  inputAsTags: ->
    @$el.find('.tags').tagsinput delimiter: [' ']

  # Function to active the image preview in file inputs
  previewImage: ->
    @$el.find('input[type="file"]').on 'change', (e)->
      reader = new FileReader()
      reader.onload = ->
        $(e.currentTarget).css 'background-image', "url(#{reader.result})"
      reader.readAsDataURL e.target.files[0]


$ ->

  new AppView(el: 'body')

