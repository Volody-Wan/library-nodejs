/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-undef */
const $searchResultsContainer = $('#searchResultsContainer');
const $authorsBooks = $('#authorsBooks');

function updatePicture(value) {
  clearTimeout(timer);
  timer = setTimeout(() => {
    $editImage = $('#editImage')[0];
    $editImage.src = value;
  }, 250);
}
function removeBookFromAuthor(bookToRemove) {
  $(`#${bookToRemove}-div`).remove();
}
function addBookToAuthor(bookToAddId, bookToAddImage) {
  $(`#${bookToAddId}-link`).remove();

  const divBook = $('<div/>', {
    id: `${bookToAddId}-div`,
    class: 'update-book-ref horizontal-container',
  }).appendTo($authorsBooks);

  $('<input/>', {
    class: 'btn btn-outline-danger full-width row sm-remove-button book-image',
    type: 'button',
    value: 'Remove',
    on: {
      click: (() => {
        removeBookFromAuthor(bookToAddId);
      }),
    },
  }).appendTo(divBook);

  $('<input/>', {
    id: bookToAddId,
    class: 'book-image row',
    type: 'image',
    src: bookToAddImage,
    prop: {
      disabled: true,
    },
  }).appendTo(divBook);

  $('<input/>', {
    name: 'editAuthorBooks',
    value: bookToAddId,
    prop: {
      hidden: true,
    },
  }).appendTo(divBook);
}
function searchForBook(value) {
  clearTimeout(timer);
  timer = setTimeout(() => {
    $searchResultsContainer.empty();
    axios.get(`/search/books?query=${value}`).then((req) => {
      if (req.data.length) {
        req.data.forEach((element) => {
          if ($authorsBooks.find($(`#${element._id}`)).length === 0) {
            $('<input/>', {
              id: `${element._id}-link`,
              class: 'searched-book-result form-control',
              type: 'button',
              value: element.title,
              on: {
                click: (() => {
                  addBookToAuthor(element._id, element.image);
                }),
              },
            }).appendTo($searchResultsContainer);
          }
        });
      }
    }).catch((err) => {
    });
  }, 250);
}
