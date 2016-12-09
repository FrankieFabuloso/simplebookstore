$( document ).ready(function() {
  $('#newBook').ready( function() {
    $('.clickAddAuthor').click( function(event) {
      event.preventDefault();
      $('.author').append('<input class="form-control" id="bookAuthor" type="text" placeholder="Author" name="author">')
    })

    $('.clickAddGenre').click( function(event) {
      event.preventDefault();
      $('.genre').append('<input class="form-control" id="bookGenre" type="text" placeholder="Genre" name="genre">')
    })
  })
});
