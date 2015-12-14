#= require jquery2
#= require jquery_ujs
#= require cocoon
#= require tagsinput

$ ->

  # Image preview for input type file
  $('input[type="file"]').on 'change', (e)->
    reader = new FileReader();
    reader.onload = ->
      $(e.currentTarget).css 'background-image', "url(#{reader.result})"
    reader.readAsDataURL(e.target.files[0]);

  # Tags
  $('.tags').tagsinput(
    delimiter: [' ']
  )

  # Box selector
  # TODO: Refactor this
  $('.box-selector').each ()->
    $el = $(@)

    $input = $el.find('.input')

    $el.find('.item').on('click', ()->
      $current = $(@)
      value = $current.data('value')

      $current.addClass('_selected')
        .siblings()
        .removeClass('_selected')

      $input.val(value)

      # For custom palette
      if value != ''
        $('#customPalette').addClass('_hidden')
      else
        $('#customPalette').removeClass('_hidden')
    )
