package io.nure.filrestore.storage;

import com.google.errorprone.annotations.Immutable;

import java.util.Objects;

import static com.google.common.base.Preconditions.checkNotNull;
import static java.util.Objects.hash;

/**
 * A value object of token. Authenticates {@link LoggedInUserRecord}.
 */
@Immutable
public final class Token implements RecordId {

    /**
     * A value of token.
     */
    private final String value;

    /**
     * Instantiates Token.
     *
     * @param value value of token.
     */
    public Token(String value) {
        this.value = checkNotNull(value);
    }

    /**
     * Getter for value of token.
     *
     * @return value of token.
     */
    @Override
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

        Token token = (Token) o;

        return Objects.equals(value, token.value);
    }

    @Override
    public int hashCode() {

        return hash(value);
    }

    @Override
    public String toString() {

        return "Token {" +
            "value='" + value + '\'' +
            '}';
    }
}
