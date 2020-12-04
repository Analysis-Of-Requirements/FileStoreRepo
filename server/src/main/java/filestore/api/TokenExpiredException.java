package filestore.api;

import io.nure.filestore.storage.ExpirationTime;
import io.nure.filestore.storage.LoggedInUserRecord;

/**
 * An exception that is thrown if {@link ExpirationTime} of
 * {@link LoggedInUserRecord} expired.
 */
public class TokenExpiredException extends RuntimeException {

    /**
     * Instantiates TokenExpiredException.
     *
     * @param message description of exceptional situation.
     */
    public TokenExpiredException(String message) {
        super(message);
    }
}
