package io.nure.filrestore.api;


import io.nure.filrestore.storage.LoggedInUsersStorage;
import io.nure.filrestore.storage.Token;

/**
 * An exception that is thrown when {@link Token} was not found in
 * {@link LoggedInUsersStorage}.
 */
public class TokenNotFoundException extends RuntimeException {

    /**
     * Instantiates TokenNotFoundException.
     *
     * @param message description of exceptional situation.
     */
    public TokenNotFoundException(String message) {
        super(message);
    }
}
