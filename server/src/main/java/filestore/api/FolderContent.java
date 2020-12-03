package filestore.api;

import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.Set;

import static com.google.common.base.Preconditions.checkNotNull;
import static java.util.Collections.synchronizedSet;
import static java.util.stream.Collectors.toCollection;

/**
 * A holder of the content of the {@link Folder}. The content of the folder is a {@link Set} of children {@link Folder}s
 * and a {@link Set} of children {@link FileMetadata} objects of that folder.
 */
public final class FolderContent {

    /**
     * A set of children folders.
     */
    private final Set<Folder> folders;

    /**
     * A set of children files.
     */
    private final Set<FileMetadata> fileMetaData;

    /**
     * Instantiates FolderContent.
     *
     * @param folders      the set of children folders.
     * @param fileMetaData the set of children files.
     */
    public FolderContent(Collection<Folder> folders, Collection<FileMetadata> fileMetaData) {

        this.folders = synchronizedSet(sortFoldersByName(checkNotNull(folders)));
        this.fileMetaData = synchronizedSet(sortFilesByName(checkNotNull(fileMetaData)));
    }

    /**
     * Getter for the set of children folders.
     *
     * @return the set of children folders.
     */
    public Set<Folder> folders() {
        return folders;
    }

    /**
     * Getter for the set of children files.
     *
     * @return the set of children files.
     */
    public Set<FileMetadata> files() {
        return fileMetaData;
    }

    /**
     * Sorts {@link Collection} of {@link Folder}s by name.
     *
     * @param folders the collection to sort.
     * @return sorted set of folders.
     */
    private Set<Folder> sortFoldersByName(Collection<Folder> folders) {

        return folders
            .stream()
            .sorted()
            .collect(toCollection(LinkedHashSet::new));
    }

    /**
     * Sorts {@link Collection} of {@link FileMetadata} objects by name.
     *
     * @param files the collection to sort.
     * @return sorted set of files.
     */
    private Set<FileMetadata> sortFilesByName(Collection<FileMetadata> files) {

        return files
            .stream()
            .sorted()
            .collect(toCollection(LinkedHashSet::new));
    }

    @Override
    public String toString() {
        return "FolderContent{" +
            "folders=" + folders +
            ", files=" + fileMetaData +
            '}';
    }
}
