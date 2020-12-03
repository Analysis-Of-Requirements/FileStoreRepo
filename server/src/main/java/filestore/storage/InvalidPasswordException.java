package filestore.storage;

/**
 * An exception that is raised when {@link Password} is invalid or failed validation.
 */
public class InvalidPasswordException extends RuntimeException {

    /**
     * Instantiates InvalidPasswordException.
     *
     * @param message - error message.
     */
    public InvalidPasswordException(String message) {
        super(message);
    }
}
