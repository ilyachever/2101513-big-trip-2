import RadioListView from './radio-list-view.js';

function createSortTypeListTemplate(sort) {
  return sort.map(({type, isDisabled, isChecked}) => (
    `<div class="trip-sort__item  trip-sort__item--${type}">
      <input
        id="sort-${type}"
        class="trip-sort__input visually-hidden"
        type="radio"
        name="trip-sort"
        value="sort-${type}"
        data-item="${type}"
        ${isDisabled ? 'disabled' : ''}
        ${isChecked ? 'checked' : ''}
      >
      <label class="trip-sort__btn" for="sort-${type}">${type}</label>
    </div>
    `
  )).join('');
}

function createListSortTemplate(sort) {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
        ${createSortTypeListTemplate(sort)}
      </form>`
  );
}

export default class ListSortView extends RadioListView {

  get template() {
    return createListSortTemplate(this._items);
  }
}
