package io.nure.filrestore.api;

import io.nure.filestore.storage.FolderId;
import io.nure.filestore.storage.FolderRecord;
import io.nure.filestore.storage.FolderStorage;
import io.nure.filestore.storage.UserId;
import org.slf4j.Logger;

import static com.google.common.base.Preconditions.checkNotNull;
import static java.lang.String.format;
import static org.slf4j.LoggerFactory.getLogger;

/**
 * A {@link View} of the {@link Folder} retrieved from {@link FolderStorage}.
 */
public class FolderView implements View<Folder, GetFolderQuery> {

    private static final Logger logger = getLogger(FolderView.class);

    /**
     * Storage of folders.
     */
    private final FolderStorage folderStorage;

    /**
     * Instantiates FolderView with storage of folders.
     *
     * @param folderStorage storage of folders.
     */
    public FolderView(FolderStorage folderStorage) {

        this.folderStorage = checkNotNull(folderStorage);

        if (logger.isInfoEnabled()) {
            logger.info("Create view to get folder.");
        }
    }

    /**
     * Handles {@link GetFolderQuery} to retrieve {@link Folder} by {@link FolderId} and {@link UserId}.
     *
     * @param query query to retrieve folder.
     * @return retrieved folder.
     * @throws FolderNotFoundException if the folder was not found in the storage.
     */
    @Override
    public Folder handle(GetFolderQuery query) {

        checkNotNull(query);

        if (logger.isInfoEnabled()) {
            logger.info("Retrieving folder with {} of {}.", query.folderId(), query.ownerId());
        }

        UserId folderOwnerId = query.ownerId();
        FolderId folderId = query.folderId();
        FolderRecord folderRecord = getFolderRecord(folderOwnerId, folderId);

        if (logger.isInfoEnabled()) {
            logger.info("Retrieved folder record: {}.", folderRecord);
        }

        return createFolderFrom(folderRecord);
    }

    /**
     * Retrieves the {@link Folder} record from {@link FolderStorage} by its {@link FolderId} and {@link UserId}.
     *
     * @param ownerId  folder owner identifier.
     * @param folderId queried folder identifier.
     * @return retrieved folder.
     * @throws FolderNotFoundException if the folder was not found in the storage.
     */
    private FolderRecord getFolderRecord(UserId ownerId, FolderId folderId) throws FolderNotFoundException {

        return folderStorage
            .get(folderId, ownerId)
            .orElseThrow(() -> new FolderNotFoundException(format(
                "User with ID \"%s\" does not have a folder with ID \"%s\".",
                folderId.value(),
                ownerId.value()
            )));
    }

    /**
     * Creates {@link Folder} based on {@link FolderRecord}.
     *
     * @param folderRecord base for the folder.
     * @return created folder.
     */
    private Folder createFolderFrom(FolderRecord folderRecord) {

        return new Folder(
            folderRecord.identifier(),
            folderRecord.name(),
            folderRecord.parentId()
        );
    }
}
