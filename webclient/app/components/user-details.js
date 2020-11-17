import Component from './component.js';

/**
 * Component for rendering user details info.
 */
export default class UserDetails extends Component {

  /**
   * Is user loading.
   * @type {boolean}
   */
  _isLoading;

  /**
   * Is user loading error occured.
   * @type {boolean}
   */
  _isError;

  /**
   * Instantiates user details component.
   *
   * @param {HTMLElement} container - parent container.
   * @param {object} properties - configuration properties for the component.
   * @param {string} properties.userName - user name.
   */
  constructor(container, {userName}) {
    super(container, {
      _userName: userName,
    });
  }

  /**
   * @inheritdoc
   * @return {string} markup of user details element.
   */
  markup() {
    const {_isLoading, properties, _isError} = this;
    const {_userName} = properties;

    return `
      <span class="user-details ${_isLoading ? 'loading' : ''} ${_isError ? 'error' : ''}" data-type="user-details">
        <span class="glyphicon glyphicon-user blinker"></span> 
        <span class="user-name" data-type="user-name">${_userName}</span>
        <span class="user-loading" data-type="user-loading">Loading...</span>
        <span class="user-loading-error" data-type="user-error">Error occurred while loading user.</span>
      </span>
    `;
  }

  /**
   * Sets user name.
   *
   * @param {string} userName - user name.
   */
  set userName(userName) {
    this.properties._userName = userName;
    this._rerender();
  }

  /**
   * Sets is loading state for user details.
   *
   * @param {boolean} isLoading - are user details loading.
   */
  set isLoading(isLoading) {
    this._isLoading = isLoading;
    this._rerender();
  }

  /**
   * Setter for error state.
   *
   * @param {boolean} isError - error state.
   */
  set isError(isError) {
    this._isError = isError;
    this._rerender();
  }
}
