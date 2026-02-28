import AbstractView from '../framework/view/abstract-view.js';
import he from 'he';
import {humanizeEventDate, humanizeEventTime, calcDuration} from '../utils/events.js';
import {toUpperCaseFirstSign} from '../utils/common.js';

function createOfferTemplate(offers) {
  return offers.map(({title, price}) => (
    `<li class="event__offer">
        <span class="event__offer-title">${he.encode(String(title))}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${he.encode(String(price))}</span>
    </li>`
  )).join('');
}

function createTripItemTemplate(destination, eventPoint, offers) {
  const {type, basePrice, dateFrom, dateTo, isFavorite,} = eventPoint;
  const eventOffers = offers.filter((offer) => eventPoint.offers?.includes(offer.id));
  const isFavoriteItem = isFavorite ? 'event__favorite-btn--active' : '';
  return (
    `<li class="trip-events__item">
        <div class="event">
          <time class="event__date" datetime="${dateFrom}">${humanizeEventDate(dateFrom)}</time>
          <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="img/icons/${he.encode(String(type))}.png" alt="Event type icon">
          </div>
          <h3 class="event__title">${toUpperCaseFirstSign(type)} ${he.encode(String(destination.name)) ?? ''}</h3>
          <div class="event__schedule">
            <p class="event__time">
              <time class="event__start-time" datetime="${dateFrom}">${humanizeEventTime(dateFrom)}</time>
              &mdash;
              <time class="event__end-time" datetime="${dateTo}">${humanizeEventTime(dateTo)}</time>
            </p>
            <p class="event__duration">${calcDuration(dateFrom, dateTo)}</p>
          </div>
          <p class="event__price">
            &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
          </p>
          <h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">
            ${createOfferTemplate(eventOffers)}
          </ul>
          <button class="event__favorite-btn ${isFavoriteItem}" type="button">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </div>
    </li>`
  );
}

export default class TripPointView extends AbstractView {
  #destination = null;
  #eventPoint = null;
  #offers = null;
  #onEditClick = null;
  #onFavoriteClick = null;

  constructor({destination, eventPoint, offers, onEditClick, onFavoriteClick}) {
    super();
    this.#destination = destination;
    this.#eventPoint = eventPoint;
    this.#offers = offers;
    this.#onEditClick = onEditClick;
    this.#onFavoriteClick = onFavoriteClick;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#onEditClickHandler);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#onFavoriteClickHandler);
  }

  get template() {
    return createTripItemTemplate(this.#destination, this.#eventPoint, this.#offers);
  }

  #onEditClickHandler = (evt) => {
    evt.preventDefault();
    this.#onEditClick();
  };

  #onFavoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#onFavoriteClick();
  };
}
