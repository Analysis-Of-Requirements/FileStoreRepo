package io.nure.filrestore.storage;

import com.google.errorprone.annotations.Immutable;

import java.util.Objects;

import static com.google.common.base.Preconditions.checkNotNull;
import static java.util.Objects.hash;

/**
 * An identifier of {@link FolderRecord}. Identifies the record among others in {@link FolderStorage}.
 */
@Immutable
public final class FolderId implements RecordId {

    /**
     * The value of identifier.
     */
    private final String value;

    /**
     * Instantiates FolderId.
     *
     * @param value value of identifier of folder.
     */
    public FolderId(String value) {
        this.value = checkNotNull(value);
    }

    /**
     * Getter for value of folder identifier.
     *
     * @return value of folder identifier.
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

        FolderId folderId = (FolderId) o;

        return Objects.equals(value, folderId.value);
    }

    @Override
    public int hashCode() {
        return hash(value);
    }

    @Override
    public String toString() {

        return "FolderId {" +
            "value='" + value + '\'' +
            '}';
    }
}
