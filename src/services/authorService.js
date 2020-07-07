/* eslint-disable no-param-reassign */
function authorService() {
  function valdiateAuthorBooksIntegrity(authorbooks, error) {
    let hasError = false;
    if (authorbooks) {
      if (typeof authorbooks === 'string' || Array.isArray(authorbooks)) {
        return false;
      }

      error.authorbooks = 'Books must be provided either as a String or Array of Strings';
      hasError = true;
    }

    if (hasError) {
      return true;
    }
    return false;
  }

  function validateDate(date, error, errorField, hasError) {
    if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      try {
        new Date(date).toISOString();
      } catch (err) {
        error.errorField = 'Invalid Date';
        hasError = true;
      }
    } else {
      error.errorField = 'Invalid format, must be yyyy-mm-dd';
      hasError = true;
    }
    return hasError;
  }

  function validateAuthorIntegrity(author, error) {
    let hasError = false;

    if (!author.name) {
      error.name = 'Name must be provided';
      hasError = true;
    }
    if (!author.birth) {
      error.birth = 'Birthday must be provided';
      hasError = true;
    } else {
      hasError = validateDate(author.birth, error, error.birth, hasError);
    }
    if (author.death) {
      hasError = validateDate(author.death, error, error.death, hasError);
    }
    if (!author.language) {
      error.language = 'Language must be provided';
      hasError = true;
    }
    if (!author.biography) {
      error.biography = 'Biography must be provided';
      hasError = true;
    }
    if (!author.image) {
      error.image = 'Image must be provided';
      hasError = true;
    }
    if (!author.genre) {
      error.genre = 'Genre must be provided';
      hasError = true;
    }
    if (!author.nationality) {
      error.nationality = 'Nationality must be provided';
      hasError = true;
    }
    if (author.references) {
      if (typeof author.references === 'string') {
        author.references = Object.values([author.references]);
      } else if (Array.isArray(author.references)) {
        author.references = author.references.filter((item) => item);
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
    valdiateAuthorBooksIntegrity,
    validateAuthorIntegrity,
  };
}

module.exports = authorService;
