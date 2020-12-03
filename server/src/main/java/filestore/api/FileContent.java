package filestore.api;

import io.nure.filestore.web.FileHubWebApplication;

import java.util.Arrays;

import static com.google.common.base.Preconditions.checkNotNull;

/**
 * The value object for the content of the file of the {@link FileHubWebApplication}.
 */
public final class FileContent {

    /**
     * The file content as {@link Byte} array.
     */
    private final byte[] value;

    /**
     * Creates FileContent from {@link Byte} array.
     *
     * @param value the file content as {@link Byte} array.
     */
    public FileContent(byte[] value) {
        this.value = checkNotNull(value);
    }

    /**
     * Retrieves file content.
     *
     * @return the file content as {@link Byte} array.
     */
    public byte[] value() {
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

        FileContent that = (FileContent) o;

        return Arrays.equals(value, that.value);
    }

    @Override
    public int hashCode() {
        return Arrays.hashCode(value);
    }

    @Override
    public String toString() {
        return "FileContent{" +
            "value=" + Arrays.toString(value) +
            '}';
    }
}
