package io.nure.filestore.storage;

/**
 * An exception that is raised when {@link LoginName} is invalid or failed validation.
 */
public class InvalidLoginException extends RuntimeException {

    /**
     * Instantiates InvalidLoginException.
     *
     * @param message - error message.
     */
    public InvalidLoginException(String message) {
        super(message);
    }
}
