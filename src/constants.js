const START_ID_COUNTER = 1;
const MAX_IMAGES_COUNT = 5;
const MAX_PRICE_VALUE = 200;
const MAX_PRICE_OFFER = 40;
const MILLISECONDS_IN_MINUTES = 60000;
const SECONDS_IN_MINUTES = 60;
const HOURS_IN_DAY = 12;
const MONTH_COUNT = 12;
const SORT_TYPES = [
  {
    type: 'day',
    isDisabled: false,
    isChecked: true,
  },
  {
    type: 'event',
    isDisabled: false,
    isChecked: false,
  },
  {
    type: 'time',
    isDisabled: false,
    isChecked: false,
  },
  {
    type: 'price',
    isDisabled: false,
    isChecked: false,
  },
  {
    type: 'offers',
    isDisabled: true,
    isChecked: false,
  }
];
const EVENTS_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const DATE_FORMAT = {
  DAY_MONTH: 'D MMM',
  MONTH_DAY: 'MMM DD',
  HOUR_MINUTES: 'HH:MM',
  DAY_MONTH_YEAR: 'DD/MM/YY[&nbsp;]HH:mm',
  MINUTES_WITH_POSTFIX: 'mm[M]',
  HOUR_MINUTES_WITH_POSTFIX: 'HH[H] mm[M]',
  DAY_HOUR_MINUTES_WITH_POSTFIX: 'DD[D] HH[H] mm[M]'
};
const DURATIONS = {
  HOUR: 5,
  DAY: 3,
  MINUTE: 59
};
const DESCRIPTIONS = [
  'This is a first place',
  'This is a second place',
  'This is a third place',
  'This is a third fourth',
];
const CITIES = [
  'Moscow',
  'Yoshkar-Ola',
  'Saint Petersburg',
  'Kirov',
];

const OFFER_COUNT = {
  MIN: 0,
  MAX: 4
};

const OFFERS_TITLE = [
  'Offer title 1',
  'Offer title 2',
  'Offer title 3',
  'Offer title 4',
  'Offer title 5',
  'Offer title 6',
];

const FILTERS_TYPE = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

const MODE = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export {
  START_ID_COUNTER,
  DESCRIPTIONS,
  CITIES,
  MAX_IMAGES_COUNT,
  EVENTS_TYPES,
  OFFERS_TITLE,
  MAX_PRICE_VALUE,
  MAX_PRICE_OFFER,
  DATE_FORMAT,
  MILLISECONDS_IN_MINUTES,
  SECONDS_IN_MINUTES,
  HOURS_IN_DAY,
  SORT_TYPES,
  FILTERS_TYPE,
  MONTH_COUNT,
  DURATIONS,
  OFFER_COUNT,
  MODE
};
