
let nextPage = 1,
  morePages = true;
const $loader = $("#loader"),
  $infiniteList = $("#infiniteList");
  
$loader.fadeOut();

function getNextPage() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    let value = ++nextPage;
    axios.get(`/books?page=${value}`).then((req) => {
      if (req.data.length > 0) {
        req.data.forEach(element => {
          $infiniteList.append(`
            <div class="col-lg-3 col-md-6 mb-4">
              <div class="card h-100">
                <a href="/books/${element._id}"><img class="card-img-top" src="${element.image}" alt=""></a>
                <div class="card-body">
                  <h4 class="card-title">${element.title}</h4>
                  <p class="card-text">${element.author}</p>
                </div>
                <div class="card-footer">
                  <a href="/books/${element._id}" class="btn btn-primary">Read More!</a>
                </div>
              </div>
            </div>
            `);
        });
      } else {
        morePages = false;
        $loader.remove();
      }
    }).catch(err => {
      console.log(err);
    });
  }, 250);
}
// Detect when scrolled to bottom.
$(window).scroll(function () {
  if (morePages && $(window).scrollTop() >= $(document).height() - $(window).height() - 72) {
    $loader.fadeIn();
    getNextPage();
    $loader.fadeOut();
  }
});