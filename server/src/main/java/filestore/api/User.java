package filestore.api;

import com.google.errorprone.annotations.Immutable;
import io.nure.filestore.storage.LoginName;
import io.nure.filestore.storage.UserId;
import io.nure.filestore.web.FileHubWebApplication;

import java.util.Objects;

import static com.google.common.base.Preconditions.checkNotNull;
import static java.util.Objects.hash;

/**
 * The value object of user of {@link FileHubWebApplication}.
 */
@Immutable
public final class User {

    /**
     * The user identifier.
     */
    private final UserId identifier;

    /**
     * The user login name.
     */
    private final LoginName loginName;

    /**
     * Instantiates User with identifier and login name.
     *
     * @param identifier the identifier of the user.
     * @param loginName  the login name of the user.
     */
    public User(UserId identifier, LoginName loginName) {

        this.identifier = checkNotNull(identifier);
        this.loginName = checkNotNull(loginName);
    }

    /**
     * Getter for the user identifier.
     *
     * @return the user identifier.
     */
    public UserId identifier() {
        return identifier;
    }

    /**
     * Getter for the user login name.
     *
     * @return the user login name.
     */
    public LoginName loginName() {
        return loginName;
    }

    @Override
    public boolean equals(Object o) {

        if (this == o) {
            return true;
        }

        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        User user = (User) o;

        return Objects.equals(identifier, user.identifier) &&
            Objects.equals(loginName, user.loginName);
    }

    @Override
    public int hashCode() {
        return hash(identifier, loginName);
    }

    @Override
    public String toString() {
        return "User{" +
            "identifier=" + identifier +
            ", loginName=" + loginName +
            '}';
    }
}
