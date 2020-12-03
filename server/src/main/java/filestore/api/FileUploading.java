package filestore.api;

import io.nure.filestore.storage.FileContentRecord;
import io.nure.filestore.storage.FileContentStorage;
import io.nure.filestore.storage.FileId;
import io.nure.filestore.storage.FileMetadataRecord;
import io.nure.filestore.storage.FileMetadataStorage;
import io.nure.filestore.storage.FolderId;
import io.nure.filestore.storage.FolderRecord;
import io.nure.filestore.storage.FolderStorage;
import io.nure.filestore.storage.UserId;
import io.nure.filestore.web.FileHubWebApplication;
import org.slf4j.Logger;

import static com.google.common.base.Preconditions.checkNotNull;
import static io.nure.filestore.api.IdGenerator.generateId;
import static java.lang.String.format;
import static org.slf4j.LoggerFactory.getLogger;

/**
 * The {@link ApplicationProcess} of uploading file into {@link FileHubWebApplication}.
 *
 * <p>The uploading file is a pair of the {@link FileMetadata} and the {@link FileContent} objects.
 */
public class FileUploading implements ApplicationProcess {

    private static final Logger logger = getLogger(FileUploading.class);

    /**
     * An instance of {@link FolderStorage}.
     */
    private final FolderStorage folderStorage;

    /**
     * An instance of {@link FileMetadataStorage}.
     */
    private final FileMetadataStorage fileMetadataStorage;

    /**
     * An instance of {@link FileContentStorage}.
     */
    private final FileContentStorage fileContentStorage;

    /**
     * Creates instance of FileUploading process with necessary storages.
     *
     * @param folderStorage       an instance of {@link FolderStorage}.
     * @param fileMetadataStorage an instance of {@link FileMetadataStorage}.
     * @param fileContentStorage  an instance of {@link FileContentStorage}.
     */
    public FileUploading(
        FolderStorage folderStorage,
        FileMetadataStorage fileMetadataStorage,
        FileContentStorage fileContentStorage) {

        this.folderStorage = checkNotNull(folderStorage);
        this.fileMetadataStorage = checkNotNull(fileMetadataStorage);
        this.fileContentStorage = checkNotNull(fileContentStorage);

        if (logger.isDebugEnabled()) {
            logger.debug("Created instance of FileUploading process.");
        }
    }

    /**
     * Handles {@link UploadFile} command.
     *
     * @param command the command to upload file.
     * @return the {@link FileMetadata} of uploading file.
     * @throws FolderNotFoundException    in case the destination {@link Folder} of the uploading file is not found.
     * @throws OwnershipViolatedException in case the owner of the uploading file doesn't own the destination
     *                                    {@link Folder}.
     */
    public FileMetadata handle(UploadFile command) {

        checkNotNull(command);

        if (logger.isDebugEnabled()) {
            logger.debug("Handling the UploadFile command: {}", command);
        }

        FolderId destinationFolderId = command.parentFolderId();
        UserId fileOwnerId = command.fileOwnerId();

        FolderRecord destinationFolder = retrieveFolder(destinationFolderId);
        verifyFolderOwner(destinationFolder, fileOwnerId);

        FileContentRecord uploadedFileContent = createFileContent(command);
        saveFileContent(uploadedFileContent);

        FileId uploadedFileId = uploadedFileContent.identifier();
        FileMetadataRecord uploadedFileMetadata = createFileMetadata(uploadedFileId, command);
        saveFileMetadata(uploadedFileMetadata);

        return createFile(uploadedFileMetadata);
    }

    /**
     * Retrieves a {@link FolderRecord} from the {@link FolderStorage}.
     *
     * @param destinationFolderId the {@link FolderId} of the requested {@link FolderRecord}.
     * @return retrieved {@link FolderRecord}.
     * @throws FolderNotFoundException in case the requested {@link FolderRecord} is not found.
     */
    private FolderRecord retrieveFolder(FolderId destinationFolderId) {

        return folderStorage
            .get(destinationFolderId)
            .orElseThrow(() -> new FolderNotFoundException(format(
                "Destination folder was not found by id \"%s\".",
                destinationFolderId.value()
            )));
    }

    /**
     * Verifies that the {@link User} owns {@link FolderRecord}.
     *
     * @param folderToVerify the {@link FolderRecord} to verify.
     * @param maybeOwnerId   the identifier of the {@link User} that may be the owner of the {@link FolderRecord}.
     * @throws OwnershipViolatedException in case the {@link User} doesn't own the {@link FolderRecord}.
     */
    private void verifyFolderOwner(FolderRecord folderToVerify, UserId maybeOwnerId) {

        if (!folderToVerify.ownerId().equals(maybeOwnerId)) {

            throw new OwnershipViolatedException(format(
                "User with id \"%s\" is not the owner of the folder with id \"%s\".",
                maybeOwnerId.value(),
                folderToVerify.identifier().value()
            ));
        }
    }

    /**
     * Creates {@link FileContentRecord} from {@link UploadFile} command.
     *
     * @param command the {@link UploadFile} command that contains uploaded {@link FileContent}.
     * @return created {@link FileContentRecord}.
     */
    private FileContentRecord createFileContent(UploadFile command) {

        FileId identifier = new FileId(generateId());

        return new FileContentRecord(identifier, command.fileContent());
    }

    /**
     * Saves {@link FileContentRecord} in the {@link FileContentStorage}.
     *
     * @param fileContentToSave the file content to save in the storage.
     */
    private void saveFileContent(FileContentRecord fileContentToSave) {

        fileContentStorage.put(fileContentToSave);
    }

    /**
     * Creates {@link FileMetadataRecord} from the provided {@link FileId} and {@link UploadFile} command.
     *
     * @param fileId  the identifier of the file.
     * @param command the {@link UploadFile} command, containing necessary data to create the file metadata.
     * @return the created {@link FileMetadataRecord}.
     */
    private FileMetadataRecord createFileMetadata(FileId fileId, UploadFile command) {

        return new FileMetadataRecord(
            command.fileName(),
            fileId,
            FileTypeCreator.fromMimeType(command.mimeType()),
            command.fileSize(),
            command.parentFolderId(),
            command.fileOwnerId()
        );
    }

    /**
     * Saves {@link FileMetadataRecord} in the {@link FileMetadataStorage}.
     *
     * @param fileMetadataToSave the file metadata to save in the storage.
     */
    private void saveFileMetadata(FileMetadataRecord fileMetadataToSave) {

        fileMetadataStorage.put(fileMetadataToSave);
    }

    /**
     * Creates {@link FileMetadata} based on the passed {@link FileMetadataRecord}.
     *
     * @param record the base  {@link FileMetadataRecord} to create {@link FileMetadata}.
     * @return the created {@link FileMetadata}.
     */
    private FileMetadata createFile(FileMetadataRecord record) {

        return new FileMetadata(record);
    }
}
