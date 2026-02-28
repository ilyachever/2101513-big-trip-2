import { FilterType } from '../constants.js';
import dayjs from 'dayjs';

function isPointFuture(dateFrom) {
  return dayjs().isBefore(dateFrom, 'day');
}

function isPointPresent(dateFrom, dateTo) {
  return !isPointFuture(dateFrom) && !isPointPast(dateTo);
}

function isPointPast(dateTo) {
  return dayjs().isAfter(dateTo, 'day');
}

export const filter = {
  [FilterType.EVERYTHING]: (eventPoints) => eventPoints.filter((eventPoint) => eventPoint),
  [FilterType.FUTURE]: (eventPoints) => eventPoints.filter((eventPoint) => isPointFuture (eventPoint.dateFrom)),
  [FilterType.PRESENT]: (eventPoints) => eventPoints.filter((eventPoint) => isPointPresent (eventPoint.dateFrom, eventPoint.dateTo)),
  [FilterType.PAST]: (eventPoints) => eventPoints.filter((eventPoint) => isPointPast (eventPoint.dateTo))
};
