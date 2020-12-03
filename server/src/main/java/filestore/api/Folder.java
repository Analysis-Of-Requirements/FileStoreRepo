package filestore.api;

import com.google.errorprone.annotations.Immutable;
import io.nure.filestore.storage.FolderId;
import io.nure.filestore.storage.FolderName;
import io.nure.filestore.web.FileHubWebApplication;

import javax.annotation.Nullable;
import java.util.Objects;

import static com.google.common.base.Preconditions.checkNotNull;
import static java.util.Objects.hash;

/**
 * A value object for folder of {@link FileHubWebApplication}.
 */
@Immutable
public final class Folder implements Comparable<Folder> {

    /**
     * An identifier of the folder.
     */
    private final FolderId identifier;

    /**
     * A name of the folder.
     */
    private final FolderName name;

    /**
     * An identifier of the parent of the folder.
     */
    private final FolderId parentId;

    /**
     * Instantiates Folder object with necessary fields and provided parent identifier.
     *
     * @param identifier identifier of the folder.
     * @param name       name of the folder.
     * @param parentId   parent of the folder.
     */
    public Folder(FolderId identifier, FolderName name, @Nullable FolderId parentId) {

        this.identifier = checkNotNull(identifier);
        this.name = checkNotNull(name);
        this.parentId = parentId;
    }

    /**
     * Instantiates Folder object with necessary fields and with null parent identifier.
     *
     * @param identifier identifier of the folder.
     * @param name       name of the folder.
     */
    public Folder(FolderId identifier, FolderName name) {

        this(identifier, name, null);
    }

    /**
     * Getter for the identifier of the folder.
     *
     * @return identifier of the folder.
     */
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
     * Getter for the identifier of parent of the folder.
     *
     * @return identifier of the parent of the folder.
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

        Folder folder = (Folder) o;

        return Objects.equals(identifier, folder.identifier) &&
            Objects.equals(name, folder.name) &&
            Objects.equals(parentId, folder.parentId);
    }

    @Override
    public int hashCode() {
        return hash(identifier, name, parentId);
    }

    @Override
    public String toString() {
        return "Folder{" +
            "identifier=" + identifier +
            ", name=" + name +
            ", parentId=" + parentId +
            '}';
    }

    /**
     * Defines a strategy of comparing instances of the Folder objects.
     *
     * @param o a Folder object to compare.
     * @return a negative integer, zero, or a positive integer as this Folder object is less than, equal to, or greater
     * than the specified Folder object.
     */
    @Override
    public int compareTo(Folder o) {
        return name.compareTo(o.name());
    }
}
