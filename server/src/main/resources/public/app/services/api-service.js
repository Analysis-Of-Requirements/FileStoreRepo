import AuthenticationError from '../models/errors/authentication-error.js';
import ServerValidationError from '../models/errors/server-validation-error.js';
import GeneralServerError from '../models/errors/general-server-error.js';
import ResourceNotFoundError from '../models/errors/resource-not-found-error.js';

/**
 * Contains methods that send requests to server.
 * Responsible for establishing connection with server.
 *
 * 400 - general client error.
 * 401 - authentication error.
 * 422 - validation error.
 * 500 - general server error.
 */
export default class ApiService {

  /**
   * Instantiates ApiService.
   *
   * @param {TokenService} tokenService - token service for retrieving current session token.
   */
  constructor(tokenService) {
    this.tokenService = tokenService;
  }

  /**
   * Makes login request on server.
   *
   * @param {UserCredentials} userCredentials - login and password.
   * @return {Promise} resolving promise in case of successful login or rejected promise
   * with error description.
   */
  async logIn(userCredentials) {

    const initObject = new InitObjectBuilder()
        .withHttpMethod('POST')
        .withBody(JSON.stringify(userCredentials))
        .build();

    return fetch('/api/login', initObject)
        .catch((networkError) => {
          console.error(`Network error: ${networkError}.`);
        })
        .then((response) => this._validateResponse(response))
        .then((response) => response.json())
        .then(({token}) => this.tokenService.setToken(token));
  }

  /**
   * Makes registration request on server.
   *
   * @param {UserCredentials} userCredentials - login and password.
   * @return {Promise} resolving promise in case of successful registration or
   * rejected promise with error description.
   */
  async register(userCredentials) {

    const initObject = new InitObjectBuilder()
        .withHttpMethod('POST')
        .withBody(JSON.stringify(userCredentials))
        .build();

    return fetch('/api/registration', initObject)
        .catch((networkError) => {
          console.error(`Network error: ${networkError}.`);
        })
        .then((response) => this._validateResponse(response));
  }

  /**
   * Validates response status code.
   *
   * @param {Response} response - fetch response.
   * @return {Promise<Response>} - resolved promise.
   * @throws {Error}.
   * @private
   */
  async _validateResponse(response) {
    const {status} = response;

    if (status === 200) {
      return response;
    }

    const internalServerErrorCode = 500;
    const errorCallbacks = {
      401: async () => {
        this.tokenService.deleteToken();
        const message = await response.text();
        return new AuthenticationError(message);
      },
      404: async () => {
        const message = await response.text();
        return new ResourceNotFoundError(message);
      },
      422: async () => {
        const erroneousJson = await response.json();
        return new ServerValidationError(erroneousJson);
      },
      [internalServerErrorCode]: () => new GeneralServerError(),
    };
    const error = errorCallbacks[status] || errorCallbacks[internalServerErrorCode];
    throw await error();
  }

  /**
   * Makes fetch request to retrieve folder entity.
   *
   * @param {string} folderId - retrieve folder meta data by that id.
   * @return {Promise<void, Error>} - resulting promise.
   */
  async getFolder(folderId) {

    const initObject = new InitObjectBuilder()
        .withHttpMethod('GET')
        .withHeader('Authentication', this._getBearerAccessToken())
        .build();

    return fetch(`/api/folder/${folderId}`, initObject)
        .catch((networkError) => {
          console.error(`Network error: ${networkError}.`);
        })
        .then((response) => this._validateResponse(response))
        .then((response) => response.json());
  }

  /**
   * Makes fetch request to retrieve root folder meta data.
   *
   * @return {Promise} - resulting promise wrapping root folder meta data.
   */
  async getRootFolder() {

    const initObject = new InitObjectBuilder()
        .withHttpMethod('GET')
        .withHeader('Authentication', this._getBearerAccessToken())
        .build();

    return fetch(`/api/root`, initObject)
        .catch((networkError) => {
          console.error(`Network error: ${networkError}.`);
        })
        .then((response) => this._validateResponse(response))
        .then((response) => response.json());
  }

  /**
   * Constructs Bearer Access token.
   *
   * @return {string} - bearer access token.
   * @private
   */
  _getBearerAccessToken() {
    return `Bearer ${this.tokenService.getToken()}`;
  }
}

/**
 * Init object builder.
 */
class InitObjectBuilder {

  /**
   * Init object instance.
   * @type {object}
   */
  _initObject;

  /**
   * Instantiates InitObjectBuilder.
   */
  constructor() {
    this._initObject = {};
  }

  /**
   * Adds header.
   *
   * @param {string} header - request header.
   * @param {string} content - header's content.
   * @return {InitObjectBuilder}
   */
  withHeader(header, content) {
    this._initObject.headers = this._initObject.headers || {};
    this._initObject.headers[header] = content;
    return this;
  }

  /**
   * Sets HTTP method.
   *
   * @param {string} method - HTTP method. May be GET, POST, HEAD, DELETE, PUT, etc.
   * @return {InitObjectBuilder}
   */
  withHttpMethod(method) {
    this._initObject.method = method;
    return this;
  }

  /**
   * Sets body.
   *
   * @param {*} body - request body. Typically used with POST/PUT methods.
   * @return {InitObjectBuilder}
   */
  withBody(body) {
    this._initObject.body = body;
    return this;
  }

  /**
   * Builds init object.
   *
   * @return {Object}
   */
  build() {
    return this._initObject;
  }
}
