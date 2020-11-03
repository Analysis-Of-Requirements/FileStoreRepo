package io.nure.filrestore.api;


import io.nure.filrestore.storage.ExpirationTime;
import io.nure.filrestore.storage.LoggedInUserRecord;

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
