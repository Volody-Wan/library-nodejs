/* eslint-disable no-undef */
const $article = $('#article');
const $sideMenu = $('#sideMenu');
const $articleContent = $('#articleContent');

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
