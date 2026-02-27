import {render, remove, replace, RenderPosition} from '../framework/render.js';
import HeaderTripInfoView from '../view/header-trip-info-view.js';

export default class TripInfoPresenter {
  #container = null;
  #eventPointsModel = null;
  #eventPoints = null;
  #tripInfoComponent = null;

  constructor({container, eventPointsModel}) {
    this.#container = container;
    this.#eventPointsModel = eventPointsModel;
    this.#eventPoints = this.#eventPointsModel.get();
  }

  init() {
    const prevTripInfoComponent = this.#tripInfoComponent;
    this.#tripInfoComponent = new HeaderTripInfoView();
    if (!prevTripInfoComponent) {
      render(this.#tripInfoComponent, this.#container, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);

    render(this.#tripInfoComponent, this.#container);
  }
}
