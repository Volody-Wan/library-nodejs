let timer;
const $searchResults = $("#searchResults");
const $title = $("#title")[0].innerText;

function search(value) {
  if (value.length >= 2) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      (async function apiCall() {
        $searchResults.html("");
        if ($title === 'Authors') {
          searchAuthors(value);
        } else if ($title === 'Books') {
          searchBooks(value);
        }
      }());
    }, 300);
  } else {
    $searchResults.html("");
    $searchResults.fadeOut();
  }
}
function searchAuthors(value) {
  axios.get(`/search/authors?query=${value}`).then((req) => {
    if (req.data.length) {
      $searchResults.fadeIn();
      req.data.forEach(author => {
        $searchResults.append(`<a  class="searchLink" href="/authors/${author._id}"><p>${author.name}</p></a>`);
      });
    } else {
      $searchResults.append('<p>No match</p>');
    }
  }).catch(err => {
    $searchResults.append('<p>No match</p>');
  });
}
function searchBooks(value) {
  axios.get(`/search/books?query=${value}`).then((req) => {
    if (req.data.length) {
      $searchResults.fadeIn();
      req.data.forEach(book => {
        $searchResults.append(`<a  class="searchLink" href="/books/${book._id}"><p>${book.title}</p></a>`);
      });
    } else {
      $searchResults.append('<p>No match</p>');
    }
  }).catch(err => {
    $searchResults.append('<p>No match</p>');
  });
}