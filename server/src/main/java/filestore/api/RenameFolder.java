package filestore.api;

import io.nure.filestore.storage.FolderId;
import io.nure.filestore.storage.FolderName;
import io.nure.filestore.storage.UserId;
import org.slf4j.Logger;

import static com.google.common.base.Preconditions.checkNotNull;
import static org.slf4j.LoggerFactory.getLogger;

/**
 * The {@link Command} to rename a folder.
 */
public class RenameFolder implements Command {

    private static final Logger logger = getLogger(RenameFolder.class);

    /**
     * An identifier of the {@link Folder}.
     */
    private final FolderId folderId;

    /**
     * An identifier of the owner {@link User}.
     */
    private final UserId ownerId;

    private final FolderName folderName;

    /**
     * Instantiates RenameFolder command with passed identifier of {@link Folder} and its owner
     * {@link UserId}.
     *
     * @param folderId an identifier of the {@link Folder}
     * @param ownerId        an identifier of the owner {@link User}
     */
    public RenameFolder(FolderId folderId, UserId ownerId, FolderName folderName) {

        this.folderId = checkNotNull(folderId);
        this.ownerId = checkNotNull(ownerId);
        this.folderName = checkNotNull(folderName);

        if (logger.isDebugEnabled()) {
            logger.debug("Created instance of the RenameFolder command.");
        }
    }

    /**
     * Retrieves the identifier of the folder.
     *
     * @return the identifier of the folder.
     */
    public FolderId folderId() {
        return folderId;
    }

    /**
     * Retrieves the identifier of the owner of the folder.
     *
     * @return the identifier of the owner of the folder.
     */
    public UserId ownerId() {
        return ownerId;
    }

    @Override
    public String toString() {
        return "RenameFolder{" +
            "folderId=" + folderId +
            ", ownerId=" + ownerId +
            '}';
    }

    public FolderName getFolderName() {
        return folderName;
    }
}
