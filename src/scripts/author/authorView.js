/* eslint-disable no-undef */
const $articleContentUpdate = $('#articleContentUpdate');
const $article = $('#article');
const $sideMenu = $('#sideMenu');
const $articleContent = $('#articleContent');
let updateHidden = true;

$articleContentUpdate.hide();

// eslint-disable-next-line no-unused-vars
function updateContent() {
  if (updateHidden) {
    $articleContentUpdate.show();
    $articleContent.hide();
    updateHidden = false;
  } else {
    $articleContentUpdate.hide();
    $articleContent.show();
    updateHidden = true;
  }
}
function sideListSize() {
  if (window.matchMedia('(max-width: 767px)').matches) {
    $sideMenu.css({
      height: $articleContent.height(),
    });
  } else {
    $sideMenu.css({
      height: $article.height(),
    });
  }
}

$(window).bind('load', () => {
  sideListSize();
});
$(window).resize(() => {
  sideListSize();
});
