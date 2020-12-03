package filestore.storage;

import com.google.errorprone.annotations.Immutable;
import io.nure.filestore.web.FileHubWebApplication;

import java.util.Objects;

import static com.google.common.base.Preconditions.checkNotNull;
import static java.util.Objects.hash;

/**
 * The {@link Record} that keeps data about file of {@link FileHubWebApplication}. A unit of
 * data of {@link FileMetadataStorage}.
 */
@Immutable
public final class FileMetadataRecord implements Record<FileId> {

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
     * The identifier of the user who owns the file.
     */
    private final UserId ownerId;

    /**
     * Instantiates FileMetadataRecord with necessary data.
     *
     * @param name       the name of the file.
     * @param identifier the identifier of the file.
     * @param fileType   the type of the file.
     * @param size       the value of size of he file.
     * @param parentId   the value of parent folder.
     * @param ownerId    the value of the owner of the file.
     */
    public FileMetadataRecord(
        FileName name,
        FileId identifier,
        FileType fileType,
        FileSize size,
        FolderId parentId,
        UserId ownerId
    ) {

        this.name = checkNotNull(name);
        this.identifier = checkNotNull(identifier);
        this.fileType = checkNotNull(fileType);
        this.size = checkNotNull(size);
        this.parentId = checkNotNull(parentId);
        this.ownerId = checkNotNull(ownerId);
    }

    public static FileMetadataRecord fromDto(Dto dto) {
        return new FileMetadataRecord(new FileName(dto.name), new FileId(dto.identifier),
                new FileType(dto.fileType), new FileSize(dto.size),
                new FolderId(dto.parentId), new UserId(dto.ownerId));
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
    @Override
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

    /**
     * Getter for the identifier of the owner of the file.
     *
     * @return the identifier of the owner of the file.
     */
    public UserId ownerId() {
        return ownerId;
    }

    @Override
    public boolean equals(Object o) {

        if (this == o) {
            return true;
        }

        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        FileMetadataRecord record = (FileMetadataRecord) o;

        return Objects.equals(name, record.name) &&
            Objects.equals(identifier, record.identifier) &&
            fileType == record.fileType &&
            Objects.equals(size, record.size) &&
            Objects.equals(parentId, record.parentId) &&
            Objects.equals(ownerId, record.ownerId);
    }

    @Override
    public int hashCode() {
        return hash(name, identifier, fileType, size, parentId, ownerId);
    }

    public static final class Dto implements RecordDto {
        String name;
        String identifier;
        String fileType;
        String size;
        String parentId;
        String ownerId;
    }
}
