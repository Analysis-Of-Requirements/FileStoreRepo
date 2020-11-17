import Component from '../component.js';
import FileComponent from './file/file-component.js';
import FolderComponent from './folder/folder-component.js';
import FileModel from '../../models/file-model.js';
import FolderModel from '../../models/folder-model.js';
import EventHandlersStorage from '../../event/event-handlers-storage.js';

/**
 * Enumeration of possible type of list item.
 *
 * @type {Readonly<{FILE: string, FOLDER: string}>}
 */
const ListItemType = {
  FOLDER: 'folder',
  FILE: 'file',
};

/**
 * Component for rendering 'list of files' element.
 */
export default class FileList extends Component {

  /**
   * List items meta data.
   * @type {ListItemModel[]}
   */
  _listItems = [];

  /**
   * Items which are about to delete.
   * @type {ListItemModel[]}
   */
  _itemsToDelete = [];

  /**
   * Items which are currently renaming.
   * @type {ListItemModel[]}
   */
  _renamingListItems = [];

  /**
   * List Item Components that are currently rendered.
   * @type {ListItemComponent[]}
   */
  _itemComponents;

  /**
   * Folders that have their child files uploading at the moment.
   * @type {FolderModel[]}
   */
  _parentFoldersOfUploadingFiles = [];

  /**
   * Files that are currently downloading.
   * @type {FileModel[]}
   */
  _downloadingFileModels = [];

  /**
   * Instantiates List component.
   *
   * @param {HTMLElement} container - parent component.
   */
  constructor(container) {
    super(container);
  }

  /**
   * @inheritdoc
   */
  initComponent() {
    super.initComponent();
    this._doubleClickFolderHandlers = new EventHandlersStorage();
    this._onDeleteListItemHandlers = new EventHandlersStorage();
    this._onUpdateListItemHandlers = new EventHandlersStorage();
    this._onUploadStartHandlers = new EventHandlersStorage();
    this._onDownloadStartHandlers = new EventHandlersStorage();
  }

  /**
   * @inheritdoc
   * @return {string} - markup of list element.
   */
  markup() {
    return `
      <table class="table" data-test="file-list">
        <tbody data-type="file-list-container"></tbody>
      </table>
    `;
  }

  /**
   * @inheritdoc
   */
  initNestedComponents() {
    super.initNestedComponents();

    const {_listItems, _itemsToDelete, _renamingListItems, _onUpdateListItemHandlers, _onDeleteListItemHandlers,
      _doubleClickFolderHandlers} = this;

    if (!_listItems) {
      return;
    }

    const listItemsContainer = this._getFileListHtmlElement();
    this._itemComponents = [];

    _listItems.forEach((listItemModel) => {
      const component = this._createListItemComponent(listItemsContainer, listItemModel);

      component.isRenamingInProgress = _renamingListItems.some((item) => item.id === listItemModel.id);
      component.isDeletionInProgress = _itemsToDelete.some((item) => item.id === listItemModel.id);

      this._itemComponents.push(component);

      if (listItemModel.type === ListItemType.FOLDER) {

        component.isUploadingFileInProgress = this._parentFoldersOfUploadingFiles
          .some((item) => item.id === listItemModel.id);

        component.onUploadButtonClick((folderModel) => {
          this._onUploadStartHandlers.executeHandlers(folderModel);
        });

        component.onDoubleClick(() => {
          if (!component.isDeletionInProgress) {
            _doubleClickFolderHandlers.executeHandlers(listItemModel.id);
          }
        });
      } else if (listItemModel.type === ListItemType.FILE) {

        component.isDownloadingInProgress = this._downloadingFileModels
            .some((item) => item.id === listItemModel.id);

        component.onDownloadButtonClick((fileModel) => {
          this._onDownloadStartHandlers.executeHandlers(fileModel);
        });
      }

      component.onDeleteButtonClick(() => {
        if (!component.isDeletionInProgress) {
          _onDeleteListItemHandlers.executeHandlers(listItemModel);
        }
      });

      component.onClick((event) => {

        if (component.isRenamingInProgress || component.isDeletionInProgress || component.isDownloadingInProgress
          || event.detail !== 1) {
          return;
        }

        if (component.isSelected && !component.isInEditingMode) {
          component.isInEditingMode = true;
        } else if (!component.isSelected) {
          component.isSelected = true;
        }

        this._itemComponents.forEach((item) => {
          if (item.properties.listItem.id !== component.properties.listItem.id) {
            item.isSelected = false;
          }
        });
      });

      component.onInputFocusOut(() => {
        component.isInEditingMode = false;
        component.isSelected = false;
      });

      component.onInputCommit((value) => {

        if (!value || listItemModel.name === value) {
          return;
        }

        const updatedItem = Object.assign({}, listItemModel, {name: value});
        _onUpdateListItemHandlers.executeHandlers(updatedItem);
      });
    });

  }

  /**
   * Factory method for creating list item component, depending on list item model type.
   *
   * @param {Element} container - parent container.
   * @param {ListItemModel|FileModel|FolderModel} listItem - instance of list item model type.
   * @private
   * @return {null|FolderComponent|FileComponent} - instantiated component.
   */
  _createListItemComponent(container, listItem) {
    const {FILE, FOLDER} = ListItemType;
    const listItemCreators = {
      [FILE]: () => new FileComponent(container, {listItem}),
      [FOLDER]: () => new FolderComponent(container, {listItem}),
    };
    const createComponent = listItemCreators[listItem.type];

    if (createComponent) {
      return createComponent();
    }

    throw new TypeError(`Cannot create list item component for type ${listItem.type}.`);
  }

  /**
   * Sets list items to file list.
   *
   * @param {ListItemModel[]} listItems - array of items list.
   */
  set listItems(listItems) {
    this._sortListItems(listItems);
    this._listItems = listItems;
    this._rerender();
  }

  /**
   * Sets list items to delete.
   *
   * @param {ListItemModel[]} listItems - list items to delete.
   */
  set listItemsToDelete(listItems) {
    this._itemsToDelete = listItems;
    this._rerender();
  }

  /**
   * Sets renaming list items.
   *
   * @param {ListItemModel[]} listItems - renaming list items.
   */
  set renamingListItems(listItems) {
    this._renamingListItems = listItems;
    this._rerender();
  }

  /**
   * Moves item to edit mode.
   *
   * @param {FolderModel|FileModel} item - item to move to edit mode.
   */
  moveItemToEditMode(item) {
    const component = this._itemComponents
      .find((component) => component.properties.listItem.id === item.id);

    if (component) {
      component.isInEditingMode = true;
    }
  }

  /**
   * Setter for folders that have their child files uploading at the moment.
   *
   * @param {FolderModel[]} folders - parent folders.
   */
  set parentFoldersOfUploadingFiles(folders) {
    this._parentFoldersOfUploadingFiles = folders;
    this._rerender();
  }

  /**
   * Setter for files that are currently downloading.
   *
   * @param {FileModel[]} files - downloading files.
   */
  set downloadingFileModels(files) {
    this._downloadingFileModels = files;
    this._rerender();
  }

  /**
   * Retrieves FileList HtmlElement.
   *
   * @return {Element} - list item element.
   * @private
   */
  _getFileListHtmlElement() {
    return this.rootElement.querySelector('[data-type="file-list-container"]');
  }

  /**
   * Sorts list items in place in a way that folders go first, files - second.
   * Folders and files are sorted alphabetically inside of own group.
   *
   * @param {ListItemModel[]} listItems - array of items list.
   * @private
   */
  _sortListItems(listItems) {

    listItems.sort((first, second) => {
      const {FILE, FOLDER} = ListItemType;
      const firstType = first.type;
      const secondType = second.type;
      const firstName = first.name;
      const secondName = second.name;

      if (firstType === FOLDER && secondType === FILE) {
        return -1;
      }

      if (firstType === FILE && secondType === FOLDER) {
        return 1;
      }

      if (firstName > secondName) {
        return 1;
      }

      if (firstName < secondName) {
        return -1;
      }

      return 0;
    });
  }

  /**
   * Registers handler, that executes when double click was produced on item.
   *
   * @param {function(itemId: string): void} handler - handler to register.
   */
  onFolderComponentDoubleClick(handler) {
    this._doubleClickFolderHandlers.addEventHandler(handler);
  }

  /**
   * Adds handler for remove list item event.
   *
   * @param {function(listItem: ListItemModel)} handler - handler for
   * remove list item event.
   */
  onRemoveListItem(handler) {
    this._onDeleteListItemHandlers.addEventHandler(handler);
  }

  /**
   * Adds handler for update list item event.
   *
   * @param {function(listItem: ListItemModel)} handler - handler for update list item event.
   */
  onUpdateListItem(handler) {
    this._onUpdateListItemHandlers.addEventHandler(handler);
  }

  /**
   * Adds handler for upload button click event.
   *
   * @param {function(FolderModel)} handler - upload-start handler.
   */
  onUploadStart(handler) {
    this._onUploadStartHandlers.addEventHandler(handler);
  }

  /**
   * Adds handler for downloading files started event.
   *
   * @param {function(FileModel)} handler - downloading-start handler.
   */
  onDownloadFileStart(handler) {
    this._onDownloadStartHandlers.addEventHandler(handler);
  }
}
