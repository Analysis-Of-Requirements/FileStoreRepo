package io.nure.filestore.storage;

import com.google.errorprone.annotations.Immutable;

import java.util.Objects;

import static com.google.common.base.Preconditions.checkNotNull;
import static java.util.Objects.hash;

/**
 * A value object for name of {@link FolderRecord}.
 */
@Immutable
public final class FolderName implements Comparable<FolderName> {

    /**
     * The value of folder name.
     */
    private final String value;

    /**
     * Instantiates FolderName.
     *
     * @param value value of folder name.
     */
    public FolderName(String value) {
        this.value = checkNotNull(value);
    }

    /**
     * Getter for value of folder name.
     *
     * @return name of folder name.
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

        FolderName that = (FolderName) o;

        return Objects.equals(value, that.value);
    }

    @Override
    public int hashCode() {
        return hash(value);
    }

    @Override
    public String toString() {

        return "FolderName {" +
            "value='" + value + '\'' +
            '}';
    }

    /**
     * Defines a strategy of comparing instances of the FolderName objects.
     *
     * @param o a FolderName object to compare.
     * @return a negative integer, zero, or a positive integer as this FolderName object is less than, equal to, or
     * greater than the specified FolderName object.
     */
    @Override
    public int compareTo(FolderName o) {
        return value.compareTo(o.value());
    }
}
