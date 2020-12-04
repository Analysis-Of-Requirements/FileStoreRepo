package filestore.storage;

import com.google.errorprone.annotations.Immutable;

import java.time.Instant;
import java.util.Objects;

import static com.google.common.base.Preconditions.checkNotNull;
import static java.util.Objects.hash;

/**
 * A value object for expiration time. Used to set lifetime of {@link LoggedInUserRecord}s.
 *
 * <p>The time is stored as {@link Instant} object.
 */
@Immutable
public final class ExpirationTime {

    /**
     * Value of the expiration time.
     */
    private final Instant value;

    /**
     * Instantiates ExpirationTime.
     *
     * @param value value of expiration time.
     */
    public ExpirationTime(Instant value) {
        this.value = checkNotNull(value);
    }

    /**
     * Getter for value of expiration time.
     *
     * @return value of expiration time.
     */
    public Instant value() {
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

        ExpirationTime that = (ExpirationTime) o;

        return Objects.equals(value, that.value);
    }

    @Override
    public int hashCode() {

        return hash(value);
    }

    @Override
    public String toString() {

        return "ExpirationTime {" +
            "value=" + value +
            '}';
    }
}
