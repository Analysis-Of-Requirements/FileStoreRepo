package filestore.api;

import io.nure.filestore.storage.FolderId;
import io.nure.filestore.storage.UserId;
import org.slf4j.Logger;

import static com.google.common.base.Preconditions.checkNotNull;
import static org.slf4j.LoggerFactory.getLogger;

/**
 * The {@link Query} for getting {@link Folder}.
 */
public class GetFolderQuery implements Query {

    private static final Logger logger = getLogger(GetFolderQuery.class);

    /**
     * An identifier of the user, that owns queried {@link Folder}.
     */
    private final UserId ownerId;

    /**
     * An identifier of queried {@link Folder}.
     */
    private final FolderId folderId;

    /**
     * Instantiates GetFolderQuery.
     *
     * @param ownerId  identifier of the user, that owns queried folder.
     * @param folderId identifier of the queried folder.
     */
    public GetFolderQuery(UserId ownerId, FolderId folderId) {

        this.ownerId = checkNotNull(ownerId);
        this.folderId = checkNotNull(folderId);

        if (logger.isInfoEnabled()) {
            logger.info("Created query to get folder by {} and {}.", ownerId, folderId);
        }
    }

    /**
     * Getter for the {@link Folder} owner identifier.
     *
     * @return user identifier.
     */
    public UserId ownerId() {
        return ownerId;
    }

    /**
     * Getter for the queried {@link Folder} identifier.
     *
     * @return folder identifier.
     */
    public FolderId folderId() {
        return folderId;
    }
}
