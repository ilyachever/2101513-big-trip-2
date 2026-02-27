import AbstractView from '../framework/view/abstract-view.js';
import {humanizeTaskDueDate, toUpperCaseFirstSign} from '../utils/events.js';
import {DATE_FORMAT, EVENTS_TYPES} from '../constants.js';

function createEventTypeTemplate(type, id) {
  const isChecked = false;

  return (
    `<div class="event__type-item">
      <input id="event-type-${type}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${isChecked}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${id}">${toUpperCaseFirstSign(type)}</label>
    </div>`
  );
}

function createOfferTemplate(offer) {
  const {id, title, price} = offer;

  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id=${id} type="checkbox" name=${id}>
      <label class="event__offer-label" for=${id}>
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>`
  );
}

function createOfferListTemplate({offers}) {
  if (offers.length !== 0) {
    return (
      `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
          ${offers.map((offer) => createOfferTemplate(offer)).join('')}
        </div>
      </section>`
    );
  }

  return '';
}

function createPhotoTemplate(photo) {
  const {src, description} = photo;
  return (`<img class="event__photo" src=${src} alt=${description}>`);
}

function createPhotoContainerTemplate(pictures) {
  if (pictures.length > 0) {
    return (
      `<div class="event__photos-container">
        <div class="event__photos-tape">
          ${pictures.map((item) => createPhotoTemplate(item)).join('')}
        </div>
      </div>`
    );
  }

  return '';
}

function createDestinationTemplate(destination) {
  const {description = 'Default Description', pictures = []} = destination;

  if (description.length > 0 || pictures.length > 0) {
    return (
      `<section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${description}</p>
            ${createPhotoContainerTemplate(pictures)}
      </section>`
    );
  }

  return '';
}

function createAddItemTemplate(destinations, eventPoints, allOffers) {
  const firstEvent = eventPoints[0];
  const firstDestination = destinations[0];
  const {basePrice, dateFrom, dateTo, id, type} = firstEvent;

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
            <div class="event__type-list">
              <fieldset class="event__type-group">
                ${EVENTS_TYPES.map((item) => createEventTypeTemplate(item, type, id)).join('')}
              </fieldset>
            </div>
          </div>
          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="Geneva" list="destination-list-1">
            <datalist id="destination-list-1">
              ${destinations.map((item) => `<option value=${item.name}></option>`)}
            </datalist>
          </div>
          <div class="event__field-group  event__field-group--time">
              <label class="visually-hidden" for="event-start-time-${id}">From</label>
              <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${humanizeTaskDueDate(dateFrom, DATE_FORMAT.DAY_MONTH_YEAR)}">
              &mdash;
              <label class="visually-hidden" for="event-end-time-${id}">To</label>
              <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeTaskDueDate(dateTo, DATE_FORMAT.DAY_MONTH_YEAR)}">
            </div>
          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
              <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${basePrice}">
          </div>
          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Cancel</button>
        </header>
        <section class="event__details">
          ${createOfferListTemplate(allOffers)}
          ${createDestinationTemplate(firstDestination)}
        </section>
      </form>
    </li>`
  );
}

export default class AddItemView extends AbstractView {
  #destinations = null;
  #eventPoints = null;
  #allOffers = null;

  constructor({destinations, eventPoints, allOffers}) {
    super();
    this.#destinations = destinations;
    this.#eventPoints = eventPoints;
    this.#allOffers = allOffers;
  }

  get template() {
    return createAddItemTemplate(this.#destinations, this.#eventPoints, this.#allOffers);
  }
}
