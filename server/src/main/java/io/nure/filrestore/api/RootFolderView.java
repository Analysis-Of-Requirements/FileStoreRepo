package io.nure.filrestore.api;

import io.nure.filestore.storage.FolderRecord;
import io.nure.filestore.storage.FolderStorage;
import io.nure.filestore.storage.UserId;
import io.nure.filestore.storage.UserRecord;
import org.slf4j.Logger;

import static com.google.common.base.Preconditions.checkNotNull;
import static java.lang.String.format;
import static org.slf4j.LoggerFactory.getLogger;

/**
 * A {@link View} of root {@link Folder} of user with {@link UserId}.
 *
 * <p>A root folder is a folder, where all other files and folders of the {@link UserRecord}
 * are stored.
 */
public class RootFolderView implements View<Folder, GetRootFolderQuery> {

    private static final Logger logger = getLogger(RootFolderView.class);

    /**
     * Storage of folders.
     */
    private final FolderStorage folderStorage;

    /**
     * Instantiates RootFolderView with storage of folders.
     *
     * @param folderStorage storage of folders.
     */
    public RootFolderView(FolderStorage folderStorage) {

        this.folderStorage = checkNotNull(folderStorage);

        if (logger.isInfoEnabled()) {
            logger.info("Create view to get root folder.");
        }
    }

    /**
     * Handles {@link GetRootFolderQuery} to get root {@link Folder}.
     *
     * @param query query to retrieve root folder of the user.
     * @return root folder.
     * @throws RootFolderNotFoundException if root folder was not found in the storage.
     */
    @Override
    public Folder handle(GetRootFolderQuery query) {

        if (logger.isInfoEnabled()) {
            logger.info("Retrieving root folder of {}.", query.userId());
        }

        checkNotNull(query);

        UserId rootFolderOwnerId = query.userId();
        FolderRecord rootFolderRecord = getRootFolderRecord(rootFolderOwnerId);

        if (logger.isInfoEnabled()) {
            logger.info("Retrieved root folder record: {}.", rootFolderRecord);
        }

        return createFolderFrom(rootFolderRecord);
    }

    /**
     * Retrieves record of root {@link Folder} from {@link FolderStorage} by {@link UserId} of the owner.
     *
     * @param ownerId identifier of the owner of the root folder.
     * @return retrieved root folder.
     * @throws RootFolderNotFoundException if root folder was not found in the storage.
     */
    private FolderRecord getRootFolderRecord(UserId ownerId) throws RootFolderNotFoundException {

        return folderStorage
            .getRoot(ownerId)
            .orElseThrow(() -> new RootFolderNotFoundException(format(
                "Root folder of user with ID \"%s\" was not found.",
                ownerId.value()
            )));
    }

    /**
     * Creates {@link Folder} based on {@link FolderRecord}.
     *
     * @param rootFolderRecord base for root folder.
     * @return created folder.
     */
    private Folder createFolderFrom(FolderRecord rootFolderRecord) {

        return new Folder(
            rootFolderRecord.identifier(),
            rootFolderRecord.name(),
            rootFolderRecord.parentId()
        );
    }
}
