import {render, replace, remove} from '../framework/render.js';
import {filter} from '../utils/filter.js';
import ListFilterView from '../view/list-filter-view.js';
import {UPDATE_TYPE} from '../constants.js';

export default class FilterPresenter {
  #eventPointsModel = [];
  #filtersModel = null;
  #filterContainer = null;
  #filters = [];
  #filterComponent = null;

  constructor({filterContainer, eventPointsModel, filtersModel}) {
    this.#eventPointsModel = eventPointsModel;
    this.#filterContainer = filterContainer;
    this.#filtersModel = filtersModel;
    this.#eventPointsModel.addObserver(this.#handleModeChange);
    this.#filtersModel.addObserver(this.#handleModeChange);
    this.#filters = Object.entries(filter).map(([filterType, filterPoints], index) =>
      ({
        type: filterType,
        isChecked: index === 0,
        isDisabled: !filterPoints(this.#eventPointsModel.get()).length,
      })
    );
  }

  init() {
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new ListFilterView({
      items: this.#filters.map((filterItem) => ({...filterItem, isChecked: this.#filtersModel.get() === filterItem.type})),
      onItemChange: this.#filterTypeChangeHandler,
    });

    if (prevFilterComponent) {
      replace(this.#filterComponent, prevFilterComponent);
      remove(prevFilterComponent);
    } else {
      render(this.#filterComponent, this.#filterContainer);
    }
  }

  #filterTypeChangeHandler = (filterType) => {
    this.#filtersModel.set(UPDATE_TYPE.MAJOR, filterType);
  };

  #handleModeChange = () => {
    this.init();
  };
}
