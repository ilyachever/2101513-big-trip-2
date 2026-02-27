import {render, RenderPosition} from '../render';
import HeaderTripInfoView from '../view/header-trip-info-view';
import ListFilterView from '../view/list-filter-view';

export default class HeaderPresenter {
  #headerTripInfo = null;
  #headerListFilter = null;

  constructor({headerTripInfo, headerListFilter}) {
    this.#headerTripInfo = headerTripInfo;
    this.#headerListFilter = headerListFilter;
  }

  init() {
    render(new HeaderTripInfoView(), this.#headerTripInfo, RenderPosition.AFTERBEGIN);
    render(new ListFilterView(), this.#headerListFilter);
  }
}
