package filestore.api;

import com.google.errorprone.annotations.Immutable;
import io.nure.filestore.storage.FileId;
import io.nure.filestore.storage.FileMetadataRecord;
import io.nure.filestore.storage.FileName;
import io.nure.filestore.storage.FileSize;
import io.nure.filestore.storage.FileType;
import io.nure.filestore.storage.FolderId;
import io.nure.filestore.web.FileHubWebApplication;

import java.util.Objects;

import static com.google.common.base.Preconditions.checkNotNull;
import static java.util.Objects.hash;

/**
 * The value object for the meta data of the file of {@link FileHubWebApplication}.
 */
@Immutable
public final class FileMetadata implements Comparable<FileMetadata> {

    /**
     * The name of the file.
     */
    private final FileName name;

    /**
     * The identifier of the file.
     */
    private final FileId identifier;

    /**
     * The type of the file.
     */
    private final FileType fileType;

    /**
     * The size of the file.
     */
    private final FileSize size;

    /**
     * The identifier of the parent folder of the file.
     */
    private final FolderId parentId;

    /**
     * Instantiates FileMetadata with necessary fields.
     *
     * @param name       the name of the file.
     * @param identifier the identifier of the file.
     * @param fileType   the type of the file.
     * @param size       the size of the file.
     * @param parentId   the identifier of the parent folder.
     */
    public FileMetadata(FileName name, FileId identifier, FileType fileType, FileSize size, FolderId parentId) {

        this.identifier = checkNotNull(identifier);
        this.name = checkNotNull(name);
        this.fileType = checkNotNull(fileType);
        this.size = checkNotNull(size);
        this.parentId = checkNotNull(parentId);
    }

    /**
     * Creates instance of FileMetadata based on the provided {@link FileMetadataRecord}.
     *
     * @param record the base {@link FileMetadataRecord} to create FileMetadata.
     */
    public FileMetadata(FileMetadataRecord record) {

        this(checkNotNull(record).name(), record.identifier(), record.fileType(), record.size(), record.parentId());
    }

    /**
     * Getter for the name of the file.
     *
     * @return the name of the file.
     */
    public FileName name() {
        return name;
    }

    /**
     * Getter for the identifier of the file.
     *
     * @return the identifier of the file.
     */
    public FileId identifier() {
        return identifier;
    }

    /**
     * Getter for the type of the file.
     *
     * @return the type of the file.
     */
    public FileType fileType() {
        return fileType;
    }

    /**
     * Getter for the size of the file.
     *
     * @return the size of the file.
     */
    public FileSize size() {
        return size;
    }

    /**
     * Getter for the identifier of the parent folder of the file.
     *
     * @return the identifier of the parent folder of the file.
     */
    public FolderId parentId() {
        return parentId;
    }

    @Override
    public boolean equals(Object o) {

        if (this == o) {
            return true;
        }

        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        FileMetadata fileMetaData = (FileMetadata) o;

        return Objects.equals(name, fileMetaData.name) &&
            Objects.equals(identifier, fileMetaData.identifier) &&
            fileType == fileMetaData.fileType &&
            Objects.equals(size, fileMetaData.size) &&
            Objects.equals(parentId, fileMetaData.parentId);
    }

    @Override
    public int hashCode() {
        return hash(name, identifier, fileType, size, parentId);
    }

    @Override
    public String toString() {
        return "File{" +
            "name=" + name +
            ", identifier=" + identifier +
            ", fileType=" + fileType +
            ", size=" + size +
            ", parentId=" + parentId +
            '}';
    }

    /**
     * Defines a strategy of comparing instances of the FileMetadata objects.
     *
     * @param o a FileMetadata object to compare.
     * @return a negative integer, zero, or a positive integer as this FileMetadata object is less than, equal to, or
     * greater than the specified FileMetadata object.
     */
    @Override
    public int compareTo(FileMetadata o) {
        return name.compareTo(o.name());
    }
}
