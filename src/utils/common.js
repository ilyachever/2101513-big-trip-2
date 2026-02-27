import {getDifferenceInTime} from './events.js';

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getRandomNumber(number) {
  const randomNumber = Math.floor(Math.random() * number) + 1;
  return Number(randomNumber);
}

function incrementCounter(startFrom) {
  let counterStart = startFrom;
  return function () {
    return counterStart++;
  };
}

const getRandomIntFromDuration = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const updateItem = (items, update) => items.map((item) => item.id === update.id ? update : item);

const isMinorChange = (pointA, pointB) => pointA.dateFrom !== pointB.dateFrom
    || pointA.basePrice !== pointB.basePrice
    || getDifferenceInTime(pointA.dateFrom, pointA.dateTo) !== getDifferenceInTime(pointB.dateFrom, pointB.dateTo);

export {
  getRandomArrayElement,
  incrementCounter,
  getRandomNumber,
  getRandomIntFromDuration,
  updateItem,
  isMinorChange
};
