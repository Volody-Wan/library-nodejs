/* eslint-disable no-param-reassign */
function bookService() {
  function validateBookIntegrity(book, error) {
    let hasError = false;

    if (!book.title) {
      error.title = 'Title must be provided';
      hasError = true;
    }
    if (!book.image) {
      error.image = 'Image must be provided';
      hasError = true;
    }
    if (!book.description) {
      error.description = 'Book description must be provided';
      hasError = true;
    }
    if (!book.author) {
      error.author = 'Author must be provided';
      hasError = true;
    }
    if (!book.published) {
      error.published = 'Publication date must be provided';
      hasError = true;
    }
    if (!book.language) {
      error.language = 'Book language must be provided';
      hasError = true;
    }
    if (!book.genre) {
      error.genre = 'Genre must be provided';
      hasError = true;
    }
    if (book.references) {
      if (typeof book.references === 'string') {
        book.references = Object.values([book.references]);
      } else if (Array.isArray(book.references)) {
        book.references = book.references.filter((item) => item);
      } else {
        error.references = 'Reference must be either as a String or Array of Strings';
        hasError = true;
      }
    }

    if (hasError) {
      return true;
    }
    return false;
  }

  return {
    validateBookIntegrity,
  };
}

module.exports = bookService;
