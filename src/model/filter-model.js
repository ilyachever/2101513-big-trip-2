import Observable from '../framework/observable.js';
import {FILTERS_TYPE} from '../constants.js';

export default class FilterModel extends Observable {
  #filter = FILTERS_TYPE.EVERYTHING;

  get() {
    return this.#filter;
  }

  set(updateType, update) {
    this.#filter = update;
    this._notify(updateType, update);
  }
}
