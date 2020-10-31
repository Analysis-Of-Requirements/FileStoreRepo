/**
 * Service for displaying toast messages onto screen.
 */
export default class ToastService {

    /**
     * Toasted object.
     * @type {Toasted}
     */
    _toasted;

    /**
     * Instantiates ToastService.
     */
    constructor() {
        this._toasted = new Toasted({
            duration: 5000,
            type: 'error',
            theme: 'alive',
        });
    }

    /**
     * Displays error message toast.
     *
     * @param {string} message - error message.
     */
    showError(message) {
        this._toasted.error(message);
    }
}
