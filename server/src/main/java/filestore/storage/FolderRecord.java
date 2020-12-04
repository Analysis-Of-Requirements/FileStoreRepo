package filestore.storage;

import com.google.errorprone.annotations.Immutable;
import io.nure.filestore.api.Folder;
import io.nure.filestore.web.FileHubWebApplication;

import javax.annotation.Nullable;
import java.util.Objects;

import static com.google.common.base.Preconditions.checkNotNull;
import static java.util.Objects.hash;

/**
 * A unit of data stored in {@link FolderStorage}. Stores data about {@link Folder} of
 * {@link FileHubWebApplication}.
 */
@Immutable
public final class FolderRecord implements Record<FolderId> {

    /**
     * An identifier of the record.
     */
    private final FolderId identifier;

    /**
     * A name of the record.
     */
    private final FolderName name;

    /**
     * An identifier of the parent of the folder.
     */
    private final FolderId parentId;

    /**
     * An identifier of the user who owns the folder.
     */
    private final UserId ownerId;

    /**
     * Instantiates FolderRecord.
     *
     * @param identifier identifier of the record.
     * @param name       name of the record.
     * @param parentId   parent of the folder.
     * @param ownerId    identifier of the owner of the folder.
     */
    public FolderRecord(FolderId identifier, FolderName name, @Nullable FolderId parentId, UserId ownerId) {
        this.identifier = checkNotNull(identifier);
        this.name = checkNotNull(name);
        this.parentId = parentId;
        this.ownerId = checkNotNull(ownerId);
    }

    public static FolderRecord fromDto(Dto dto) {
        return new FolderRecord(new FolderId(dto.identifier), new FolderName(dto.name),
                new FolderId(dto.parentId), new UserId(dto.ownerId));
    }

    /**
     * Getter for the identifier of the folder.
     *
     * @return identifier of the folder.
     */
    @Override
    public FolderId identifier() {
        return identifier;
    }

    /**
     * Getter for the name of the folder.
     *
     * @return name of the folder.
     */
    public FolderName name() {
        return name;
    }

    /**
     * Getter for identifier of the parent of the folder.
     *
     * @return identifier of the parent of the folder.
     */
    public FolderId parentId() {
        return parentId;
    }

    /**
     * Getter for identifier of the owner of the folder.
     *
     * @return identifier of the owner of the folder.
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

        FolderRecord that = (FolderRecord) o;

        return Objects.equals(identifier, that.identifier) &&
            Objects.equals(name, that.name) &&
            Objects.equals(parentId, that.parentId) &&
            Objects.equals(ownerId, that.ownerId);
    }

    @Override
    public int hashCode() {
        return hash(identifier, name, parentId, ownerId);
    }

    public static final class Dto implements RecordDto {
        String name;
        String identifier;
        String parentId;
        String ownerId;
    }
}
