/* eslint-disable no-undef */
const $footer = $('#footer');

function positionFooter() {
  if (($(window).height() > $(document.body).height() + $footer.height())) {
    $footer.css({
      bottom: 0,
    });
    $footer.css({
      width: '100%',
    });
    $footer.css({
      position: 'absolute',
    });
  } else {
    $footer.css({
      position: 'relative',
    });
  }
}

$(window).bind('load', () => {
  positionFooter();
});
$(window).resize(() => {
  positionFooter();
});
