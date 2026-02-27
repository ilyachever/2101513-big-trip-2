import AbstractView from '../framework/view/abstract-view.js';

function createEmptyEventPointBoardTemplate() {
  return (
    `<p class="trip-events__msg">
      Click New Event to create your first point
    </p>`
  );
}

export default class EmptyEventPointBoard extends AbstractView {
  get template() {
    return createEmptyEventPointBoardTemplate();
  }
}
