package io.nure.filestore.storage;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Optional;

import static java.util.stream.Collectors.toCollection;

/**
 * A {@link Storage} of {@link FolderRecord}s. Each record is identified among others by {@link FolderId}.
 */
public class FolderStorage extends InMemoryStorage<FolderId, FolderRecord> {

    /**
     * Retrieves root {@link FolderRecord} of the user with {@link UserId}.
     *
     * @param userId owner of the root folder.
     * @return root {@link FolderRecord} wrapped in {@link Optional} or {@link Optional#empty()} if the user doesn't
     * have a root folder.
     */
    public Optional<FolderRecord> getRoot(UserId userId) {

        return getAll()
            .stream()
            .filter(record -> record.ownerId().equals(userId) && record.parentId() == null)
            .findFirst();
    }

    /**
     * Retrieves children {@link FolderRecord}s of the folder with {@link FolderId}.
     *
     * @param rootFolderId identifier of the parent folder record.
     * @return children of the parent folder.
     */
    public Collection<FolderRecord> getChildren(FolderId rootFolderId) {

        return getAll()
            .stream()
            .filter(record -> record.parentId() != null && record.parentId().equals(rootFolderId))
            .collect(toCollection(ArrayList::new));
    }

    /**
     * Retrieves {@link FolderRecord} by {@link FolderId} and owner {@link UserId}.
     *
     * @param folderId identifier of the folder.
     * @param ownerId  identifier of the owner of the folder.
     * @return {@link FolderRecord} wrapped in {@link Optional} or {@link Optional#empty()} if the folder was not found.
     */
    public Optional<FolderRecord> get(FolderId folderId, UserId ownerId) {

        return getAll()
            .stream()
            .filter(record -> record.identifier().equals(folderId) && record.ownerId().equals(ownerId))
            .findFirst();
    }
}
