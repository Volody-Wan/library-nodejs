/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const $recommendedContainer = $('#recommendedContainer');
const $searchResultsContainer = $('#searchResultsContainer');

function recommendedContainerSize() {
  $recommendedContainer.css({
    'max-height': $(window).height(),
  });
  $searchResultsContainer.css({
    'max-height': $(window).height(),
  });
}
$(window).bind('load', () => {
  recommendedContainerSize();
});

function removeRecommendedBook(bookToRemove) {
  $(`#${bookToRemove}`).remove();
}

function searchForBook(value) {
  clearTimeout(timer);
  timer = setTimeout(() => {
    $searchResultsContainer.empty();
    axios.get(`/search/books?query=${value}`).then((req) => {
      if (req.data.length) {
        req.data.forEach((element) => {
          if ($recommendedContainer.find($(`#${element._id}`)).length === 0) {
            $searchResultsContainer.append(
              `
                <div id="${element._id}" class="col-lg-3 col-md-6 mb-4">
                  <div class="card h-100">
                    <img class="card-img-top" src="${element.image}" alt="">
                    <div class="card-body">
                      <h4 class="card-title">${element.title}</h4>
                      <p class="card-text">${element.author}</p>
                    </div>
                    <div id="cardFooter" class="card-footer">
                      <a class="btn btn-primary no-href-button"
                        onclick="addRecommendedBook('${element._id}')">Add</a>
                    </div>
                  </div>
                </div>
              `,
            );
          }
        });
      }
    }).catch((err) => {
    });
  }, 250);
}

function addRecommendedBook(bookIdToAdd) {
  $(`#${bookIdToAdd}`).detach().appendTo($recommendedContainer.children('nav').children('ul'));
  $(`#${bookIdToAdd}`).removeClass('col-lg-3 col-md-6 mb-4');
  $(`#${bookIdToAdd}`).addClass('book-card card h-100');
  $(`#${bookIdToAdd}`).find('#cardFooter').children().remove();
  $(`#${bookIdToAdd}`).find('#cardFooter').append(
    `<a class="btn btn-danger no-href-button" onclick="removeRecommendedBook('${bookIdToAdd}')">Remove</a>`,
  );
  $(`#${bookIdToAdd}`).append(
    `<input type="text" name="bookId" class="form-control" value="${bookIdToAdd}" hidden>`,
  );
}
