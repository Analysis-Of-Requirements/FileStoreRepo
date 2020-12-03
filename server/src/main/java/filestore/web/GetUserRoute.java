package filestore.web;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import io.nure.filestore.api.GetUserQuery;
import io.nure.filestore.api.LoggedInUser;
import io.nure.filestore.api.User;
import io.nure.filestore.api.UserNotFoundException;
import io.nure.filestore.api.UserView;
import io.nure.filestore.api.View;
import io.nure.filestore.storage.UserId;
import io.nure.filestore.storage.UserStorage;
import org.slf4j.Logger;
import spark.Request;
import spark.Response;
import spark.Route;

import static com.google.common.base.Preconditions.checkNotNull;
import static io.nure.filestore.web.ResponseStatus.NOT_FOUND;
import static io.nure.filestore.web.ResponseStatus.SUCCESS;
import static java.lang.String.format;
import static org.slf4j.LoggerFactory.getLogger;

/**
 * The {@link Route} that handles {@link Request}s of client to retrieve {@link User}.
 */
public class GetUserRoute implements Route {

    private static final Logger logger = getLogger(GetUserRoute.class);

    /**
     * A utility class for serializing {@link User} objects to JSON.
     *
     * <p>Should include {@link UserSerializer}.
     */
    private final Gson jsonParser = createJsonParser();

    /**
     * The storage of registered users.
     */
    private final UserStorage registeredUsers;

    /**
     * Instantiates GetUserRoute with storage of registered users.
     *
     * @param registeredUsers the storage of registered users.
     */
    public GetUserRoute(UserStorage registeredUsers) {
        this.registeredUsers = checkNotNull(registeredUsers);
    }

    /**
     * Handles {@link Request} of client to get {@link User}.
     *
     * @param request  the client request.
     * @param response the server response.
     * @return retrieved {@link User} in JSON format or {@link ResponseStatus#NOT_FOUND} if requested user is not found.
     */
    @Override
    public Object handle(Request request, Response response) {

        LoggedInUser loggedInUser = getLoggedInUser();
        GetUserQuery query = createQuery(loggedInUser);
        UserView view = createView();

        try {

            User queriedUser = view.handle(query);

            if (logger.isInfoEnabled()) {
                logger.info("Retrieved user: {}.", queriedUser);
            }

            return makeSuccessfulResponse(response, queriedUser);

        } catch (UserNotFoundException e) {

            if (logger.isInfoEnabled()) {
                logger.info("User with id \"{}\" was not found.", loggedInUser.identifier().value());
            }

            return makeNotFoundResponse(response, loggedInUser.identifier());
        }
    }

    /**
     * Creates JSON parser.
     *
     * @return created JSON parser.
     */
    private Gson createJsonParser() {

        return new GsonBuilder()
            .registerTypeAdapter(User.class, new UserSerializer())
            .create();
    }

    /**
     * Retrieves {@link LoggedInUser} from the {@link CurrentLoggedInUser}.
     *
     * @return the logged in user.
     */
    private LoggedInUser getLoggedInUser() {

        return CurrentLoggedInUser.user();
    }

    /**
     * Creates query to get {@link User} by {@link UserId}.
     *
     * @param user logged-in user whose data is queried.
     * @return query to get user.
     */
    private GetUserQuery createQuery(LoggedInUser user) {

        return new GetUserQuery(user.identifier());
    }

    /**
     * Creates {@link View} of the {@link User}.
     *
     * @return view of the {@link User}.
     */
    private UserView createView() {

        return new UserView(registeredUsers);
    }

    /**
     * Makes successful {@link Response} with retrieved {@link User}.
     *
     * @param response      the server response object.
     * @param retrievedUser the retrieved user.
     * @return the user in JSON format.
     */
    private String makeSuccessfulResponse(Response response, User retrievedUser) {

        response.status(SUCCESS);

        String userJson = jsonParser.toJson(retrievedUser, User.class);

        if (logger.isInfoEnabled()) {
            logger.info("JSON of User: {}.", userJson);
        }

        return userJson;
    }

    /**
     * Makes {@link Response} of not found user.
     *
     * @param response       the response object.
     * @param notFoundUserId the identifier of not found user.
     * @return the error message of not found user.
     */
    private String makeNotFoundResponse(Response response, UserId notFoundUserId) {

        response.status(NOT_FOUND);

        return format("User with id \"%s\" was not found.", notFoundUserId.value());
    }
}
