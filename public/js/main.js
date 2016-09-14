/*global $ */
$(document).ready(function () {
  console.log('main.js linked')
  $('#shortenButton').on('click', shorten)
})

function shorten () {
  console.log("button clicked")
  $.ajax({
    url: '/new',
    type: 'POST',
    data: {originalUrl: $('#inputLink').val()},
    dataType: 'json'
  }).done(function (data) {
    console.log('data', data)
    $('#outputLink').val('http://localhost:3000/'+data)
  }).fail(function () {
    console.log('error shortening link')
    $('#inputLink').val('Please insert valid link')
  })
}
