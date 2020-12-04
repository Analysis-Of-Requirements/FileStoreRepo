package filestore.api;

import io.nure.filestore.storage.FolderId;
import io.nure.filestore.storage.FolderName;
import io.nure.filestore.storage.FolderRecord;
import io.nure.filestore.storage.FolderStorage;
import io.nure.filestore.storage.UserId;
import org.slf4j.Logger;

import static com.google.common.base.Preconditions.checkNotNull;
import static io.nure.filestore.api.IdGenerator.generateId;
import static java.lang.String.format;
import static org.slf4j.LoggerFactory.getLogger;

/**
 * The {@link ApplicationProcess} of creating a new folder.
 */
public class FolderCreating implements ApplicationProcess {

    private static final Logger logger = getLogger(FolderCreating.class);

    /**
     * A storage of all {@link Folder}s.
     */
    private final FolderStorage folderStorage;

    /**
     * Instantiates FolderCreating process with provided storage of folders.
     *
     * @param folderStorage the storage of all folders.
     */
    public FolderCreating(FolderStorage folderStorage) {

        this.folderStorage = checkNotNull(folderStorage);

        if (logger.isDebugEnabled()) {
            logger.debug("Created instance of the FolderCreating process.");
        }
    }

    /**
     * Handles a {@link CreateFolder} command to create new folder inside the given parent folder.
     *
     * @param command the command to create a folder.
     * @return the instance of created folder.
     * @throws FolderNotFoundException    in case the parent {@link Folder} was not found by {@link FolderId} and its owner
     *                                    {@link UserId}.
     * @throws OwnershipViolatedException in case the {@link User} doesn't own the parent {@link Folder}.
     */
    public Folder handle(CreateFolder command) {

        checkNotNull(command);

        if (logger.isInfoEnabled()) {
            logger.info("Handling the command: {}.", command);
        }

        FolderId parentFolderId = command.parentFolderId();
        UserId parentFolderOwnerId = command.ownerId();

        FolderRecord parentFolder = retrieveFolder(parentFolderId);

        assertFolderOwner(parentFolder, parentFolderOwnerId);

        if (logger.isInfoEnabled()) {
            logger.info("Retrieved parent folder with id \"{}\".", parentFolderId);
        }

        FolderRecord newFolder = createFolder(parentFolderId, parentFolderOwnerId);
        saveFolder(newFolder);

        return createDto(newFolder);
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
     * Creates new {@link FolderRecord} with provided identifiers of parent {@link Folder} and owner {@link User}.
     *
     * @param parentFolderId the identifier of the parent folder.
     * @param folderOwnerId  the identifier of the owner of the parent folder.
     * @return created folder.
     */
    private FolderRecord createFolder(FolderId parentFolderId, UserId folderOwnerId) {

        return new FolderRecord(
            generateFolderId(),
            generateFolderName(parentFolderId, folderOwnerId),
            parentFolderId,
            folderOwnerId
        );
    }

    /**
     * Generates an identifier for the folder.
     *
     * @return the created identifier of the folder.
     */
    private FolderId generateFolderId() {

        return new FolderId(generateId());
    }

    /**
     * Generates a new folder name.
     *
     * <p>Creates folder name: 'New Folder (N)', where N is the number of user folders, names of which begin with
     * 'New Folder'. For example: 'New Folder (2)'.
     *
     * @param parentFolderId the identifier of the parent folder.
     * @param foldersOwnerId the identifier of the owner of new folder.
     * @return the created name of the folder.
     */
    private FolderName generateFolderName(FolderId parentFolderId, UserId foldersOwnerId) {

        long foldersCount = folderStorage
            .getAll()
            .stream()
            .filter((folder) -> folder.ownerId().equals(foldersOwnerId)
                && folder.parentId() != null
                && folder.parentId().equals(parentFolderId)
                && folder.name().value().startsWith("New Folder")
            )
            .count();

        String folderNamePostfix = foldersCount == 0 ? "" : format(" (%d)", foldersCount);

        return new FolderName(format("New Folder%s", folderNamePostfix));
    }

    /**
     * Saves {@link FolderRecord} in the {@link FolderStorage}.
     *
     * @param folderToSave the folder to save in the storage.
     */
    private void saveFolder(FolderRecord folderToSave) {

        folderStorage.put(folderToSave);
    }

    /**
     * Creates {@link Folder} dto from the base {@link FolderRecord}.
     *
     * @param folderBase the base for the {@link Folder}.
     * @return the created {@link Folder}.
     */
    private Folder createDto(FolderRecord folderBase) {

        return new Folder(
            folderBase.identifier(),
            folderBase.name(),
            folderBase.parentId()
        );
    }
}
