import { filter } from '../utils/filter.js';

function generateFilter(eventPoints) {
  return Object.entries(filter).map(
    ([filterType, filterEventPoint]) => ({
      type: filterType,
      count: filterEventPoint(eventPoints).length,
    }),
  );
}

export { generateFilter };
