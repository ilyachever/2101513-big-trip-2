import {render, replace, remove} from '../framework/render.js';
import {SORT_TYPES, ENABLED_SORT_TYPES} from '../constants.js';
import ListSortView from '../view/list-sort-view.js';

export default class SortPresenter {
  #container = null;
  #sortTypes = [];
  #currentSortType = SORT_TYPES.DAY;
  #sortComponent = null;
  #sortTypesChangeHandler = null;

  constructor({container, sortTypeHandler}) {
    this.#container = container;
    this.#sortTypes = Object.values(SORT_TYPES).map((type) => ({
      type,
      isChecked: type === this.#currentSortType,
      isDisabled: !ENABLED_SORT_TYPES[type],
    }));
    this.#sortTypesChangeHandler = sortTypeHandler;
  }

  init() {
    const prevSortComponent = this.#sortComponent;

    this.#sortComponent = new ListSortView({
      items: this.#sortTypes,
      onItemChange: this.#sortTypesChangeHandler,
    });
    if (prevSortComponent) {
      replace(this.#sortComponent, prevSortComponent);
      remove(prevSortComponent);
    } else {
      render(this.#sortComponent, this.#container);
    }
  }

  destroy() {
    remove(this.#sortComponent);
  }
}
