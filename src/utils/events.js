import dayjs from 'dayjs';
import minMax from 'dayjs/plugin/minMax';
import duration from 'dayjs/plugin/duration';
import {
  DateFormat,
} from '../constants.js';

dayjs.extend(minMax);
dayjs.extend(duration);

export function humanizeEventDate (eventDate) {
  return eventDate ? dayjs(eventDate).format(DateFormat.MONTH_DAY) : '';
}

export function humanizeEventTime (eventDateTime) {
  return eventDateTime ? dayjs(eventDateTime).format(DateFormat.HOUR_MINUTE) : '';
}

export function isDatesEqual (dateA, dateB) {
  return (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');
}

const calcDuration = (dateFrom, dateTo) => {
  const diff = dayjs(dateTo).diff(dayjs(dateFrom));
  const eventDuration = dayjs.duration(diff);
  const days = Math.floor(eventDuration.asDays());
  const formattedDays = days.toString().padStart(2, '0');

  if (days) {
    return `${formattedDays}D ${eventDuration.format('HH[H] mm[m]')}`;
  }

  if (eventDuration.hours()) {
    return eventDuration.format('HH[H] mm[m]');
  }

  return eventDuration.format('mm[m]');
};

const checkPriceIsNumber = (price) => /^\d+$/.test(price);

export {
  checkPriceIsNumber,
  calcDuration,
};
