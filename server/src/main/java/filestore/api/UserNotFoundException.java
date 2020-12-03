package filestore.api;

import io.nure.filestore.storage.UserRecord;
import io.nure.filestore.storage.UserStorage;

/**
 * An exception that is thrown when a {@link UserRecord} is not found in the {@link UserStorage}.
 */
public class UserNotFoundException extends RuntimeException {

    /**
     * Instantiates UserNotFoundException.
     *
     * @param message an error message.
     */
    public UserNotFoundException(String message) {
        super(message);
    }
}
