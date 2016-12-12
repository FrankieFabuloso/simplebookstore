$( document ).ready(function() {
  $('#newBook').ready( function() {
    $('.clickAddAuthor').click( function(event) {
      event.preventDefault();
      $('.author').prepend('<button class="clickRemAuthor glyphicon glyphicon-remove btn btn-xs"></button><input class="form-control" id="bookAuthor" type="text" placeholder="Author" name="author">')
    })

    $('.clickAddGenre').click( function(event) {
      event.preventDefault();
      $('.genre').prepend('<button class="clickRemGenre glyphicon glyphicon-remove btn btn-xs"></button><input class="form-control" id="bookGenre" type="text" placeholder="Genre" name="genre">')
    })

    $('.clickRemAuthor').click( function(event) {
      event.preventDefault()
      $(this).next( "#bookAuthor" ).remove()
      $(this).remove()
    })

    $('.clickRemGenre').click( function(event) {
      event.preventDefault()
      $(this).next( "#bookGenre" ).remove()
      $(this).remove()
    })

  })
});
