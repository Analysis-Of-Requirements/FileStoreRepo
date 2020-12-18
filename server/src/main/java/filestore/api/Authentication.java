package filestore.api;

import io.nure.filestore.storage.ExpirationTime;
import io.nure.filestore.storage.LoggedInUserRecord;
import io.nure.filestore.storage.LoggedInUsersStorage;
import io.nure.filestore.storage.LoginName;
import io.nure.filestore.storage.Password;
import io.nure.filestore.storage.Token;
import io.nure.filestore.storage.UserId;
import io.nure.filestore.storage.UserRecord;
import io.nure.filestore.storage.UserStorage;
import io.nure.filestore.web.FileHubWebApplication;
import org.slf4j.Logger;

import static com.google.common.base.Preconditions.checkNotNull;
import static io.nure.filestore.api.ExpirationTimeCreator.expireAfterDays;
import static io.nure.filestore.api.HashEncoder.encode;
import static io.nure.filestore.api.IdGenerator.generateId;
import static org.slf4j.LoggerFactory.getLogger;

/**
 * The process of authenticating a user into the {@link FileHubWebApplication}. Executes
 * {@link AuthenticateUser} command.
 */
public class Authentication implements ApplicationProcess {

    private static final Logger logger = getLogger(Authentication.class);

    /**
     * Default number of days, after which {@link LoggedInUserRecord} expires.
     */
    private static final int DEFAULT_TOKEN_EXPIRATION_DAYS = 2;

    /**
     * A storage of users.
     */
    private final UserStorage userStorage;

    /**
     * A storage of logged in users.
     */
    private final LoggedInUsersStorage loggedInUsersStorage;

    /**
     * Instantiates Authentication process.
     *
     * @param userStorage          storage of registered users.
     * @param loggedInUsersStorage storage of logged in users.
     */
    public Authentication(UserStorage userStorage, LoggedInUsersStorage loggedInUsersStorage) {

        this.userStorage = checkNotNull(userStorage);
        this.loggedInUsersStorage = checkNotNull(loggedInUsersStorage);
    }

    /**
     * Executes {@link AuthenticateUser} command to authenticate user {@link UserRecord}.
     *
     * @param command command to authenticate user.
     * @return issued token {@link Token} in case of successful authentication.
     * @throws UserNotAuthenticatedException in case of no user is authenticated for passed {@link LoginName} and
     *                                       {@link Password}.
     */
    public Token handle(AuthenticateUser command) throws UserNotAuthenticatedException {

        if (logger.isInfoEnabled()) {
            logger.info("Call to Authentication.handle(). Command: {}.", command);
        }

        checkNotNull(command);

        String passwordHash = encode(command.password().value());

        UserRecord user = userStorage
            .get(command.loginName(), passwordHash)
            .orElseThrow(() -> new UserNotAuthenticatedException(format(
                "No user found for passed login name \"%s\" and password \"%s\".",
                command.loginName().value(),
                command.password().value()
            )));

        UserId userId = user.identifier();
        Token token = new Token(generateId());
        ExpirationTime expirationTime = expireAfterDays(DEFAULT_TOKEN_EXPIRATION_DAYS);

        LoggedInUserRecord loggedInUserRecord = new LoggedInUserRecord(token, userId, expirationTime);
        loggedInUsersStorage.put(loggedInUserRecord);

        if (logger.isInfoEnabled()) {
            logger.info("User was authenticated. {}. Logged in user: {}.", user, loggedInUserRecord);
        }

        return token;
    }
}
