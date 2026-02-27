import {incrementCounter, getRandomArrayElement, getRandomNumber} from '../utils/common.js';
import {
  START_ID_COUNTER,
  DESCRIPTIONS,
  CITIES,
  MAX_IMAGES_COUNT
} from '../constants.js';

const getPictureId = incrementCounter(START_ID_COUNTER);

const generateDestination = () => {
  const city = getRandomArrayElement(CITIES);

  return ({
    id: crypto.randomUUID(),
    description: getRandomArrayElement(DESCRIPTIONS),
    name: city,
    pictures: Array.from({length: getRandomNumber(MAX_IMAGES_COUNT)}, () => ({
      src: `https://loremflickr.com/248/152?=${getPictureId()}`,
      description: getRandomArrayElement(DESCRIPTIONS),
    }))
  });
};

export {generateDestination};
