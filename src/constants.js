const EventTypes = [
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
const DateFormat = {
  MONTH_DAY: 'MMM D',
  HOUR_MINUTE: 'HH:mm',
  DATE_TIME_FORMAT: 'DD/MM/YY HH:mm'
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  DELETE_POINT: 'DELETE_POINT',
  CREATE_POINT: 'CREATE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  ERROR: 'ERROR',
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const EditType = {
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
  type: EventTypes[5],
};

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer'
};

const EnabledSortType = {
  [SortType.DAY]: true,
  [SortType.EVENT]: false,
  [SortType.TIME]: true,
  [SortType.PRICE]: true,
  [SortType.OFFER]: false,
};

const EmptyListMessage = {
  EVERYTHING: 'Click New Event to create your first point',
  FUTURE: 'There are no future events now',
  PRESENT: 'There are no present events now',
  PAST: 'There are no past events now',
  ERROR: 'Failed to load latest route information'
};

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const SourceUrl = {
  POINTS: 'points',
  OFFERS: 'offers',
  DESTINATIONS: 'destinations',
};

const TimeLimit = {
  LOWER_LIMIT: 300,
  UPPER_LIMIT: 1000,
};

const DESTINATION_ITEMS_COUNT = 3;

const AUTHORIZATION = 'Basic eo0w590ik29889a';

const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';

export {
  EventTypes,
  DateFormat,
  FilterType,
  Mode,
  SortType,
  EnabledSortType,
  UserAction,
  UpdateType,
  EmptyListMessage,
  EditType,
  POINT_EMPTY,
  Method,
  SourceUrl,
  TimeLimit,
  DESTINATION_ITEMS_COUNT,
  AUTHORIZATION,
  END_POINT
};
