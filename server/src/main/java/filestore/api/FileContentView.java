package filestore.api;

import io.nure.filestore.storage.FileContentStorage;
import io.nure.filestore.storage.FileId;
import io.nure.filestore.storage.FileMetadataStorage;
import io.nure.filestore.storage.UserId;
import org.slf4j.Logger;

import static com.google.common.base.Preconditions.checkNotNull;
import static org.slf4j.LoggerFactory.getLogger;

/**
 * A {@link View} of the {@link FileContent}.
 */
public class FileContentView implements View<FileContent, DownloadFile> {

    private static final Logger logger = getLogger(FileContentView.class);

    /**
     * The storage of file contents.
     */
    private final FileContentStorage fileContentStorage;

    /**
     * The storage of metadata of files.
     */
    private final FileMetadataStorage fileMetadataStorage;

    /**
     * Instantiates FileContentView with necessary storages.
     *
     * @param fileContentStorage  the storage of file contents.
     * @param fileMetadataStorage the storage of metadata of files.
     */
    public FileContentView(FileContentStorage fileContentStorage, FileMetadataStorage fileMetadataStorage) {

        this.fileContentStorage = checkNotNull(fileContentStorage);
        this.fileMetadataStorage = checkNotNull(fileMetadataStorage);

        if (logger.isInfoEnabled()) {
            logger.info("Created view.");
        }
    }

    /**
     * Retrieves {@link FileContent} by {@link FileId} and {@link UserId}.
     *
     * @param query the query to retrieve content of the file.
     * @return retrieved file content.
     * @throws FileNotFoundException if the queried parent file doesn't exist.
     */
    @Override
    public FileContent handle(DownloadFile query) {

        checkNotNull(query);

        if (logger.isInfoEnabled()) {
            logger.info("Retrieving content of file with {} of {}.", query.fileId(), query.fileOwnerId());
        }

        UserId ownerId = query.fileOwnerId();
        FileId fileId = query.fileId();

        if (isFileAbsent(ownerId, fileId)) {

            if (logger.isInfoEnabled()) {
                logger.info("File with {} of {} was not found.", query.fileId(), query.fileOwnerId());
            }

            raiseFileNotFoundError(ownerId, fileId);
        }

        return retrieveFile(fileId);
    }

    /**
     * Verifies if a {@code file} with {@link FileId} doesn't exist in the
     * {@code storages}.
     *
     * @param owner  the file owner
     * @param fileId identifier of the queried file.
     * @return true if the file doesn't exist.
     */
    private boolean isFileAbsent(UserId owner, FileId fileId) {

        return !(fileMetadataStorage.get(fileId).isPresent() &&
                fileMetadataStorage.get(fileId).get().ownerId().equals(owner)) ||
                !fileContentStorage.get(fileId).isPresent();
    }

    /**
     * Raises {@link FileNotFoundException}.
     *
     * @param ownerId owner of the not found file.
     * @param fileId  identifier of not found file.
     * @throws FileNotFoundException to notify caller about not found file.
     */
    private void raiseFileNotFoundError(UserId ownerId, FileId fileId) {

        throw new FileNotFoundException(format(
                "File with ID \"%s\" of the owner with ID \"%s\" was not found.",
                fileId.value(),
                ownerId.value()
        ));
    }

    /**
     * Retrieves file content.
     *
     * @param file the identifier of the file
     * @return retrieved file
     */
    private FileContent retrieveFile(FileId file) {
        return fileContentStorage
                .get(file)
                .get()
                .content();
    }
}
