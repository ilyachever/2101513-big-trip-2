import AbstractView from '../framework/view/abstract-view.js';
import {EmptyListMessage} from '../constants.js';

function createEmptyEventPointBoardTemplate({message}) {
  return (
    `<p class="trip-events__msg">
      ${message}
    </p>`
  );
}

export default class EmptyEventPointsListView extends AbstractView {
  #filterType = null;
  #isServerError = null;

  constructor({filterType, isServerError = null}) {
    super();
    this.#filterType = filterType;
    this.#isServerError = isServerError;
  }

  get template() {
    if (this.#isServerError) {
      return createEmptyEventPointBoardTemplate({
        message: EmptyListMessage['ERROR'],
      });
    }

    return createEmptyEventPointBoardTemplate({
      message: EmptyListMessage[this.#filterType.toUpperCase()],
    });
  }
}
