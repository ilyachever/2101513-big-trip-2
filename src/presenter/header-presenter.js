import {render, RenderPosition} from '../framework/render.js';
import HeaderTripInfoView from '../view/header-trip-info-view';
import ListFilterView from '../view/list-filter-view';
import {generateFilter} from '../mock/filter.js';

export default class HeaderPresenter {
  #headerTripInfo = null;
  #headerListFilter = null;
  #eventPoints = null;

  constructor({headerTripInfo, headerListFilter, eventPointsModel}) {
    this.#headerTripInfo = headerTripInfo;
    this.#headerListFilter = headerListFilter;
    this.#eventPoints = eventPointsModel.eventPoints;
  }

  init() {
    const filters = generateFilter(this.#eventPoints);
    render(new HeaderTripInfoView(), this.#headerTripInfo, RenderPosition.AFTERBEGIN);
    render(new ListFilterView({filters}), this.#headerListFilter);
  }
}
