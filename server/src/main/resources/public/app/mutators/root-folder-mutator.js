import Mutator from './mutator.js';
import FolderModel from '../models/folder-model.js';

/**
 * Applies passed root folder to state.
 */
export default class RootFolderMutator extends Mutator {


  /**
   * Root folder data.
   * @type {FolderModel}
   */
  _rootFolderItem;

  /**
   * @inheritdoc
   * @param {object} rootFolderObject - configuration of FolderModel.
   */
  constructor(rootFolderObject) {
    super();
    this._rootFolderItem = new FolderModel(rootFolderObject);
  }

  /**
   * @inheritdoc
   */
  apply(state) {
    state.rootFolder = this._rootFolderItem;
  }
}
