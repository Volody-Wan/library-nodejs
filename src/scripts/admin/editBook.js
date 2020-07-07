/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-undef */
const $searchResultsContainer = $('#searchResultsContainer');
const $bookAuthor = $('#bookAuthor');
const $bookAuthorId = $('#bookAuthorId');

function updatePicture(value) {
  clearTimeout(timer);
  timer = setTimeout(() => {
    $editBookImage = $('#editBookImage')[0];
    $editBookImage.src = value;
  }, 250);
}
function chooseAuthor(_id, name) {
  $searchResultsContainer[0].innerHTML = '';
  $bookAuthor[0].value = name;
  $bookAuthorId[0].value = _id;
}
function searchForAuthor(value) {
  clearTimeout(timer);
  timer = setTimeout(() => {
    $searchResultsContainer.empty();
    axios.get(`/search/authors?query=${value}`).then((req) => {
      if (req.data.length) {
        req.data.forEach((element) => {
          $('<input/>', {
            id: `${element._id}-link`,
            class: 'searched-book-result form-control margin-top-10',
            style: 'font-size: 10px;',
            type: 'button',
            value: element.name,
            on: {
              click: (() => {
                chooseAuthor(element._id, element.name);
              }),
            },
          }).appendTo($searchResultsContainer);
        });
      }
    }).catch((err) => {
    });
  }, 250);
}
