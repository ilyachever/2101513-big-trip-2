import dayjs from 'dayjs';
import {getRandomNumber} from '../utils/common.js';
import minMax from 'dayjs/plugin/minMax.js';
import {
  DATE_FORMAT,
  HOURS_IN_DAY,
  SECONDS_IN_MINUTES,
  DURATIONS,
} from '../constants.js';

dayjs.extend(minMax);

let randomDate = dayjs().subtract(getRandomNumber(0, DURATIONS.DAY), 'day').toDate();

const getDate = ({next}) => {
  const daysInterval = getRandomNumber(1, DURATIONS.DAY);
  const hoursInterval = getRandomNumber(5, DURATIONS.HOUR);
  const minsInterval = getRandomNumber(14, DURATIONS.MINUTE);
  if (next) {
    randomDate = dayjs(randomDate)
      .add(minsInterval, 'minute')
      .add(hoursInterval, 'hour')
      .add(daysInterval, 'day')
      .toDate();
  }
  return randomDate;
};


function humanizeTaskDueDate(date, format) {
  return date ? dayjs(date).format(format) : '';
}

function getDifferenceInTime(start, dateTo) {
  const difference = dayjs(dateTo).diff(start) / SECONDS_IN_MINUTES;

  if (difference < SECONDS_IN_MINUTES) {
    return dayjs(difference).format(DATE_FORMAT.MINUTES_WITH_POSTFIX);
  } else if (difference > SECONDS_IN_MINUTES && difference < SECONDS_IN_MINUTES * HOURS_IN_DAY) {
    return dayjs(difference).format(DATE_FORMAT.HOUR_MINUTES_WITH_POSTFIX);
  } else {
    return dayjs(difference).format(DATE_FORMAT.DAY_HOUR_MINUTES_WITH_POSTFIX);
  }
}

function toUpperCaseFirstSign(item) {
  return item.charAt(0).toUpperCase() + item.substring(1);
}

export {
  humanizeTaskDueDate,
  getDifferenceInTime,
  getDate,
  toUpperCaseFirstSign,
};
