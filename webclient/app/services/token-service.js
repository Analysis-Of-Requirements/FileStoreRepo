/**
 * Service for setting and getting token from inner storage memory.
 */
export default class TokenService {

  /**
   * local storage instance.
   */
  _storage;

  /**
   * Instantiates TokenService instance.
   *
   * @param {Storage} localStorage - local storage.
   */
  constructor(localStorage) {
    this._storage = localStorage;
  }

  /**
   * Sets token to a memory.
   *
   * @param {string} token - token to set.
   */
  setToken(token) {
    this._storage.setItem('accessToken', token);
  }

  /**
   * Retrieves token from memory.
   *
   * @return {string} - retrieved token.
   */
  getToken() {
    return this._storage.getItem('accessToken');
  }

  /**
   * Deletes token from memory.
   */
  deleteToken() {
    this._storage.clear();
  }
}
