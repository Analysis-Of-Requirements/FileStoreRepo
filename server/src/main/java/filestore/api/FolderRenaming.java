package filestore.api;

import io.nure.filestore.storage.FolderId;
import io.nure.filestore.storage.FolderName;
import io.nure.filestore.storage.FolderRecord;
import io.nure.filestore.storage.FolderStorage;
import io.nure.filestore.storage.UserId;
import org.slf4j.Logger;

import static com.google.common.base.Preconditions.checkNotNull;
import static org.slf4j.LoggerFactory.getLogger;

/**
 * The {@link ApplicationProcess} of renaming a folder.
 */
public class FolderRenaming implements ApplicationProcess {

    private static final Logger logger = getLogger(FolderRenaming.class);

    /**
     * A storage of all {@link Folder}s.
     */
    private final FolderStorage folderStorage;

    /**
     * Instantiates FolderRenaming process with provided storage of folders.
     *
     * @param folderStorage the storage of all folders.
     */
    public FolderRenaming(FolderStorage folderStorage) {

        this.folderStorage = checkNotNull(folderStorage);

        if (logger.isDebugEnabled()) {
            logger.debug("Created instance of the FolderRenaming process.");
        }
    }

    /**
     * Handles a {@link RenameFolder} command to rename a folder.
     *
     * @param command the command to rename a folder.
     * @return the instance of the renamed folder.
     * @throws FolderNotFoundException    in case the {@link Folder} was not found by {@link FolderId}
     *                                    and its owner {@link UserId}.
     * @throws OwnershipViolatedException in case the {@link User} doesn't own the {@link Folder}.
     */
    public void handle(RenameFolder command) {

        checkNotNull(command);

        if (logger.isInfoEnabled()) {
            logger.info("Handling the command: {}.", command);
        }

        FolderId folderId = command.folderId();
        UserId ownerId = command.ownerId();

        FolderRecord folder = retrieveFolder(folderId);
        assertFolderOwner(folder, ownerId);

        if (logger.isInfoEnabled()) {
            logger.info("Retrieved folder with id \"{}\".", folderId);
        }

        FolderRecord newFolder = renameFolder(folder, command.getFolderName());
        removeFolder(folderId);
        saveFolder(newFolder);
    }

    private void removeFolder(FolderId folderId) {
        folderStorage.delete(folderId);
    }

    /**
     * Retrieves {@link FolderRecord} from {@link FolderStorage} by provided {@link FolderId}.
     *
     * @param identifier the identifier of the folder to get.
     * @return retrieved {@link FolderRecord}.
     * @throws FolderNotFoundException if the folder doesn't exist in the storage.
     */
    private FolderRecord retrieveFolder(FolderId identifier) {

        return folderStorage
            .get(identifier)
            .orElseThrow(() -> new FolderNotFoundException(format(
                "A folder with id \"%s\" doesn't exist.",
                identifier.value()
            )));
    }

    /**
     * Verifies that the {@link User} with provided {@link UserId} owns {@link FolderRecord}.
     *
     * @param folderToVerify   the folder to verify.
     * @param mayBeFolderOwner possible owner of the folder.
     * @throws OwnershipViolatedException in case {@link User} doesn't own the {@link FolderRecord}.
     */
    private void assertFolderOwner(FolderRecord folderToVerify, UserId mayBeFolderOwner) {

        if (!folderToVerify.ownerId().equals(mayBeFolderOwner)) {

            throw new OwnershipViolatedException(format(
                "User with id \"%s\" is not owner of the folder with id \"%s\".",
                mayBeFolderOwner.value(),
                folderToVerify.identifier().value()
            ));
        }
    }

    /**
     * Creates new {@link FolderRecord}.
     *
     * @param base the base folder.
     * @param name  new name
     * @return created folder.
     */
    private FolderRecord renameFolder(FolderRecord base, FolderName name) {

        return new FolderRecord(
            base.identifier(),
            name,
            base.parentId(),
            base.ownerId()
        );
    }

    /**
     * Saves {@link FolderRecord} in the {@link FolderStorage}.
     *
     * @param folderToSave the folder to save in the storage.
     */
    private void saveFolder(FolderRecord folderToSave) {
        folderStorage.put(folderToSave);
    }
}
