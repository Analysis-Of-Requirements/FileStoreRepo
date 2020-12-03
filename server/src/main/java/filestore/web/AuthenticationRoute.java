package filestore.web;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonParseException;
import io.nure.filestore.api.AuthenticateUser;
import io.nure.filestore.api.Authentication;
import io.nure.filestore.api.UserNotAuthenticatedException;
import io.nure.filestore.storage.InvalidLoginException;
import io.nure.filestore.storage.InvalidPasswordException;
import io.nure.filestore.storage.LoggedInUserRecord;
import io.nure.filestore.storage.LoggedInUsersStorage;
import io.nure.filestore.storage.LoginName;
import io.nure.filestore.storage.Password;
import io.nure.filestore.storage.Token;
import io.nure.filestore.storage.UserStorage;
import io.nure.filestore.storage.UserRecord;
import org.slf4j.Logger;
import spark.Request;
import spark.Response;
import spark.Route;

import static com.google.common.base.Preconditions.checkNotNull;
import static io.nure.filestore.web.ResponseStatus.BAD_REQUEST;
import static io.nure.filestore.web.ResponseStatus.SUCCESS;
import static io.nure.filestore.web.ResponseStatus.UNAUTHORIZED;
import static io.nure.filestore.web.ResponseStatus.UNPROCESSABLE_ENTITY;
import static java.lang.String.format;
import static org.slf4j.LoggerFactory.getLogger;

/**
 * The route {@link Route} that handles authentication requests {@link AuthenticateUser}.
 */
public class AuthenticationRoute implements Route {

    /**
     * Login field name.
     */
    private static final String LOGIN_FIELD = "login";

    /**
     * Default error message for validation error response {@link ValidationErrorDescription}.
     */
    private static final String DEFAULT_VALIDATION_ERROR_MESSAGE = "Login or password is incorrect. Please, try again.";

    private static final Logger logger = getLogger(AuthenticationRoute.class);

    /**
     * A json parser {@link Gson}.
     *
     * <p>Should include:
     * <ul>
     *     <li>{@link AuthenticateUserCommandDeserializer}</li>
     *     <li>{@link TokenSerializer}</li>
     *     <li>{@link ValidationErrorDescriptionSerializer}</li>
     * </ul>
     */
    private final Gson jsonParser = createJsonParser();

    /**
     * A storage of users.
     */
    private final UserStorage userStorage;

    /**
     * A storage of logged in users.
     */
    private final LoggedInUsersStorage loggedInUsersStorage;

    /**
     * Instantiates AuthenticationRoute.
     *
     * @param userStorage          storage of registered {@link UserRecord}s.
     * @param loggedInUsersStorage storage of {@link LoggedInUserRecord}s.
     */
    public AuthenticationRoute(UserStorage userStorage, LoggedInUsersStorage loggedInUsersStorage) {

        this.userStorage = checkNotNull(userStorage);
        this.loggedInUsersStorage = checkNotNull(loggedInUsersStorage);
    }

    /**
     * Handles {@link Request}s to authenticate user.
     *
     * @return issued token {@link Token} in case of successful authentication.
     * Validation error {@link ValidationErrorDescription} in case of invalid
     * {@link LoginName} or {@link Password}.
     * Authentication error {@link UserNotAuthenticatedException} in case of the user with such credentials is not
     * authenticated.
     */
    @Override
    public Object handle(Request request, Response response) {

        try {

            AuthenticateUser command = readCommand(request);
            Authentication process = createProcess();
            Token issuedToken = process.handle(command);

            if (logger.isInfoEnabled()) {
                logger.info("Authentication succeeded for command {}.", command);
            }

            return makeSuccessfulResponse(response, issuedToken);

        } catch (InvalidLoginException | InvalidPasswordException e) {

            if (logger.isErrorEnabled()) {
                logger.error("User credentials are invalid: {}.", e.getMessage());
            }

            return makeValidationErrorResponse(response);

        } catch (UserNotAuthenticatedException e) {

            if (logger.isErrorEnabled()) {
                logger.error("Authentication Error: {}.", e.getMessage());
            }

            makeNotAuthenticatedErrorResponse(response);

            return e.getMessage();

        } catch (JsonParseException | NullPointerException | ClassCastException e) {

            if (logger.isErrorEnabled()) {
                logger.error("Invalid request body: {}. Error message: {}.", request.body(), e.getMessage());
            }

            return makeBadRequestResponse(request, response);
        }
    }

    /**
     * Creates {@link Authentication} process.
     *
     * @return create process.
     */
    private Authentication createProcess() {
        return new Authentication(userStorage, loggedInUsersStorage);
    }

    /**
     * Reads command from body of {@link Request}.
     *
     * @param request the request of client.
     * @return retrieved command.
     */
    private AuthenticateUser readCommand(Request request) {
        return jsonParser.fromJson(request.body(), AuthenticateUser.class);
    }

    /**
     * Makes successful response with issued {@link Token}.
     *
     * @param response    successful server response.
     * @param issuedToken token issued to authenticate further requests of client.
     * @return issued token in JSON format.
     */
    private String makeSuccessfulResponse(Response response, Token issuedToken) {

        response.status(SUCCESS);

        return jsonParser.toJson(issuedToken, Token.class);
    }

    /**
     * Makes {@link Response} with validation error.
     *
     * @param response response object.
     * @return parsed validation error description.
     */
    private String makeValidationErrorResponse(Response response) {

        response.status(UNPROCESSABLE_ENTITY);

        ValidationErrorDescription description = new ValidationErrorDescription(
            LOGIN_FIELD,
            DEFAULT_VALIDATION_ERROR_MESSAGE
        );

        return jsonParser.toJson(description);
    }

    /**
     * Makes {@link Response} with not-authenticated error.
     *
     * @param response response object.
     */
    private void makeNotAuthenticatedErrorResponse(Response response) {

        response.status(UNAUTHORIZED);
    }

    /**
     * Makes {@link Response} of malformed request.
     *
     * @param request  malformed request of client.
     * @param response server response object.
     * @return error message.
     */
    private String makeBadRequestResponse(Request request, Response response) {

        response.status(BAD_REQUEST);

        return format("Malformed request body: %s", request.body());
    }

    /**
     * Creates instance of json parser.
     *
     * @return created json parser.
     */
    private Gson createJsonParser() {

        return new GsonBuilder()
            .registerTypeAdapter(AuthenticateUser.class, new AuthenticateUserCommandDeserializer())
            .registerTypeAdapter(Token.class, new TokenSerializer())
            .registerTypeAdapter(ValidationErrorDescription.class, new ValidationErrorDescriptionSerializer())
            .create();
    }
}
