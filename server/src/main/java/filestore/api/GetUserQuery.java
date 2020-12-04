package filestore.api;

import io.nure.filestore.storage.UserId;
import org.slf4j.Logger;

import static com.google.common.base.Preconditions.checkNotNull;
import static org.slf4j.LoggerFactory.getLogger;

/**
 * The {@link Query} to retrieve {@link User}.
 */
public class GetUserQuery implements Query {

    private static final Logger logger = getLogger(GetUserQuery.class);

    /**
     * An identifier of the queried user.
     */
    private final UserId identifier;

    /**
     * Instantiates GetUserQuery with identifier of the queried user.
     *
     * @param identifier the identifier of the queried user.
     */
    public GetUserQuery(UserId identifier) {

        this.identifier = checkNotNull(identifier);

        if (logger.isInfoEnabled()) {
            logger.info("Created query to get user by id: {}.", identifier.value());
        }
    }

    /**
     * Getter for the user identifier.
     *
     * @return the identifier of queried user.
     */
    public UserId identifier() {
        return identifier;
    }
}
