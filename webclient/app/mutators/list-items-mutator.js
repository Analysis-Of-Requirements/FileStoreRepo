import Mutator from './mutator.js';
import FileModel from '../models/file-model.js';
import FolderModel from '../models/folder-model.js';

/**
 * Sets list of items to a current state.
 */
export default class ListItemsMutator extends Mutator {

  /**
   * List items of file list.
   * @type {object[]} object items to set to state.
   * @private
   */
  _listItems;

  /**
   * Instantiates List Items mutator.
   *
   * @param {object[]} listItems - list of items to set to the state.
   */
  constructor(listItems) {
    super();
    this._listItems = listItems;
  }

  /**
   * @inheritdoc
   */
  apply(state) {
    state.listItems = this._listItems.map((item) => this._createModel(item));
  }

  /**
   * Creates list item model, depending on type property of the object.
   *
   * @param {object} item - base of list item model object.
   * @return {null|FolderModel|FileModel} - instantiated model.
   */
  _createModel(item) {
    const listItemModelCreators = {
      'file': () => new FileModel(item),
      'folder': () => new FolderModel(item),
    };
    const createModel = listItemModelCreators[item.type];

    if (createModel) {
      return createModel();
    }

    throw new TypeError(`Cannot create model for type ${item.type}.`);
  }
}
