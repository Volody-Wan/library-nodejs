/* eslint-disable no-undef */
const $sideMenu = $('#sideMenu');
const $navigation = $('#navigation');
const $containerContent = $('#containerContent');

function sideListSize() {
  $containerContent.css({
    'max-height': $(window).height() - ($navigation.height() + $footer.height()),
  });
  $sideMenu.css({
    'max-height': $(window).height() - ($navigation.height() + $footer.height()),
  });
}

$(window).bind('load', () => {
  sideListSize();
});
$(window).resize(() => {
  sideListSize();
});
