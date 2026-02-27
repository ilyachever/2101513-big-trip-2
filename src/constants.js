const EVENTS_TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant'
];
const DATE_FORMAT = {
  MONTH_DAY: 'MMM D',
  HOUR_MINUTE: 'HH:mm',
  DATE_TIME_FORMAT: 'DD/MM/YY HH:mm'
};

const FILTERS_TYPE = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

const USER_ACTION = {
  UPDATE_POINT: 'UPDATE_POINT',
  DELETE_POINT: 'DELETE_POINT',
  CREATE_POINT: 'CREATE_POINT',
};

const UPDATE_TYPE = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const MODE = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const EDIT_TYPE = {
  EDITING: 'EDITING',
  CREATING: 'CREATING',
};

const POINT_EMPTY = {
  basePrice: 0,
  dateFrom: null,
  dateTo: null,
  destination: null,
  isFavorite: false,
  offers: [],
  type: EVENTS_TYPES[0],
};

const SORT_TYPES = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer'
};

const ENABLED_SORT_TYPES = {
  [SORT_TYPES.DAY]: true,
  [SORT_TYPES.EVENT]: false,
  [SORT_TYPES.TIME]: true,
  [SORT_TYPES.PRICE]: true,
  [SORT_TYPES.OFFER]: false,
};

const EMPTY_LIST_MESSAGE = {
  EVERYTHING: 'Click New Event to create your first point',
  FUTURE: 'There are no future events now',
  PRESENT: 'There are no present events now',
  PAST: 'There are no past events now'
};

const METHOD = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const SOURCE_URL = {
  POINTS: 'points',
  OFFERS: 'offers',
  DESTINATIONS: 'destinations',
};

const TIME_LIMIT = {
  LOWER_LIMIT: 300,
  UPPER_LIMIT: 1000,
};

const DESTINATION_ITEMS_COUNT = 3;

export {
  EVENTS_TYPES,
  DATE_FORMAT,
  FILTERS_TYPE,
  MODE,
  SORT_TYPES,
  ENABLED_SORT_TYPES,
  USER_ACTION,
  UPDATE_TYPE,
  EMPTY_LIST_MESSAGE,
  EDIT_TYPE,
  POINT_EMPTY,
  METHOD,
  SOURCE_URL,
  TIME_LIMIT,
  DESTINATION_ITEMS_COUNT
};
