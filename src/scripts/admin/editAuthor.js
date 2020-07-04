const $searchResultsContainer = $("#searchResultsContainer"),
  $authorsBooks = $("#authorsBooks");

function updatePicture(value) {
  clearTimeout(timer);
  timer = setTimeout(() => {
    $imageUpdate = $("#imageUpdate")[0];
    $imageUpdate.src = value;
  }, 250);
}
function removeBookFromAuthor(bookToRemove) {
  $(`#${bookToRemove}-div`).remove();
}
function addBookToAuthor(bookToAddId, bookToAddImage) {
  $(`#${bookToAddId}-link`).remove();

  var divBook = $("<div/>", {
    id: `${bookToAddId}-div`,
    "class": 'update-book-ref horizontal-container',
  }).appendTo($authorsBooks);

  $("<input/>", {
    "class": 'btn btn-outline-danger full-width row sm-remove-button',
    type: 'button',
    value: "Remove",
    on: {
      click: (() => {
        removeBookFromAuthor(bookToAddId)
      })
    },
  }).appendTo(divBook);

  $("<input/>", {
    id: bookToAddId,
    "class": 'book-image row',
    type: 'image',
    src: bookToAddImage,
    prop: {
      "disabled": true
    },
  }).appendTo(divBook);

  $("<input/>", {
    name: 'updateAuthorBooks',
    value: bookToAddId,
    prop: {
      "hidden": true
    },
  }).appendTo(divBook);
}
function removeReference() {
  var $unorderedUpdateReferenceList = $("#unorderedUpdateReferenceList");

  $unorderedUpdateReferenceList.children().children().last().remove();
}
function addReference() {
  var $unorderedUpdateReferenceList = $("#unorderedUpdateReferenceList");

  $("<input/>", {
    "class": 'full-width margin-top-10 form-control',
    name: 'updateReferenceList',
    value: ''
  }).appendTo($unorderedUpdateReferenceList.children().last());
}

function searchForBook(value) {
  clearTimeout(timer);
  timer = setTimeout(() => {
    $searchResultsContainer.empty();
    axios.get(`/search/books?query=${value}`).then((req) => {
      if (req.data.length) {
        req.data.forEach(element => {
          if ($authorsBooks.find($(`#${element._id}`)).length == 0) {
            $("<input/>", {
              id: `${element._id}-link`,
              "class": 'searched-book-result form-control',
              type: 'button',
              value: element.title,
              on: {
                click: (() => {
                  addBookToAuthor(element._id, element.image)
                })
              }
            }).appendTo($searchResultsContainer);
          }
        });
      }
    }).catch(err => {
    });
  }, 250);
}
