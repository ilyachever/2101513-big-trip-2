import {DATE_FORMAT, EDIT_TYPE, EVENTS_TYPES, POINT_EMPTY} from '../constants.js';
import {humanizeTaskDueDate, toUpperCaseFirstSign} from '../utils/events.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

function rollUpTemplate() {
  return `<button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>`;
}

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
          ${offers.map((offer) => createOfferTemplate(offer, checkedOffers?.includes(offer.id))).join('')}
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

function createEditItemTemplate({state, eventPointDestinations, eventPointOffers, editorMode}) {
  const {basePrice, dateFrom, dateTo, type, id, destination} = state;
  const isCreating = editorMode === EDIT_TYPE.CREATING;
  const selectedDestination = eventPointDestinations.find((item) => item.id === destination);
  const currentEventPointOffers = eventPointOffers.find((offer) => offer.type === type);
  const selectedDestinationName = selectedDestination ? selectedDestination.name : '';
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
                  ${type ? createEventTypeTemplate(EVENTS_TYPES, type) : ''}
                </fieldset>
              </div>
            </div>
            <div class="event__field-group  event__field-group--destination">
              <label class="event__label  event__type-output" for="event-destination-${id}">
                ${type}
              </label>
              <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${selectedDestinationName}" list="destination-list-${id}">
              <datalist id="destination-list-${id}">
                ${createDestinationOptionTemplate(eventPointDestinations)}
              </datalist>
            </div>
            <div class="event__field-group  event__field-group--time">
              <label class="visually-hidden" for="event-start-time-${id}">From</label>
              <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${isCreating ? '' : humanizeTaskDueDate(dateFrom, DATE_FORMAT.DAY_MONTH_YEAR)}">
              &mdash;
              <label class="visually-hidden" for="event-end-time-${id}">To</label>
              <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${isCreating ? '' : humanizeTaskDueDate(dateTo, DATE_FORMAT.DAY_MONTH_YEAR)}">
            </div>
            <div class="event__field-group  event__field-group--price">
              <label class="event__label" for="event-price-${id}">
                <span class="visually-hidden">Price</span>
                &euro;
              </label>
              <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${basePrice}">
            </div>
            <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
            <button class="event__reset-btn" type="reset">${isCreating ? 'Cancel' : 'Delete'}</button>
            ${isCreating ? '' : rollUpTemplate()}
          </header>
          <section class="event__details">
            ${createOfferListTemplate(currentEventPointOffers.offers, state.offers)}
            ${selectedDestination ? createDestinationTemplate(selectedDestination) : ''}
          </section>
        </form>
      </li>`
  );
}

export default class EditItemView extends AbstractStatefulView {
  #destinations = [];
  #offers = [];
  #onCloseClick = null;
  #onSaveEdit = null;
  #onDeleteCLick = null;
  #datePickerFrom = null;
  #datePickerTo = null;
  #editorMode = null;

  constructor({
    destinations,
    eventPoint = POINT_EMPTY,
    offers,
    onCloseClick,
    onSaveEdit,
    onDeleteClick,
    editorMode = EDIT_TYPE.EDITING
  }) {
    super();
    this.#destinations = destinations;
    this.#offers = offers;
    this.#onCloseClick = onCloseClick;
    this.#onDeleteCLick = onDeleteClick;
    this.#onSaveEdit = onSaveEdit;
    this.#editorMode = editorMode;
    this._setState(EditItemView.parsePointToState(eventPoint));
    this._restoreHandlers();
  }

  get template() {
    return createEditItemTemplate({
      state: this._state,
      eventPointDestinations: this.#destinations,
      eventPointOffers: this.#offers,
      editorMode: this.#editorMode,
    });
  }

  #saveEditForm = (evt) => {
    evt.preventDefault();
    this.#onSaveEdit(EditItemView.parseStateToPoint(this._state));
  };

  removeElement = () => {
    super.removeElement();
    if (this.#datePickerFrom) {
      this.#datePickerFrom.destroy();
      this.#datePickerFrom = null;
    }
    if (this.#datePickerTo) {
      this.#datePickerTo.destroy();
      this.#datePickerTo = null;
    }
  };

  reset(point) {
    this.updateElement(
      EditItemView.parsePointToState(point),
    );
  }

  _restoreHandlers = () => {
    if (this.#editorMode === EDIT_TYPE.EDITING) {
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#onCloseClick);
      this.element.querySelector('.event__reset-btn')?.addEventListener('click', this.#deleteClickHandler);
    }
    if (this.#editorMode === EDIT_TYPE.CREATING) {
      this.element.querySelector('.event__reset-btn').addEventListener('click', this.#onCloseClick);
    }
    this.element.querySelector('.event.event--edit').addEventListener('submit', this.#saveEditForm);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationOptionHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceChangeHandler);
    this.element.querySelector('.event__available-offers')?.addEventListener('change', this.#offersChangeHandler);
    this.#setDatepicker();
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#onDeleteCLick(this._state);
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

  #setDatepicker = () => {
    const startDateNode = this.element.querySelector('.event__input--time[name="event-start-time"]');
    const endDateNode = this.element.querySelector('.event__input--time[name="event-end-time"]');
    const flatPickerConfig = {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      locale: {
        firstDayOfWeek: 1,
      },
      'time_24hr': true,
    };
    this.#datePickerFrom = flatpickr(startDateNode, {
      ...flatPickerConfig,
      defaultDate: this._state.dateFrom,
      onChange: this.#closeStartDateHandler,
      maxDate: this._state.dateTo,
    });

    this.#datePickerTo = flatpickr(endDateNode, {
      ...flatPickerConfig,
      defaultDate: this._state.dateTo,
      onChange: this.#closeEndDateHandler,
      minDate: this._state.dateFrom,
    });
  };

  #closeStartDateHandler = ([selectedDate]) => {
    this._setState({
      ...this._state,
      dateFrom: selectedDate
    });

    this.#datePickerTo.set('minDate', this._state.dateFrom);
  };

  #closeEndDateHandler = ([selectedDate]) => {
    this._setState({
      ...this._state,
      dateTo: selectedDate
    });

    this.#datePickerFrom.set('maxDate', selectedDate);
  };

  static parsePointToState(point) {
    return {...point};
  }

  static parseStateToPoint(state) {
    return {...state};
  }
}
