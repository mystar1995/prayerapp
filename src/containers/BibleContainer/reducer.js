import * as Constants from './constants';

const initialState = {
  Book: 'Matthew',
  Chapter: 1,
  Content: undefined,
  loading: false,
  NextTitle: 'Matthew 2',
  PrevTitle: '',
  nextEnabled: true,
  prevEnabled: false,
};

export default function startReducer(state = initialState, action) {
  switch (action.type) {
    case Constants.SET_CURRENT_BOOK:
      return {
        ...state,
        Book: action.payload,
      };
    case Constants.SET_CURRENT_CHAPTER:
      return {
        ...state,
        Chapter: action.payload,
      };
    case Constants.SET_BOOK_CONTENT:
      return {
        ...state,
        Content: action.payload,
      };
    case Constants.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case Constants.SET_NEXT_CHAPTER_TITLE:
      return {
        ...state,
        NextTitle: action.payload,
      };
    case Constants.SET_PREV_CHAPTER_TITLE:
      return {
        ...state,
        PrevTitle: action.payload,
      };
    case Constants.SET_NEXT_ENABLED:
      return {
        ...state,
        nextEnabled: action.payload,
      };
    case Constants.SET_PREV_ENABLED:
      return {
        ...state,
        prevEnabled: action.payload,
      };
    default:
      return state;
  }
}
