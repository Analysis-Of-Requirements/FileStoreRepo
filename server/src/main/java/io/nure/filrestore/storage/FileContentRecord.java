package io.nure.filrestore.storage;

import io.nure.filestore.storage.Record;


import static com.google.common.base.Preconditions.checkNotNull;
import static java.util.Objects.hash;

/**
 * The {@link Record} that keeps content of the file. A unit of data of the {@link FileContentStorage}.
 */
public final class FileContentRecord implements Record<FileId> {

    /**
     * The identifier of the file.
     */
    private final FileId identifier;

    /**
     * The content of the file as {@link Byte} array.
     */
    private final FileContent content;

    /**
     * Creates instance of FileContentRecord with passed identifier and content.
     *
     * @param identifier the identifier of the file.
     * @param content    the content of the file as {@link Byte} array.
     */
    public FileContentRecord(FileId identifier, FileContent content) {

        this.identifier = checkNotNull(identifier);
        this.content = checkNotNull(content);
    }

    /**
     * Retrieves the identifier of the file.
     *
     * @return the file identifier.
     */
    @Override
    public FileId identifier() {
        return identifier;
    }

    /**
     * Retrieves the content of the file.
     *
     * @return the file content.
     */
    public FileContent content() {
        return content;
    }

    @Override
    public boolean equals(Object o) {

        if (this == o) {
            return true;
        }

        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        FileContentRecord that = (FileContentRecord) o;

        return identifier.equals(that.identifier) &&
            content.equals(that.content);
    }

    @Override
    public int hashCode() {
        return hash(identifier, content);
    }
}
