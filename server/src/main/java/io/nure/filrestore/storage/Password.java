package io.nure.filrestore.storage;

import com.google.errorprone.annotations.Immutable;

import java.util.Objects;

import static java.lang.String.format;
import static java.util.Objects.hash;

/**
 * Value object that holds password value.
 */
@Immutable
public final class Password {

    /**
     * Password value.
     */
    private final String value;

    /**
     * Instantiates Password.
     *
     * @param value - password value.
     */
    public Password(String value) {

        this.value = validate(value);
    }

    /**
     * Validates password to follow the rules:
     * - not-null string.
     * - at least 8 characters long.
     * - contains at least one lower-case Latin character.
     * - contains at least one upper-case Latin character.
     * - contains at least one digit.
     *
     * @param password password to assert.
     * @return validated password.
     * @throws InvalidPasswordException in case of password doesn't follow the rules.
     */
    private String validate(String password) {

        if (password == null) {
            throw new InvalidPasswordException("Password is null, but shouldn't.");
        }

        if (!password.matches("^[a-zA-Z0-9]{8,}$")) {

            throw new InvalidPasswordException("Password should contain only Latin and digit characters and be at " +
                "least 8 characters long.");
        }

        if (!password.matches(createContainsMatcher("a-z"))) {

            throw new InvalidPasswordException("Password should contain at least one lower-case Latin character.");
        }

        if (!password.matches(createContainsMatcher("A-Z"))) {

            throw new InvalidPasswordException("Password should contain at least one upper-case Latin character.");
        }

        if (!password.matches(createContainsMatcher("0-9"))) {

            throw new InvalidPasswordException("Password should contain at least one digit.");
        }

        return password;
    }

    /**
     * Creates regex matcher that matches input that contains at least one occurrence of {@link Character} from provided
     * range.
     *
     * @param range regex range.
     * @return create matcher.
     */
    private String createContainsMatcher(String range) {

        return format("^[^%s]*([%s][^%s]*)+[^%s]*$", range, range, range, range);
    }

    /**
     * Getter for password.
     *
     * @return password value.
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

        Password password = (Password) o;

        return Objects.equals(value, password.value);
    }

    @Override
    public int hashCode() {

        return hash(value);
    }

    @Override
    public String toString() {
        return format("Password: {value: \"%s\"}", value);
    }
}
