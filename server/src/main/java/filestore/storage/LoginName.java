package filestore.storage;

import com.google.errorprone.annotations.Immutable;

import java.util.Objects;

import static java.lang.String.format;
import static java.util.Objects.hash;

/**
 * Value object that holds login name.
 */
@Immutable
public final class LoginName {

    /**
     * Login name value.
     */
    private final String value;

    /**
     * Instantiates LoginName.
     *
     * @param value - not-null login name.
     */
    public LoginName(String value) {

        this.value = validate(value);
    }

    /**
     * Validates login to follow the rules:
     * - not-null string.
     * - at least 4 characters long.
     *
     * @param loginName - login to assert.
     * @return validated login name.
     * @throws InvalidLoginException in case of login doesn't follow that rules.
     */
    private String validate(String loginName) {

        if (loginName == null) {

            throw new InvalidLoginException("Login is null, but shouldn't.");
        }

        if (!loginName.matches("^[a-zA-Z0-9]{4,}$")) {

            throw new InvalidLoginException("Login name must contain only Latin characters and numbers and be at " +
                "least 4 characters long.");
        }

        return loginName;
    }

    /**
     * Getter for login name.
     *
     * @return login name value.
     */
    public String value() {
        return value;
    }

    @Override
    public boolean equals(Object o) {

        if (this == o) {
            return true;
        }

        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        LoginName loginName = (LoginName) o;

        return Objects.equals(value, loginName.value);
    }

    @Override
    public int hashCode() {
        return hash(value);
    }

    @Override
    public String toString() {
        return format("LoginName: {value: \"%s\"}", value);
    }
}
