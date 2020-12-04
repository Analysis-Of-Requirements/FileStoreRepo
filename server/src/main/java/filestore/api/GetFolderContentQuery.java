package filestore.api;

import io.nure.filestore.storage.FolderId;
import io.nure.filestore.storage.UserId;
import org.slf4j.Logger;

import static com.google.common.base.Preconditions.checkNotNull;
import static org.slf4j.LoggerFactory.getLogger;

/**
 * A {@link Query} to get {@link FolderContent} of the {@link Folder} with {@link FolderId} that is owned by the user
 * with {@link UserId}.
 */
public class GetFolderContentQuery implements Query {

    private static final Logger logger = getLogger(GetFolderContentQuery.class);

    /**
     * An identifier of the user, that owns queried parent {@link Folder}.
     */
    private final UserId ownerId;

    /**
     * An identifier of queried parent {@link Folder}.
     */
    private final FolderId folderId;

    /**
     * Instantiates GetFolderContentQuery.
     *
     * @param ownerId  identifier of the user, that owns queried parent folder.
     * @param folderId identifier of the queried parent folder.
     */
    public GetFolderContentQuery(UserId ownerId, FolderId folderId) {

        this.ownerId = checkNotNull(ownerId);
        this.folderId = checkNotNull(folderId);

        if (logger.isInfoEnabled()) {
            logger.info("Created query to get content of the folder by {} and {}.", ownerId, folderId);
        }
    }

    /**
     * Getter for the identifier of the owner of the parent {@link Folder}.
     *
     * @return the value of owner identifier.
     */
    public UserId ownerId() {
        return ownerId;
    }

    /**
     * Getter for the identifier of the queried parent {@link Folder}.
     *
     * @return identifier of the parent folder.
     */
    public FolderId folderId() {
        return folderId;
    }
}
