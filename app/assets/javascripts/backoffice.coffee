#= require jquery2
#= require jquery_ujs
#= require cocoon

$ ->

  # Image preview for input type file
  $('input[type="file"]').on 'change', (e)->
    reader = new FileReader();
    reader.onload = ->
      $(e.currentTarget).css 'background-image', "url(#{reader.result})"
    reader.readAsDataURL(e.target.files[0]);
