import {render, replace, remove} from '../framework/render.js';
import {filter} from '../utils/filter.js';
import ListFilterView from '../view/list-filter-view.js';
import {UpdateType} from '../constants.js';

export default class FilterPresenter {
  #eventPointsModel = [];
  #filtersModel = null;
  #filterContainer = null;
  #filterComponent = null;
  #currentFilter = null;

  constructor({filterContainer, eventPointsModel, filtersModel}) {
    this.#eventPointsModel = eventPointsModel;
    this.#filterContainer = filterContainer;
    this.#filtersModel = filtersModel;
    this.#eventPointsModel.addObserver(this.#handleModeChange);
    this.#filtersModel.addObserver(this.#handleModeChange);
  }

  get filters() {
    const points = this.#eventPointsModel.get();

    return Object.entries(filter).map(([filterType, filterPoints]) =>
      ({
        type: filterType,
        isChecked: filterType === this.#currentFilter,
        isDisabled: !filterPoints(points).length,
      })
    );
  }

  init() {
    this.#currentFilter = this.#filtersModel.get();
    const preventFilterComponent = this.#filterComponent;
    const items = this.filters;

    this.#filterComponent = new ListFilterView({
      items,
      onItemChange: this.#filterTypeChangeHandler,
    });

    if (preventFilterComponent) {
      replace(this.#filterComponent, preventFilterComponent);
      remove(preventFilterComponent);
    } else {
      render(this.#filterComponent, this.#filterContainer);
    }
  }

  #filterTypeChangeHandler = (filterType) => {
    this.#filtersModel.set(UpdateType.MAJOR, filterType);
  };

  #handleModeChange = () => {
    this.init();
  };
}

