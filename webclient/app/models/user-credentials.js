/**
 * Value object for storing user credentials.
 */
export default class UserCredentials {

  /**
   * User login.
   * @type {string}.
   * @readonly
   */
  login;

  /**
   * User password.
   * @type {string}.
   * @readonly
   */
  password;

  /**
   * Instantiates UserCredentials value object.
   *
   * @param {string} login - user login.
   * @param {string} password - password.
   */
  constructor(login, password) {
    this.login = login;
    this.password = password;
  }
}
