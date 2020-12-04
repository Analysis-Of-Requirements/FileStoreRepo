package filestore.api;

import io.nure.filestore.storage.UserId;
import io.nure.filestore.storage.UserRecord;
import io.nure.filestore.storage.UserStorage;
import org.slf4j.Logger;

import java.util.Optional;

import static com.google.common.base.Preconditions.checkNotNull;
import static java.lang.String.format;
import static org.slf4j.LoggerFactory.getLogger;

/**
 * The {@link View} of {@link User}.
 */
public class UserView implements View<User, GetUserQuery> {

    private static final Logger logger = getLogger(UserView.class);

    /**
     * The storage of registered users.
     */
    private final UserStorage registeredUsers;

    /**
     * Instantiates UserView with provided user storage.
     *
     * @param registeredUsers the storage of registered users.
     */
    public UserView(UserStorage registeredUsers) {

        this.registeredUsers = checkNotNull(registeredUsers);

        if (logger.isDebugEnabled()) {
            logger.debug("Created view of user.");
        }
    }

    /**
     * Retrieves {@link User} by {@link GetUserQuery}.
     *
     * @param query the query to get user.
     * @return retrieved user.
     * @throws UserNotFoundException in case of queried user was not found.
     */
    @Override
    public User handle(GetUserQuery query) {

        checkNotNull(query);

        if (logger.isInfoEnabled()) {
            logger.info("Handling query to get user in view: {}.", query.identifier().value());
        }

        UserId queriedUserId = query.identifier();

        Optional<UserRecord> maybeQueriedUser = retrievePossibleUser(queriedUserId);

        if (!maybeQueriedUser.isPresent()) {

            raiseUserNotFoundError(queriedUserId);
        }

        return createUserFrom(maybeQueriedUser.get());
    }

    /**
     * Retrieves possible {@link UserRecord} from the {@link UserStorage}.
     *
     * @param identifier the identifier of queried user.
     * @return a record of possible user.
     */
    private Optional<UserRecord> retrievePossibleUser(UserId identifier) {

        return registeredUsers.get(identifier);
    }

    /**
     * Raises {@link UserNotFoundException}.
     *
     * @param notFoundUserId identifier of the not found user.
     * @throws UserNotFoundException to notify caller about not found user.
     */
    private void raiseUserNotFoundError(UserId notFoundUserId) {

        throw new UserNotFoundException(format("User with id \"%s\" was not found.", notFoundUserId.value()));
    }

    /**
     * Creates {@link User} from the {@link UserRecord}.
     *
     * @param record the base user record.
     * @return created user value object.
     */
    private User createUserFrom(UserRecord record) {

        return new User(record.identifier(), record.loginName());
    }
}
