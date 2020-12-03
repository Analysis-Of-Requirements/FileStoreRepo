package filestore.web;

import com.google.common.base.Splitter;
import com.google.common.collect.Iterables;
import com.google.gson.JsonParseException;
import io.nure.filestore.api.LogOutUser;
import io.nure.filestore.api.UserLoggingOut;
import io.nure.filestore.storage.LoggedInUsersStorage;
import io.nure.filestore.storage.Token;
import org.slf4j.Logger;
import spark.Request;
import spark.Response;
import spark.Route;

import static io.nure.filestore.web.ResponseStatus.BAD_REQUEST;
import static io.nure.filestore.web.ResponseStatus.SUCCESS;
import static org.slf4j.LoggerFactory.getLogger;

public class LogOutRoute implements Route {

    private static final Logger logger = getLogger(LogOutRoute.class);

    private final LoggedInUsersStorage loggedInUsersStorage;

    public LogOutRoute(LoggedInUsersStorage loggedInUsers) {
        loggedInUsersStorage = loggedInUsers;
    }

    @Override
    public Object handle(Request request, Response response) throws Exception {

        try {

            Token token = new Token(Iterables.get(Splitter.on(' ').split(request.headers("Authentication")), 1));
            LogOutUser command = new LogOutUser(token);
            UserLoggingOut process = new UserLoggingOut(loggedInUsersStorage);
            process.handle(command);

            if (logger.isInfoEnabled()) {
                logger.info("User was logged out.");
            }

            return makeSuccessfulResponse(response);

        } catch (JsonParseException | NullPointerException | ClassCastException e) {

            return makeBadRequestResponse(response);
        }
    }

    /**
     * Makes successful response with issued {@link Token}.
     *
     * @param response    successful server response.
     * @return 200
     */
    private int makeSuccessfulResponse(Response response) {

        response.status(SUCCESS);

        return SUCCESS;
    }

    /**
     * Makes {@link Response} of malformed request.
     *
     * @param response server response object.
     * @return 400
     */
    private int makeBadRequestResponse(Response response) {

        response.status(BAD_REQUEST);

        return BAD_REQUEST;
    }
}
