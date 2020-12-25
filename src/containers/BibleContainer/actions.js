import * as Constants from './constants';

export function setCurrentBook(payload) {
  return {
    type: Constants.SET_CURRENT_BOOK,
    payload,
  };
}

export function setCurrentChapter(payload) {
  return {
    type: Constants.SET_CURRENT_CHAPTER,
    payload,
  };
}

export function setBookContent(payload) {
  return {
    type: Constants.SET_BOOK_CONTENT,
    payload,
  };
}

export function setLoading(payload) {
  return {
    type: Constants.SET_LOADING,
    payload,
  };
}

export function setNextChapterTitle(payload) {
  return {
    type: Constants.SET_NEXT_CHAPTER_TITLE,
    payload,
  };
}

export function setPrevChapterTitle(payload) {
  return {
    type: Constants.SET_PREV_CHAPTER_TITLE,
    payload,
  };
}

export function setNextButtonEnabled(payload) {
  return {
    type: Constants.SET_NEXT_ENABLED,
    payload,
  };
}

export function setPreviousButtonEnabled(payload) {
  return {
    type: Constants.SET_PREV_ENABLED,
    payload,
  };
}
