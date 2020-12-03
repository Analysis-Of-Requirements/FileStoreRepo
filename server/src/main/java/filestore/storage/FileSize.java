package filestore.storage;

import com.google.errorprone.annotations.Immutable;

import static com.google.common.base.Preconditions.checkArgument;
import static java.lang.String.format;
import static java.util.Objects.hash;

/**
 * A value object for size of the file of {@link FileMetadataRecord}.
 */
@Immutable
public final class FileSize {

    /**
     * The value of size of the file in bytes.
     */
    private final long value;

    /**
     * Instantiates FileSize.
     *
     * @param value size of the file in bytes.
     */
    public FileSize(long value) {

        checkArgument(value >= 0, format("Size of a file cannot be negative: %d", value));

        this.value = value;
    }

    /**
     * Getter for size of the file.
     *
     * @return size of the file
     */
    public long value() {
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

        FileSize that = (FileSize) o;

        return value == that.value;
    }

    @Override
    public int hashCode() {
        return hash(value);
    }

    @Override
    public String toString() {
        return "FileSize{" +
            "value=" + value +
            '}';
    }
}
