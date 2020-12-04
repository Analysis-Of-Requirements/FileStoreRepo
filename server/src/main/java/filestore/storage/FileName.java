package filestore.storage;

import com.google.errorprone.annotations.Immutable;

import java.util.Objects;

import static com.google.common.base.Preconditions.checkNotNull;
import static java.util.Objects.hash;

/**
 * A value object for name of {@link FileMetadataRecord}.
 */
@Immutable
public final class FileName implements Comparable<FileName> {

    /**
     * The value of the file name.
     */
    private final String value;

    /**
     * Instantiates FileName.
     *
     * @param value value of the file name.
     */
    public FileName(String value) {
        this.value = checkNotNull(value);
    }

    /**
     * Getter for the value of the file name.
     *
     * @return the name of the file.
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

        FileName that = (FileName) o;

        return Objects.equals(value, that.value);
    }

    @Override
    public int hashCode() {
        return hash(value);
    }

    @Override
    public String toString() {
        return "FileName{" +
            "value='" + value + '\'' +
            '}';
    }

    /**
     * Defines a strategy of comparing instances of the FileName objects.
     *
     * @param o a FileName object to compare.
     * @return a negative integer, zero, or a positive integer as this FileName object is less than, equal to, or
     * greater than the specified FileName object.
     */
    @Override
    public int compareTo(FileName o) {
        return value.compareTo(o.value());
    }
}
