/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-undef */
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
