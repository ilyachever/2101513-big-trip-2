import {getRandomIntFromDuration, getRandomNumber} from '../utils/common.js';
import {getDate} from '../utils/events.js';
import {MAX_PRICE_VALUE} from '../constants.js';

const generatePoint = (type, destinationId, offerIds) => ({
  id: crypto.randomUUID(),
  basePrice: getRandomNumber(MAX_PRICE_VALUE),
  dateFrom: getDate({
    next: false
  }),
  dateTo: getDate({
    next: true
  }),
  destination: destinationId,
  isFavorite: Boolean(getRandomIntFromDuration(0, 1)),
  offers: offerIds,
  type
});
export {
  generatePoint
};
