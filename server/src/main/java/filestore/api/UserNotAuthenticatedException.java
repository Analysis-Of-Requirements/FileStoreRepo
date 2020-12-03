package filestore.api;

import io.nure.filestore.storage.LoginName;
import io.nure.filestore.storage.Password;
import io.nure.filestore.storage.UserRecord;
import io.nure.filestore.storage.UserStorage;

/**
 * An exception that is thrown when {@link UserRecord} is not found in
 * {@link UserStorage} by {@link LoginName} and hash of {@link Password}.
 */
public class UserNotAuthenticatedException extends RuntimeException {

    /**
     * Instantiates UserNotAuthenticatedException.
     *
     * @param message description of error.
     */
    public UserNotAuthenticatedException(String message) {
        super(message);
    }
}
