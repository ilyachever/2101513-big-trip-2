import {render, remove, replace, RenderPosition} from '../framework/render.js';
import HeaderTripInfoView from '../view/header-trip-info-view.js';

export default class TripInfoPresenter {
  #container = null;
  #eventPointsModel = null;
  #destinationModel = null;
  #offersModel = null;
  #tripInfoComponent = null;

  constructor({container, eventPointsModel, destinationModel, offersModel}) {
    this.#container = container;
    this.#eventPointsModel = eventPointsModel;
    this.#destinationModel = destinationModel;
    this.#offersModel = offersModel;

    this.#eventPointsModel.addObserver(this.#modelEventHandler);
  }

  init() {
    const preventTripInfoComponent = this.#tripInfoComponent;
    this.#tripInfoComponent = new HeaderTripInfoView({
      destinations: this.#destinationModel.get(),
      offers: this.#offersModel.get(),
      eventPoints: this.#eventPointsModel.get(),
    });

    if (!preventTripInfoComponent) {
      render(this.#tripInfoComponent, this.#container, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#tripInfoComponent, preventTripInfoComponent);
    remove(preventTripInfoComponent);

    render(this.#tripInfoComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  #modelEventHandler = () => {
    this.init();
  };
}
