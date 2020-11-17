import Mutator from './mutator.js';
import FolderModel from '../models/folder-model.js';

/**
 * Mutates folder property of the state.
 */
export default class FolderMutator extends Mutator {

  /**
   * FolderModel to apply to state.
   * @type {FolderModel}
   */
  _folderItem;

  /**
   * @inheritdoc
   * @param {object} folderObject - folder data to apply to state.
   */
  constructor(folderObject) {
    super();
    this._folderItem = new FolderModel(folderObject);
  }

  /**
   * @inheritdoc
   */
  apply(state) {
    state.folder = this._folderItem;
  }
}
