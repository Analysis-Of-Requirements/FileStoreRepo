package filestore.api;

import io.nure.filestore.storage.FolderId;
import io.nure.filestore.storage.UserId;
import org.slf4j.Logger;

import static com.google.common.base.Preconditions.checkNotNull;
import static org.slf4j.LoggerFactory.getLogger;

/**
 * The {@link Command} to create a folder inside the {@link Folder} with given {@link FolderId}.
 */
public class CreateFolder implements Command {

    private static final Logger logger = getLogger(CreateFolder.class);

    /**
     * An identifier of the parent {@link Folder}.
     *
     * <p>The parent {@link Folder} is the destination folder where new folder is intended to be created.
     */
    private final FolderId parentFolderId;

    /**
     * An identifier of the owner {@link User} of the parent {@link Folder}.
     *
     * <p>Needed to prove that the {@link User} is the owner of that {@link Folder}.
     */
    private final UserId ownerId;

    /**
     * Instantiates CreateFolder command with passed identifier of parent {@link Folder} and its owner
     * {@link UserId}.
     *
     * @param parentFolderId an identifier of the {@link Folder} where new folder is intended to be created.
     * @param ownerId        an identifier of the owner {@link User} of the parent {@link Folder}.
     */
    public CreateFolder(FolderId parentFolderId, UserId ownerId) {

        this.parentFolderId = checkNotNull(parentFolderId);
        this.ownerId = checkNotNull(ownerId);

        if (logger.isDebugEnabled()) {
            logger.debug("Created instance of the CreateFolder command.");
        }
    }

    /**
     * Retrieves the identifier of the parent folder.
     *
     * @return the identifier of the parent folder.
     */
    public FolderId parentFolderId() {
        return parentFolderId;
    }

    /**
     * Retrieves the identifier of the owner of the parent folder.
     *
     * @return the identifier of the owner of the parent folder.
     */
    public UserId ownerId() {
        return ownerId;
    }

    @Override
    public String toString() {
        return "CreateFolder{" +
            "parentFolderId=" + parentFolderId +
            ", ownerId=" + ownerId +
            '}';
    }
}
