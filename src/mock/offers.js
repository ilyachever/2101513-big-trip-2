import {getRandomNumber, getRandomArrayElement} from '../utils/common.js';
import {OFFERS_TITLE, MAX_PRICE_OFFER} from '../constants.js';

const generateOffer = () => ({
  id: crypto.randomUUID(),
  title: getRandomArrayElement(OFFERS_TITLE),
  price: getRandomNumber(MAX_PRICE_OFFER),
});
export {generateOffer};
