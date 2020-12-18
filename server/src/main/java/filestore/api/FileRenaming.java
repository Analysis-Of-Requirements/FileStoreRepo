package filestore.api;

import io.nure.filestore.storage.FileId;
import io.nure.filestore.storage.FileMetadataRecord;
import io.nure.filestore.storage.FileMetadataStorage;
import io.nure.filestore.storage.FileName;
import io.nure.filestore.storage.UserId;
import org.slf4j.Logger;

import static com.google.common.base.Preconditions.checkNotNull;
import static org.slf4j.LoggerFactory.getLogger;

/**
 * The {@link ApplicationProcess} of renaming a file.
 */
public class FileRenaming implements ApplicationProcess {

    private static final Logger logger = getLogger(FileRenaming.class);

    /**
     * A storage of all {@code file}s.
     */
    private final FileMetadataStorage fileMetadataStorage;

    /**
     * Instantiates FileRenaming process with provided storage of files.
     *
     * @param fileMetadataStorage the storage of all files.
     */
    public FileRenaming(FileMetadataStorage fileMetadataStorage) {

        this.fileMetadataStorage = checkNotNull(fileMetadataStorage);

        if (logger.isDebugEnabled()) {
            logger.debug("Created instance of the FileRenaming process.");
        }
    }

    /**
     * Handles a {@link RenameFile} command to rename a folder.
     *
     * @param command the command to rename a file.
     * @return the instance of the renamed file.
     * @throws FileNotFoundException    in case the {@code File} was not found
     * @throws OwnershipViolatedException in case the {@link User} doesn't own the {@code File}.
     */
    public void handle(RenameFile command) {

        checkNotNull(command);

        if (logger.isInfoEnabled()) {
            logger.info("Handling the command: {}.", command);
        }

        FileId fileId = command.fileId();
        UserId ownerId = command.ownerId();

        FileMetadataRecord file = retrieveFile(fileId);
        assertFileOwner(file, ownerId);

        if (logger.isInfoEnabled()) {
            logger.info("Retrieved file with id \"{}\".", fileId);
        }

        FileMetadataRecord newFile = renameFile(file, command.getFileName());
        removeFile(fileId);
        saveFile(newFile);
    }

    private void removeFile(FileId file) {
        fileMetadataStorage.delete(file);
    }

    /**
     * Retrieves {@link FileMetadataRecord} from {@link FileMetadataStorage} by provided {@link FileId}.
     *
     * @param identifier the identifier of the file to get.
     * @return retrieved {@link FileMetadataRecord}.
     * @throws FileNotFoundException if the file doesn't exist in the storage.
     */
    private FileMetadataRecord retrieveFile(FileId identifier) {

        return fileMetadataStorage
            .get(identifier)
            .orElseThrow(() -> new FileNotFoundException(format(
                "A file with id \"%s\" doesn't exist.",
                identifier.value()
            )));
    }

    /**
     * Verifies that the {@link User} with provided {@link UserId} owns {@link FileMetadataRecord}.
     *
     * @param file   the file to verify.
     * @param user possible owner of the folder.
     * @throws OwnershipViolatedException in case {@link User} doesn't own the {@link FileMetadataRecord}.
     */
    private void assertFileOwner(FileMetadataRecord file, UserId user) {

        if (!file.ownerId().equals(user)) {

            throw new OwnershipViolatedException(format(
                "User with id \"%s\" is not owner of the file with id \"%s\".",
                user.value(),
                file.identifier().value()
            ));
        }
    }

    /**
     * Creates new {@link FileMetadataRecord}.
     *
     * @param base the base file.
     * @param name  new name
     * @return created folder.
     */
    private FileMetadataRecord renameFile(FileMetadataRecord base, FileName name) {

        return new FileMetadataRecord(
                name,
            base.identifier(),
            base.fileType(),
            base.size(),
            base.parentId(),
                base.ownerId()
        );
    }

    /**
     * Saves {@link FileMetadataRecord} in the {@link FileMetadataStorage}.
     *
     * @param file the file to save in the storage.
     */
    private void saveFile(FileMetadataRecord file) {
        fileMetadataStorage.put(file);
    }
}
