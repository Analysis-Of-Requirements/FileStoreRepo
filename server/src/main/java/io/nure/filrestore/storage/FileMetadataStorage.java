package io.nure.filrestore.storage;

import io.nure.filestore.storage.FolderId;
import io.nure.filestore.storage.InMemoryStorage;
import java.util.ArrayList;
import java.util.Collection;

import static java.util.stream.Collectors.toCollection;

/**
 * The {@link Storage} of {@link FileMetadataRecord}s. Each record is identified among others by {@link FileId}.
 */
public class FileMetadataStorage extends InMemoryStorage<FileId, FileMetadataRecord> {

    /**
     * Retrieves {@link Collection} of children {@link FileMetadataRecord}s of parent {@link FolderRecord} with
     * {@link FolderId}.
     *
     * @param parentFolderId identifier of parent folder.
     * @return collection of files that have the same parent folder.
     */
    public Collection<FileMetadataRecord> get(FolderId parentFolderId) {

        return getAll()
            .stream()
            .filter(record -> record.parentId().equals(parentFolderId))
            .collect(toCollection(ArrayList::new));
    }
}
