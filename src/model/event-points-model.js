import Observable from '../framework/observable.js';
import {adaptToClient, adaptToServer, updateItem} from '../utils/common.js';
import {UpdateType} from '../constants.js';

export default class EventPointsModel extends Observable {
  #service = null;
  #eventPoints = [];
  #destinationModel = null;
  #offersModel = null;

  constructor(service, destinationModel, offersModel) {
    super();
    this.#service = service;
    this.#destinationModel = destinationModel;
    this.#offersModel = offersModel;
  }

  async init() {
    try {
      await Promise.all(
        [
          this.#destinationModel.init(),
          this.#offersModel.init()
        ]
      );
      const points = await this.#service.points;
      this.#eventPoints = points.map(adaptToClient);
      this._notify(UpdateType.INIT, {isError: false});

    } catch (error) {
      this.#eventPoints = [];
      this._notify(UpdateType.ERROR, {isError: true});
    }
  }

  get() {
    return this.#eventPoints;
  }

  getById(id) {
    return this.#eventPoints.find((point) => point.id === id);
  }

  async update(updateType, point) {
    try {
      const updatedPoint = await this.#service.updatePoint(
        adaptToServer(point)
      );
      const adaptedPoint = adaptToClient(updatedPoint);
      this.#eventPoints = updateItem(this.#eventPoints, adaptedPoint);
      this._notify(updateType, adaptedPoint);
    } catch (error) {
      throw new Error('Update point failure');
    }
  }

  async add(updateType, point) {
    try {
      const addedPoint = await this.#service.addPoint(adaptToServer(point));
      const adaptedPoint = adaptToClient(addedPoint);
      this.#eventPoints.push(adaptedPoint);
      this._notify(updateType, adaptedPoint);
    } catch (error) {
      throw new Error('Add point failure');
    }
  }

  async delete(updateType, point) {
    try {
      await this.#service.deletePoint(point);
      this.#eventPoints = this.#eventPoints.filter((item) => item.id !== point.id);
      this._notify(updateType, point);
    } catch (error) {
      throw new Error('Delete point failure');
    }
  }
}
