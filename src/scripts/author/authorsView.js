const $sideMenu = $("#sideMenu"),
  $navigation = $("#navigation"),
  $containerContent = $("#containerContent");

function sideListSize() {
  $containerContent.css({
    "max-height": $(window).height() - ($navigation.height() + $footer.height())
  })
  $sideMenu.css({
    "max-height": $(window).height() - ($navigation.height() + $footer.height())
  })
}

$(window).bind("load", function () {
  sideListSize();
});
$(window).resize(function () {
  sideListSize();
});