import { FILTERS_TYPE } from '../constants.js';
import { isPastDate, isPresentDate, isFutureDate } from './events.js';

const filter = {
  [FILTERS_TYPE.EVERYTHING]: (eventPoints) => eventPoints,
  [FILTERS_TYPE.FUTURE]: (eventPoints) => eventPoints.filter((eventPoint) => isFutureDate(eventPoint.dateTo)),
  [FILTERS_TYPE.PRESENT]: (eventPoints) => eventPoints.filter((eventPoint) => isPresentDate(eventPoint.dateTo)),
  [FILTERS_TYPE.PAST]: (eventPoints) => eventPoints.filter((eventPoint) => isPastDate(eventPoint.dateTo)),
};

export { filter };
