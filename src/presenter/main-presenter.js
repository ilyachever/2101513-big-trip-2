import {render} from '../render.js';
import ListSortView from '../view/list-sort-view.js';
import TripListView from '../view/trip-list-view.js';
import TripItemView from '../view/trip-item-view.js';
import AddItemView from '../view/add-item-view.js';
import EditItemView from '../view/edit-item-view.js';

const MAX_EVENT_COUNT = 3;

export default class MainPresenter {
  sortComponent = new ListSortView();
  tripListComponent = new TripListView();

  constructor({tripContainer}) {
    this.tripContainer = tripContainer;
  }

  init() {
    render(this.sortComponent, this.tripContainer);
    render(this.tripListComponent, this.tripContainer);
    render(new EditItemView(), this.tripListComponent.getElement());

    for (let i = 0; i < MAX_EVENT_COUNT; i++) {
      render(new TripItemView(), this.tripListComponent.getElement());
    }

    render(new AddItemView(), this.tripListComponent.getElement());
  }
}
