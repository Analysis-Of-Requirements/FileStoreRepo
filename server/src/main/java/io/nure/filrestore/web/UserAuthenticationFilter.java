package io.nure.filrestore.web;

import io.nure.filestore.storage.UserId;
import io.nure.filestore.storage.UserRecord;
import io.nure.filestore.web.ResponseStatus;
import io.nure.filrestore.api.LoggedInUser;
import io.nure.filrestore.api.TokenExpirationProxy;
import io.nure.filrestore.api.TokenExpiredException;
import io.nure.filrestore.api.TokenNotFoundException;
import io.nure.filrestore.storage.LoggedInUserRecord;
import io.nure.filrestore.storage.LoggedInUsersStorage;
import io.nure.filrestore.storage.Token;
import org.slf4j.Logger;
import spark.Filter;
import spark.Request;
import spark.Response;


import static com.google.common.base.Preconditions.checkNotNull;
import static org.slf4j.LoggerFactory.getLogger;
import static spark.Spark.halt;

/**
 * A {@link Filter} of not authenticated {@link UserRecord}s.
 *
 * <p>An authenticated user is present in {@link LoggedInUsersStorage} and has valid {@link Token}.
 */
public class UserAuthenticationFilter implements Filter {

    private static final Logger logger = getLogger(UserAuthenticationFilter.class);

    /**
     * Storage of l{@link LoggedInUserRecord}s.
     */
    private final LoggedInUsersStorage storage;

    /**
     * Instantiates UserAuthenticationFilter.
     *
     * @param storage storage of {@link LoggedInUserRecord}s.
     */
    public UserAuthenticationFilter(LoggedInUsersStorage storage) {
        this.storage = checkNotNull(storage);
    }

    /**
     * Filters {@link Request}s of the client.
     *
     * @param request  client request, containing {@link Token}.
     * @param response server response.
     */
    @Override
    public void handle(Request request, Response response) {

        if (logger.isInfoEnabled()) {
            logger.info("Filtering request: {}: {}.", request.requestMethod(), request.pathInfo());
        }

        Token token = readToken(request);

        if (logger.isInfoEnabled()) {
            logger.info("Request token: {}.", token);
        }

        try {

            TokenExpirationProxy loggedInUsers = getLoggedInUsers();
            LoggedInUserRecord loggedInUserRecord = retrieveUserRecord(loggedInUsers, token);

            if (logger.isDebugEnabled()) {
                logger.debug("Retrieved user record: {}.", loggedInUserRecord);
            }

            UserId tokenOwnerId = loggedInUserRecord.userId();
            LoggedInUser loggedInUser = createLoggedInUser(tokenOwnerId);

            acceptRequest(loggedInUser);

            if (logger.isInfoEnabled()) {
                logger.info("Request accepted with {}.", loggedInUser);
            }

        } catch (TokenNotFoundException | TokenExpiredException e) {

            if (logger.isInfoEnabled()) {
                logger.info("User is not authenticated. {}", e.getMessage());
            }

            sendNotAuthorizedResponse();
        }
    }

    /**
     * Retrieves {@link Token} from the {@link Request}.
     * <a href="https://swagger.io/docs/specification/authentication/bearer-authentication/">See for more.</a>
     *
     * @param request request with {@link Token}.
     * @return retrieved {@link Token} value.
     */
    private Token readToken(Request request) {

        String tokenValue = request
                .headers("Authentication")
                .replaceAll("^\\s*Bearer\\s", "");

        return new Token(tokenValue);
    }

    /**
     * Creates {@link TokenExpirationProxy} wrapping {@link LoggedInUsersStorage}.
     *
     * @return token expiration proxy.
     */
    private TokenExpirationProxy getLoggedInUsers() {

        return new TokenExpirationProxy(storage);
    }

    /**
     * Retrieves {@link LoggedInUserRecord} from {@link TokenExpirationProxy} by passed {@link Token}.
     *
     * @param loggedInUsers storage wrapped in the proxy.
     * @param token         token of logged in user.
     * @return logged in user record.
     */
    private LoggedInUserRecord retrieveUserRecord(TokenExpirationProxy loggedInUsers, Token token) {

        return loggedInUsers.get(token).get();
    }

    /**
     * Sends not authorized {@link Response} to client.
     */
    private void sendNotAuthorizedResponse() {

        halt(ResponseStatus.UNAUTHORIZED, "Please, log in to continue!");
    }

    /**
     * Creates {@link LoggedInUser} instance.
     *
     * @param identifier identifier of the user.
     * @return created user.
     */
    private LoggedInUser createLoggedInUser(UserId identifier) {

        return new LoggedInUser(identifier);
    }

    /**
     * Accepts {@link Request} of the client.
     *
     * @param user logged in user.
     */
    private void acceptRequest(LoggedInUser user) {

        CurrentLoggedInUser.setUser(user);
    }
}
