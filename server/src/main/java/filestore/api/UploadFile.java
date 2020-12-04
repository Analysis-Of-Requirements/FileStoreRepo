package filestore.api;

import io.nure.filestore.storage.FileName;
import io.nure.filestore.storage.FileSize;
import io.nure.filestore.storage.FolderId;
import io.nure.filestore.storage.UserId;
import io.nure.filestore.web.FileHubWebApplication;
import org.slf4j.Logger;

import static com.google.common.base.Preconditions.checkNotNull;
import static org.slf4j.LoggerFactory.getLogger;

/**
 * The {@link Command} to upload file into {@link FileHubWebApplication}.
 */
public class UploadFile implements Command {

    private static final Logger logger = getLogger(UploadFile.class);

    /**
     * The name of the file.
     */
    private final FileName fileName;

    /**
     * The {@link MimeType} of the file.
     */
    private final MimeType mimeType;

    /**
     * The size of the file in bytes.
     */
    private final FileSize fileSize;

    /**
     * An identifier of the parent {@link Folder} of the file.
     */
    private final FolderId parentFolderId;

    /**
     * The identifier of the owner of the file.
     */
    private final UserId fileOwnerId;

    /**
     * The content of the file to upload.
     */
    private final FileContent fileContent;

    /**
     * Creates instance of the UploadFile command with necessary data.
     *
     * @param fileName       the name of the file.
     * @param mimeType       the {@link MimeType} of the file.
     * @param fileSize       the size of the file in bytes.
     * @param fileOwnerId    the identifier of the owner of the file.
     * @param parentFolderId the identifier of the destination {@link Folder} where the file is intended to be uploaded.
     * @param fileContent    the content of the file.
     */
    public UploadFile(
        FileName fileName,
        MimeType mimeType,
        FileSize fileSize,
        FolderId parentFolderId,
        UserId fileOwnerId,
        FileContent fileContent
    ) {

        this.fileName = checkNotNull(fileName);
        this.mimeType = checkNotNull(mimeType);
        this.fileSize = checkNotNull(fileSize);
        this.fileOwnerId = checkNotNull(fileOwnerId);
        this.parentFolderId = checkNotNull(parentFolderId);
        this.fileContent = checkNotNull(fileContent);

        if (logger.isDebugEnabled()) {
            logger.debug("Created instance of the UploadFile command.");
        }
    }

    /**
     * Retrieves the name of the file.
     *
     * @return the name of the file.
     */
    public FileName fileName() {
        return fileName;
    }

    /**
     * Retrieves the {@link MimeType} of the file.
     *
     * @return the mime-type of the file.
     */
    public MimeType mimeType() {
        return mimeType;
    }

    /**
     * Retrieves the size of the file.
     *
     * @return the size of the file.
     */
    public FileSize fileSize() {
        return fileSize;
    }

    /**
     * Retrieves an identifier of the parent {@link Folder} of the file.
     *
     * @return the identifier of the parent {@link Folder} of the file.
     */
    public FolderId parentFolderId() {
        return parentFolderId;
    }

    /**
     * Retrieves an identifier of the owner of the file.
     *
     * @return the identifier of the owner of the file.
     */
    public UserId fileOwnerId() {
        return fileOwnerId;
    }

    /**
     * Retrieves content of the file.
     *
     * @return the content of the file.
     */
    public FileContent fileContent() {
        return fileContent;
    }

    @Override
    public String toString() {
        return "UploadFile{" +
            "fileName=" + fileName +
            ", mimeType=" + mimeType +
            ", fileSize=" + fileSize +
            ", parentFolderId=" + parentFolderId +
            ", fileOwnerId=" + fileOwnerId +
            ", fileContent=" + fileContent +
            '}';
    }
}
