import {EditType, EventTypes, POINT_EMPTY} from '../constants.js';
import {humanizeEventDate} from '../utils/events.js';
import {toUpperCaseFirstSign} from '../utils/common.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import he from 'he';

function createButtonTemplate(isCreating, isDisabled, isDeleting) {
  if (isCreating) {
    return `
    <button class="event__reset-btn" type="reset">Cancel</button>
  `;
  }
  return `
    <button class="event__reset-btn" ${isDisabled ? 'disabled' : ''} type="reset">
        ${isDeleting ? 'Deleting...' : 'Delete'}
    </button>
    <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
    </button>
  `;
}

function createDestinationOptionTemplate(destinations) {
  return destinations.map((destination) => (
    `
      <option value="${he.encode(destination)}"></option>
    `
  )).join('');
}

function createEventTypeTemplate(eventTypes, currentType) {
  return eventTypes.map((type) => (
    `<div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === currentType ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${toUpperCaseFirstSign(type)}</label>
    </div>`
  )).join('');
}

function createOfferTemplate(offer, isChecked) {
  const {id, title, price} = offer;
  const checked = isChecked ? 'checked' : '';
  return (
    `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${he.encode(title)}-${id}" type="checkbox" name="event-offer-${he.encode(title)}" data-id="${id}" ${checked}>
        <label class="event__offer-label" for="event-offer-${he.encode(title)}-${id}">
          <span class="event__offer-title">${he.encode(title)}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${price}</span>
        </label>
      </div>`
  );
}

function createOfferListTemplate(offers, checkedOffers) {
  return (
    `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
          ${offers.map((offer) => createOfferTemplate(offer, checkedOffers?.includes(offer.id))).join('')}
        </div>
      </section>`
  );
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
        <p class="event__destination-description">${he.encode(description)}</p>
            ${createPhotoContainerTemplate(pictures)}
      </section>`
    );
  }

  return '';
}

function createEditItemTemplate({state, eventPointDestinations, eventPointOffers, editorMode}) {
  const {basePrice, dateFrom, dateTo, type, id, destination, isDisabled, isSaving, isDeleting} = state;
  const isCreating = editorMode === EditType.CREATING;
  const selectedDestination = eventPointDestinations.find((item) => item.id === destination);
  const currentEventPointOffers = eventPointOffers.find((offer) => offer.type === type);
  const selectedDestinationName = selectedDestination ? selectedDestination.name : '';
  const listCities = eventPointDestinations.map(({name}) => name);
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
                  <legend class="visually-hidden">Event type</legend>
                  ${type ? createEventTypeTemplate(EventTypes, type) : ''}
                </fieldset>
              </div>
            </div>
            <div class="event__field-group  event__field-group--destination">
              <label class="event__label  event__type-output" for="event-destination-${id}">
                ${type}
              </label>
              <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${he.encode(selectedDestinationName)}" list="destination-list-1">
              <datalist id="destination-list-1">
                ${createDestinationOptionTemplate(listCities)}
              </datalist>
            </div>
            <div class="event__field-group  event__field-group--time">
              <label class="visually-hidden" for="event-start-time-1">From</label>
              <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${isCreating ? '' : humanizeEventDate(dateFrom)}">
              &mdash;
              <label class="visually-hidden" for="event-end-time-1">To</label>
              <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${isCreating ? '' : humanizeEventDate(dateTo)}">
            </div>
            <div class="event__field-group  event__field-group--price">
              <label class="event__label" for="event-price-1">
                <span class="visually-hidden">Price</span>
                &euro;
              </label>
              <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}" pattern="\\d*">
            </div>
            <button class="event__save-btn  btn  btn--blue" type="submit">${isSaving ? 'Saving...' : 'Save'}</button>
            ${createButtonTemplate(isCreating, isDisabled, isDeleting)}
          </header>
          <section class="event__details">
            ${currentEventPointOffers.offers.length ? createOfferListTemplate(currentEventPointOffers.offers, state.offers) : ''}
            ${selectedDestination ? createDestinationTemplate(selectedDestination) : ''}
          </section>
        </form>
      </li>`
  );
}

export default class EditPointView extends AbstractStatefulView {
  #destinations = [];
  #offers = [];
  #onCloseClick = null;
  #onSaveEdit = null;
  #onDeleteClick = null;
  #datePickerFrom = null;
  #datePickerTo = null;
  #editorMode = null;

  constructor(
    {
      destinations,
      eventPoint = POINT_EMPTY,
      offers,
      onCloseClick,
      onSaveEdit,
      onDeleteClick,
      editorMode = EditType.EDITING
    }
  ) {
    super();
    this.#destinations = destinations;
    this.#offers = offers;
    this.#onCloseClick = onCloseClick;
    this.#onDeleteClick = onDeleteClick;
    this.#onSaveEdit = onSaveEdit;
    this.#editorMode = editorMode;
    this._setState(EditPointView.parsePointToState(eventPoint));
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

  #saveEditFormHandler = (evt) => {
    evt.preventDefault();
    this.#onSaveEdit(EditPointView.parseStateToPoint(this._state));
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
      EditPointView.parsePointToState(point),
    );
  }

  _restoreHandlers = () => {
    if (this.#editorMode === EditType.EDITING) {
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#onCloseClick);
      this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteClickHandler);
    }
    if (this.#editorMode === EditType.CREATING) {
      this.element.querySelector('.event__reset-btn').addEventListener('click', this.#onCloseClick);
    }
    this.element.querySelector('.event.event--edit').addEventListener('submit', this.#saveEditFormHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationOptionHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceChangeHandler);
    this.element.querySelector('.event__available-offers')?.addEventListener('change', this.#offersChangeHandler);
    this.#setDatepicker();
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#onDeleteClick(this._state);
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
      onChange: this.#closeStartDateChangeHandler,
      maxDate: this._state.dateTo,
    });

    this.#datePickerTo = flatpickr(endDateNode, {
      ...flatPickerConfig,
      defaultDate: this._state.dateTo,
      onChange: this.#closeEndDateChangeHandler,
      minDate: this._state.dateFrom,
    });
  };

  #closeStartDateChangeHandler = ([selectedDate]) => {
    this._setState({
      ...this._state,
      dateFrom: selectedDate
    });

    this.#datePickerTo.set('minDate', this._state.dateFrom);
  };

  #closeEndDateChangeHandler = ([selectedDate]) => {
    this._setState({
      ...this._state,
      dateTo: selectedDate
    });

    this.#datePickerFrom.set('maxDate', selectedDate);
  };

  static parsePointToState(point) {
    return {
      ...point,
      isDisabled: false,
      isSaving: false,
      isDeleting: false
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  }
}
