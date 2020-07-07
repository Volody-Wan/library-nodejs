/* eslint-disable no-param-reassign */
function commonService() {
  function convertAuthorBooks(authorbooks) {
    if (typeof authorbooks === 'string') {
      return Object.values([authorbooks]);
    }
    if (Array.isArray(authorbooks)) {
      return authorbooks.filter((item) => item);
    }
    return null;
  }

  return {
    convertAuthorBooks,
  };
}

module.exports = commonService;
