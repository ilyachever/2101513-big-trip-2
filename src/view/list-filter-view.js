import AbstractView from '../framework/view/abstract-view.js';

function createFilterTypeTemplate(filter) {
  const {type, count} = filter;

  return (`
  <div class="trip-filters__filter">
    <input id="filter-${type}"
    class="trip-filters__filter-input  visually-hidden"
    type="radio" name="trip-filter"
    value="${type}"
    ${count === 0 ? 'disabled' : ''}>
    <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
  </div>
  `);
}

function createListFilterTemplate(filters) {
  const filterTypes = filters.map((filter, index) => createFilterTypeTemplate(filter, index === 0)).join('');
  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterTypes}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
}

export default class ListFilterView extends AbstractView {
  #filters = null;

  constructor({filters}) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createListFilterTemplate(this.#filters);
  }
}
