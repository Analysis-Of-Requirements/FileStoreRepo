package filestore.api;

import io.nure.filestore.storage.FileId;
import io.nure.filestore.storage.UserId;
import io.nure.filestore.web.FileHubWebApplication;
import org.slf4j.Logger;

import static com.google.common.base.Preconditions.checkNotNull;
import static org.slf4j.LoggerFactory.getLogger;

/**
 * The {@link Query} to download file from the {@link FileHubWebApplication}.
 */
public class DownloadFile implements Query {

    private static final Logger logger = getLogger(DownloadFile.class);

    /**
     * The file identifier.
     */
    private final FileId fileId;

    /**
     * The identifier of the owner of the file.
     */
    private final UserId fileOwnerId;

    /**
     * Creates instance of the Download file command with the necessary data.
     *
     * @param fileId       the file id
     * @param fileOwnerId    the identifier of the owner of the file.
     */
    public DownloadFile(FileId fileId, UserId fileOwnerId) {
        this.fileId = checkNotNull(fileId);
        this.fileOwnerId = checkNotNull(fileOwnerId);

        if (logger.isDebugEnabled()) {
            logger.debug("Created instance of the UploadFile command.");
        }
    }

    /**
     * Retrieves the id of the file.
     *
     * @return the id of the file.
     */
    public FileId fileId() {
        return fileId;
    }

    /**
     * Retrieves an identifier of the owner of the file.
     *
     * @return the identifier of the owner of the file.
     */
    public UserId fileOwnerId() {
        return fileOwnerId;
    }

    @Override
    public String toString() {
        return "DownloadFile{" +
            "fileId=" + fileId +
            ", fileOwnerId=" + fileOwnerId +
            '}';
    }
}
