package filestore.api;

import io.nure.filestore.storage.UserRecord;
import io.nure.filestore.storage.UserStorage;

/**
 * An exception that is thrown when {@link UserRecord} is found in
 * {@link UserStorage} during {@link Registration} process.
 */
public class UserAlreadyExistsException extends RuntimeException {

    /**
     * Instantiates UserAlreadyExistsException.
     *
     * @param message description of exceptional situation.
     */
    public UserAlreadyExistsException(String message) {
        super(message);
    }
}
