/**
 * Model to store list item data.
 * @abstract
 */
export default class ListItemModel {

  /**
   * Name of list item.
   * @type {string}
   */
  name;

  /**
   * Item's id.
   * @type {string}
   */
  id;

  /**
   * Type of list item. May be: folder | file.
   * @type {string}
   */
  type;

  /**
   * If type is 'file', then it is worth to specify fileType.
   * Shorthand notation of MIME-types: video, music, image, doc...
   * @type {string}
   */
  fileType;

  /**
   * If type is 'file', then specify the size of item in KB.
   * @type {number}
   */
  size;

  /**
   * If file is 'folder', then itemsAmount is amount of items in it.
   * @type {number}.
   */
  itemsAmount;

  /**
   * Id of parent model.
   * @type {string}.
   */
  parentId;

  /**
   * Instantiates List Item Model.
   *
   * @param {object} properties - list item model data.
   * @param {string} properties.name - name of list item.
   * @param {string} properties.id - item's id.
   * @param {string} properties.type - type of list item.
   * @param {string} properties.fileType - if type is 'file', then it is worth to specify fileType.
   * Shorthand notation of MIME-types: video, music, image, doc, else.
   * @param {number} properties.size - if type is 'file', then specify the size of item in KB.
   * @param {number} properties.itemsAmount - if file is 'folder', then itemsAmount is amount of items in it.
   * @param {number} properties.parentId - id of parent model.
   */
  constructor(properties) {
    Object.assign(this, properties)
  }
}
