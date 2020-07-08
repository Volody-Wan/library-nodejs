/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-undef */
const $adminArticleContentUpdate = $('#articleContentUpdate');
const $adminArticleContent = $('#articleContent');
let updateHidden = true;

$adminArticleContentUpdate.hide();

function updateContent() {
  if (updateHidden) {
    $adminArticleContentUpdate.show();
    $adminArticleContent.hide();
    updateHidden = false;
    positionFooter();
  } else {
    $adminArticleContentUpdate.hide();
    $adminArticleContent.show();
    updateHidden = true;
    positionFooter();
  }
}

function removeReference() {
  const $unorderedEditReferenceList = $('#unorderedEditReferenceList');

  $unorderedEditReferenceList.children().children().last().remove();
}
function addReference() {
  const $unorderedEditReferenceList = $('#unorderedEditReferenceList');

  $('<input/>', {
    class: 'full-width margin-top-10 form-control',
    name: 'editReferenceList',
    value: '',
  }).appendTo($unorderedEditReferenceList.children().last());
}
