package io.nure.filrestore.api;

import io.nure.filestore.storage.UserId;
import org.slf4j.Logger;

import static com.google.common.base.Preconditions.checkNotNull;
import static org.slf4j.LoggerFactory.getLogger;

/**
 * A {@link Query} to retrieve root {@link Folder} of the user with {@link UserId}.
 */
public class GetRootFolderQuery implements Query {

    private static final Logger logger = getLogger(GetRootFolderQuery.class);

    /**
     * Identifier of the user, that owns queried root folder.
     */
    private final UserId userId;

    /**
     * Instantiates GetRootFolderQuery with identifier of the user.
     *
     * @param userId identifier of the user, that owns requested root folder.
     */
    public GetRootFolderQuery(UserId userId) {

        this.userId = checkNotNull(userId);

        if (logger.isInfoEnabled()) {
            logger.info("Created query to get root folder of {}", userId);
        }
    }

    /**
     * Getter for user identifier.
     *
     * @return value of user identifier.
     */
    public UserId userId() {
        return userId;
    }
}
