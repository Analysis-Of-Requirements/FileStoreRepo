package filestore.api;

import io.nure.filestore.storage.FileId;
import io.nure.filestore.storage.FileName;
import io.nure.filestore.storage.UserId;
import org.slf4j.Logger;

import static com.google.common.base.Preconditions.checkNotNull;
import static org.slf4j.LoggerFactory.getLogger;

/**
 * The {@link Command} to rename a a.
 */
public class RenameFile implements Command {

    private static final Logger logger = getLogger(RenameFile.class);

    /**
     * An identifier of the {@code File}.
     */
    private final FileId fileId;

    /**
     * An identifier of the owner {@link User}.
     */
    private final UserId ownerId;

    private final FileName fileName;

    /**
     * Instantiates RenameFile command with passed identifier of {@code File} and its owner
     * {@link UserId}.
     *
     * @param fileId an identifier of the {@link Folder}
     * @param ownerId        an identifier of the owner {@link User}
     */
    public RenameFile(FileId fileId, UserId ownerId, FileName fileName) {

        this.fileId = checkNotNull(fileId);
        this.ownerId = checkNotNull(ownerId);
        this.fileName = checkNotNull(fileName);

        if (logger.isDebugEnabled()) {
            logger.debug("Created instance of the RenameFile command.");
        }
    }

    /**
     * Retrieves the identifier of the file.
     *
     * @return the identifier of the file.
     */
    public FileId fileId() {
        return fileId;
    }

    /**
     * Retrieves the identifier of the owner of the file.
     *
     * @return the identifier of the owner of the file.
     */
    public UserId ownerId() {
        return ownerId;
    }

    @Override
    public String toString() {
        return "RenameFile{" +
            "fileId=" + fileId +
            ", ownerId=" + ownerId +
                "fileName=" + fileName +
            '}';
    }

    public FileName getFileName() {
        return fileName;
    }
}
