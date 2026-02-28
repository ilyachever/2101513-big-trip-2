import {render, remove} from '../framework/render.js';
import TripListView from '../view/trip-list-view.js';
import PointPresenter from './point-presenter.js';
import {FilterType, SortType, TimeLimit, UpdateType, UserAction} from '../constants.js';
import SortPresenter from './sort-presenter.js';
import {sorting} from '../utils/sort.js';
import {filter} from '../utils/filter.js';
import AddPointPresenter from './add-point-presenter.js';
import LoaderView from '../view/loading-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import EmptyEventPointsListView from '../view/empty-event-points-list-view.js';
export default class PointsPresenter {
  #tripContainer = null;
  #destinationModel = null;
  #eventPointsModel = null;
  #offersModel = null;
  #filtersModel = null;
  #tripListComponent = new TripListView();
  #emptyListComponent = null;
  #pointsPresenter = new Map();
  #loadingComponent = new LoaderView();
  #isLoading = true;
  #sortPresenter = null;
  #addPointPresenter = null;
  #addPointButtonPresenter = null;
  #currentSortType = SortType.DAY;
  #isCreating = false;
  #uiBlocker = new UiBlocker({lowerLimit: TimeLimit.LOWER_LIMIT, upperLimit: TimeLimit.UPPER_LIMIT});

  constructor({tripContainer, destinationModel, eventPointsModel, offersModel, filtersModel, addPointButtonPresenter}) {
    this.#tripContainer = tripContainer;
    this.#destinationModel = destinationModel;
    this.#eventPointsModel = eventPointsModel;
    this.#offersModel = offersModel;
    this.#filtersModel = filtersModel;
    this.#eventPointsModel.addObserver(this.#modelEventChangeHandler);
    this.#filtersModel.addObserver(this.#modelEventChangeHandler);
    this.#addPointButtonPresenter = addPointButtonPresenter;
    this.#addPointPresenter = new AddPointPresenter({
      container: this.#tripListComponent.element,
      destinationModel: this.#destinationModel,
      offersModel: this.#offersModel,
      onDataChange: this.#viewActionChangeHandler,
      onDestroy: this.#addPointDestroyHandler,
    });
  }

  get points() {
    const filterType = this.#filtersModel.get();
    const filteredPoints = filter[filterType](this.#eventPointsModel.get());
    return sorting[this.#currentSortType](filteredPoints);
  }

  init() {
    this.#renderBoard();
  }

  #renderBoard() {
    if (this.#isLoading) {
      this.#addPointButtonPresenter.disabledButton();
      this.#renderLoading();
      return;
    }

    if (this.points.length === 0 && !this.#isCreating) {
      this.#renderEmptyList();
      this.#addPointButtonPresenter.enabledButton();
      return;
    }

    if (!this.#isCreating) {
      this.#addPointButtonPresenter.enabledButton();
    }

    this.#renderSort();
    this.#renderTripList();
    this.#renderPoints();
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#tripContainer);
  }

  #clearBoard = ({resetSortType = false} = {}) => {
    this.#clearPoints();
    if (this.#sortPresenter) {
      this.#sortPresenter.destroy();
    }
    remove(this.#emptyListComponent);
    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };

  #clearPoints = () => {
    this.#pointsPresenter.forEach((presenter) => presenter.destroy());
    this.#pointsPresenter.clear();
    this.#addPointPresenter.destroy();
  };

  #modelEventChangeHandler = (updateType, data) => {
    if (updateType === UpdateType.PATCH) {
      this.#pointsPresenter.get(data?.id)?.init(data);
    }
    if (updateType === UpdateType.MINOR) {
      this.#clearBoard();
      this.#renderBoard();
    }
    if (updateType === UpdateType.MAJOR) {
      this.#clearBoard({resetSortType: true});
      this.#renderBoard();
    }
    if (updateType === UpdateType.INIT) {
      this.#isLoading = false;
      remove(this.#loadingComponent);
      this.#renderBoard();
    }
    if (updateType === UpdateType.ERROR) {
      this.#isLoading = false;
      remove(this.#loadingComponent);
      this.#renderErrorMessage();
    }
  };

  #viewActionChangeHandler = async (actionType, updateType, update) => {

    this.#uiBlocker.block();
    if (actionType === UserAction.UPDATE_POINT) {
      this.#pointsPresenter.get(update.id).setSaving();
      try {
        await this.#eventPointsModel.update(updateType, update);
      } catch (error) {
        this.#pointsPresenter.get(update.id).setAborting();
      }
    }
    if (actionType === UserAction.CREATE_POINT) {
      this.#addPointPresenter.setSaving();
      try {
        await this.#eventPointsModel.add(updateType, update);

        this.#addPointPresenter.destroy({isCanceled: false});
      } catch (error) {
        this.#addPointPresenter.setAborting();
      }
    }
    if (actionType === UserAction.DELETE_POINT) {
      this.#pointsPresenter.get(update.id).setRemove();
      try {
        await this.#eventPointsModel.delete(updateType, update);
      } catch (error) {
        this.#pointsPresenter.get(update.id).setAborting();
      }
    }
    this.#uiBlocker.unblock();
  };

  #renderSort() {
    this.#sortPresenter = new SortPresenter({
      container: this.#tripContainer,
      currentSortType: this.#currentSortType,
      sortTypeHandler: this.#sortTypesChangeHandler,
    });
    this.#sortPresenter.init();
  }

  #renderTripList() {
    render(this.#tripListComponent, this.#tripContainer);
  }

  #sortTypesChangeHandler = (sortType) => {
    this.#currentSortType = sortType;
    this.#clearPoints();
    this.#renderPoints();
  };

  #handleModeChange = () => {
    this.#pointsPresenter.forEach((presenter) => presenter.resetView());
    this.#addPointPresenter.destroy();
  };

  #renderPoints() {
    this.points.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #renderErrorMessage() {
    this.#emptyListComponent = new EmptyEventPointsListView({
      filterType: this.#filtersModel.get(),
      isServerError: true,
    });
    render(this.#emptyListComponent, this.#tripContainer);
  }

  #renderEmptyList() {
    this.#emptyListComponent = new EmptyEventPointsListView({
      filterType: this.#filtersModel.get(),
    });

    render(this.#emptyListComponent, this.#tripContainer);
  }

  addPointButtonClickHandler = () => {
    this.#isCreating = true;
    this.#addPointButtonPresenter.disabledButton();
    this.#filtersModel.set(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#currentSortType = SortType.DAY;
    this.#addPointPresenter.init();
  };

  #addPointDestroyHandler = ({isCanceled}) => {
    this.#isCreating = false;
    this.#addPointButtonPresenter.enabledButton();
    if (!this.points.length && isCanceled) {
      this.#clearBoard();
      this.#renderBoard();
    }
  };

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#tripListComponent.element,
      destinationModel: this.#destinationModel,
      offersModel: this.#offersModel,
      onPointChange: this.#viewActionChangeHandler,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(point);
    this.#pointsPresenter.set(point.id, pointPresenter);
  }
}
