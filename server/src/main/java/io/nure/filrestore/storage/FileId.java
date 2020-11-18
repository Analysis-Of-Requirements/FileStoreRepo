package io.nure.filrestore.storage;

import com.google.errorprone.annotations.Immutable;

import io.nure.filestore.storage.RecordId;
import java.util.Objects;

import static com.google.common.base.Preconditions.checkNotNull;
import static java.util.Objects.hash;

/**
 * An identifier of {@link FileMetadataRecord}.
 */
@Immutable
public final class FileId implements RecordId {

    /**
     * A value of the identifier.
     */
    private final String value;

    /**
     * Instantiates FileId with provided value.
     *
     * @param value the value of the identifier.
     */
    public FileId(String value) {
        this.value = checkNotNull(value);
    }

    /**
     * Getter for the value of the identifier.
     *
     * @return the value of the identifier.
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

        FileId fileId = (FileId) o;

        return Objects.equals(value, fileId.value);
    }

    @Override
    public int hashCode() {
        return hash(value);
    }

    @Override
    public String toString() {
        return "FileId{" +
            "value='" + value + '\'' +
            '}';
    }
}
