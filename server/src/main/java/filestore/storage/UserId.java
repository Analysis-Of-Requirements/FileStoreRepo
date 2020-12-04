package filestore.storage;

import com.google.errorprone.annotations.Immutable;

import java.util.Objects;

import static com.google.common.base.Preconditions.checkNotNull;
import static java.util.Objects.hash;

/**
 * Identifier of {@link UserRecord}. Identifies record among others in {@link UserStorage}.
 */
@Immutable
public final class UserId implements RecordId {

    /**
     * Value of user identifier. Should be not-null.
     */
    private final String value;

    /**
     * Instantiates UserId.
     *
     * @param value - value of user identifier.
     */
    public UserId(String value) {

        this.value = checkNotNull(value);
    }

    /**
     * Getter for value of user identifier.
     *
     * @return value of user identifier.
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

        UserId userId = (UserId) o;

        return Objects.equals(value, userId.value);
    }

    @Override
    public int hashCode() {
        return hash(value);
    }

    @Override
    public String toString() {

        return "UserId {" +
            "value='" + value + '\'' +
            '}';
    }
}
