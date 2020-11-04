package io.nure.filrestore.api;

import com.google.errorprone.annotations.Immutable;
import io.nure.filestore.storage.UserId;

import java.util.Objects;

import static com.google.common.base.Preconditions.checkNotNull;
import static java.util.Objects.hash;

/**
 * A value object for logged in user.
 */
@Immutable
public final class LoggedInUser {

    /**
     * An identifier of the user.
     */
    private final UserId identifier;

    /**
     * Creates instance of LoggedInUser with identifier.
     *
     * @param identifier identifier of logged in user.
     */
    public LoggedInUser(UserId identifier) {
        this.identifier = checkNotNull(identifier);
    }

    /**
     * Getter for identifier of logged in user.
     *
     * @return user identifier.
     */
    public UserId identifier() {
        return identifier;
    }

    @Override
    public boolean equals(Object o) {

        if (this == o) {
            return true;
        }

        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        LoggedInUser that = (LoggedInUser) o;

        return Objects.equals(identifier, that.identifier);
    }

    @Override
    public int hashCode() {
        return hash(identifier);
    }

    @Override
    public String toString() {
        return "LoggedInUser {" +
            "identifier=" + identifier +
            '}';
    }
}
