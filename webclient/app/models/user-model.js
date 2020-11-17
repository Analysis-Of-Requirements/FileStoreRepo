/**
 * Value object for storing user data.
 */
export default class UserModel {

    /**
     * User id.
     *
     * @type {string}.
     */
    id;

    /**
     * User name.
     *
     * @type {string}.
     */
    name;

    /**
     * Instantiates UserModel.
     *
     * @param {object} data - user details.
     * @param {string} data.id - user id.
     * @param {string} data.name - user name.
     */
    constructor(data) {
        Object.assign(this, data);
    }
}
