import AddPointButtonView from '../view/add-point-button-view.js';
import {render} from '../framework/render.js';

export default class AddPointButtonPresenter {
  #container = null;
  #buttonComponent = null;
  #handleButtonClick = null;

  constructor({container}) {
    this.#container = container;
  }

  init({onButtonClick}) {
    this.#handleButtonClick = onButtonClick;
    this.#buttonComponent = new AddPointButtonView({
      onClick: this.#buttonClickHandler,
    });
    render(this.#buttonComponent, this.#container);
  }

  disabledButton() {
    this.#buttonComponent.setDisabled(true);
  }

  enabledButton() {
    this.#buttonComponent.setDisabled(false);
  }

  #buttonClickHandler = () => {
    this.#handleButtonClick();
  };
}
