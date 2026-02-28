import {SortType} from '../constants.js';
import dayjs from 'dayjs';

const getPointsByDate = (pointA, pointB) =>
  dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));

const getPointsByTime = (pointA, pointB) => {
  const pointADuration = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const pointBDuration = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));

  return pointBDuration - pointADuration;
};

const getPointByPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

export const sorting = {
  [SortType.DAY]: (eventPoints) => [...eventPoints].sort(getPointsByDate),
  [SortType.EVENT]: () => {
    throw new Error(`Sort by ${SortType.EVENT} is disabled`);
  },
  [SortType.TIME]: (eventPoints) => [...eventPoints].sort(getPointsByTime),
  [SortType.PRICE]: (eventPoints) => [...eventPoints].sort(getPointByPrice),
  [SortType.OFFER]: () => {
    throw new Error(`Sort by ${SortType.OFFER} is disabled`);
  },
};
