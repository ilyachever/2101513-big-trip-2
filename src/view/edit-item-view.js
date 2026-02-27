import {DATE_FORMAT, EVENTS_TYPES} from '../constants.js';
import {humanizeTaskDueDate, toUpperCaseFirstSign} from '../utils/events.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

function createDestinationOptionTemplate(destinations) {
  return destinations.map((destination) => (
    `
      <option value="${destination.name}"></option>
    `
  )).join('');
}

function createEventTypeTemplate(eventTypes, currentType) {
  return eventTypes.map((type) => (
    `<div class="event__type-item">
      <input id="event-type-${type}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === currentType ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}">${toUpperCaseFirstSign(type)}</label>
    </div>`
  )).join('');
}

function createOfferTemplate(offer, isChecked) {
  const {id, title, price} = offer;
  const checked = isChecked ? 'checked' : '';
  return (
    `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${title}-${id}" type="checkbox" name="event-offer-${title}" data-id="${id}" ${checked}>
        <label class="event__offer-label" for="event-offer-${title}-${id}">
          <span class="event__offer-title">${title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${price}</span>
        </label>
      </div>`
  );
}

function createOfferListTemplate(offers, checkedOffers) {
  if (offers.length !== 0) {
    return (
      `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
          ${offers.map((offer) => createOfferTemplate(offer, checkedOffers.includes(offer.id))).join('')}
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

function createEditItemTemplate({state, eventPointDestinations, eventPointOffers}) {
  const {basePrice, dateFrom, dateTo, type, id, destination} = state;
  const selectedDestination = eventPointDestinations.find((item) => item.id === destination) || eventPointDestinations[0];
  const currentEventPointOffers = eventPointOffers.find((offer) => offer.type === type);
  const {name} = selectedDestination;
  return (
    `<li class="trip-events__item">
        <form class="event event--edit" action="#" method="post">
          <header class="event__header">
            <div class="event__type-wrapper">
              <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
                <span class="visually-hidden">Choose event type</span>
                <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
              </label>
              <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">
              <div class="event__type-list">
                <fieldset class="event__type-group">
                  <legend class="visually-hidden">Event type</legend>
                  ${createEventTypeTemplate(EVENTS_TYPES, type)}
                </fieldset>
              </div>
            </div>
            <div class="event__field-group  event__field-group--destination">
              <label class="event__label  event__type-output" for="event-destination-${id}">
                ${type}
              </label>
              <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${name}" list="destination-list-${id}">
              <datalist id="destination-list-${id}">
                ${createDestinationOptionTemplate(eventPointDestinations)}
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
              <label class="event__label" for="event-price-${id}">
                <span class="visually-hidden">Price</span>
                &euro;
              </label>
              <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${basePrice}">
            </div>
            <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
            <button class="event__reset-btn" type="reset">Delete</button>
            <button class="event__rollup-btn" type="button">
              <span class="visually-hidden">Open event</span>
            </button>
          </header>
          <section class="event__details">
            ${createOfferListTemplate(currentEventPointOffers.offers, state.offers)}
            ${createDestinationTemplate(selectedDestination)}
          </section>
        </form>
      </li>`
  );
}

export default class EditItemView extends AbstractStatefulView {
  #destinations = [];
  #offers = [];
  #destination = null;
  #onCloseClick = null;
  #onSaveEdit = null;

  constructor({destinations, destination, eventPoint, offers, onCloseClick, onSaveEdit}) {
    super();
    this.#destinations = destinations;
    this.#destination = destination;
    this.#offers = offers;
    this.#onCloseClick = onCloseClick;
    this.#onSaveEdit = onSaveEdit;
    this._setState(EditItemView.parsePointToState(eventPoint));
    this._restoreHandlers();
  }

  get template() {
    return createEditItemTemplate({
      state: this._state,
      eventPointDestinations: this.#destinations,
      eventPointOffers: this.#offers,
    });
  }

  #saveEditForm = (evt) => {
    evt.preventDefault();
    this.#onSaveEdit(EditItemView.parseStateToPoint(this._state));
  };

  removeElement = () => {
    super.removeElement();
  };

  reset(point) {
    this.updateElement(
      EditItemView.parsePointToState(point),
    );
  }

  _restoreHandlers = () => {
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#onCloseClick);
    this.element.querySelector('.event.event--edit').addEventListener('submit', this.#saveEditForm);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationOptionHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceChangeHandler);
    this.element.querySelector('.event__available-offers')?.addEventListener('change', this.#offersChangeHandler);
  };

  #offersChangeHandler = () => {
    const checkedOffers = this.element.querySelectorAll('.event__offer-checkbox:checked');
    this._setState({
      ...this._state,
      offers: [...checkedOffers].map((item) => item.dataset.id)
    });
  };

  #priceChangeHandler = (evt) => {
    this._setState({
      ...this._state,
      basePrice: evt.target.value,
    });
  };

  #typeChangeHandler = (evt) => {
    this.updateElement({
      ...this._state,
      type: evt.target.value,
      offers: [],
    });
  };

  #destinationOptionHandler = (evt) => {
    const selectedDestination = this.#destinations.find((item) => item.name === evt.target.value);
    const selectedDestinationId = selectedDestination ? selectedDestination.id : null;
    this.updateElement({
      ...this._state,
      destination: selectedDestinationId,
    });
  };

  static parsePointToState(point) {
    return {...point};
  }

  static parseStateToPoint(state) {
    return {...state};
  }
}
