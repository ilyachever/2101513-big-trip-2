import {createElement} from '../render.js';

function tripListTemplate() {
  return '<ul class="trip-events__list"></ul>';
}

export default class TripListView {
  getTemplate() {
    return tripListTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
