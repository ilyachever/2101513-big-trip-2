import AbstractView from '../framework/view/abstract-view.js';
import {getTripFullCost, getTripPeriod, getTripRoute} from '../utils/common.js';

const createHeaderTripInfoTemplate = ({route, duration, cost, isEmpty}) =>
  isEmpty
    ? `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">Loading...</h1>
        <p class="trip-info__dates">Loading...</p>
      </div>
    </section>`
    : `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${route}</h1>
        <p class="trip-info__dates">${duration}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
      </p>
    </section>`;

export default class HeaderTripInfoView extends AbstractView {
  #eventPoints = [];
  #destinations = [];
  #offers = [];

  constructor({destinations, offers, eventPoints}) {
    super();
    this.#eventPoints = eventPoints;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get template() {
    return createHeaderTripInfoTemplate({
      isEmpty: this.#eventPoints.length === 0,
      route: getTripRoute(this.#eventPoints, this.#destinations),
      duration: getTripPeriod(this.#eventPoints),
      cost: getTripFullCost(this.#eventPoints, this.#offers),
    });
  }
}
