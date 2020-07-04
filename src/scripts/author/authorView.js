const $articleContentUpdate = $("#articleContentUpdate"),
  $article = $("#article"),
  $sideMenu = $("#sideMenu"),
  $articleContent = $("#articleContent");
let updateHidden = true;

$articleContentUpdate.hide();

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
  if (window.matchMedia("(max-width: 767px)").matches) {
    $sideMenu.css({
      height: $articleContent.height()
    })
  } else {
    $sideMenu.css({
      height: $article.height()
    })
  }
}

$(window).bind("load", function () {
  sideListSize();
});
$(window).resize(function () {
  sideListSize();
});