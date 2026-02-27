import AbstractView from '../framework/view/abstract-view.js';
import {EMPTY_LIST_MESSAGE} from '../constants.js';

function createEmptyEventPointBoardTemplate({message}) {
  return (
    `<p class="trip-events__msg">
      ${ message }
    </p>`
  );
}

export default class EmptyEventPointsListView extends AbstractView {
  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createEmptyEventPointBoardTemplate({
      message: EMPTY_LIST_MESSAGE[this.#filterType.toUpperCase()],
    });
  }
}
