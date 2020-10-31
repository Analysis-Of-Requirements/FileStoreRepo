import ListItemModel from './list-item-model.js';

/**
 * Model to store folder data.
 */
export default class FolderModel extends ListItemModel {

  constructor(properties) {
    super(Object.assign(properties, {type: 'folder'}));
  }
}
