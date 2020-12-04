package filestore.web;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import io.nure.filestore.api.RegisterUser;
import io.nure.filestore.api.Registration;
import io.nure.filestore.api.UserAlreadyExistsException;
import io.nure.filestore.storage.FolderStorage;
import io.nure.filestore.storage.InvalidLoginException;
import io.nure.filestore.storage.InvalidPasswordException;
import io.nure.filestore.storage.UserStorage;
import org.slf4j.Logger;
import spark.Request;
import spark.Response;
import spark.Route;

import static com.google.common.base.Preconditions.checkNotNull;
import static org.slf4j.LoggerFactory.getLogger;

/**
 * The route {@link Route} that handles registration requests {@link Request}.
 */
public class RegistrationRoute implements Route {

    /**
     * Login field name.
     */
    private static final String LOGIN_FIELD = "login";

    /**
     * Default error message for validation error response {@link ValidationErrorDescription}.
     */
    private static final String DEFAULT_VALIDATION_ERROR_MESSAGE = "Login or password is incorrect. Please, try again.";

    private static final Logger logger = getLogger(RegistrationRoute.class);

    /**
     * Json parser {@link Gson} that deserializes {@link RegisterUser} command.
     *
     * <p>Should include {@link RegisterUserCommandDeserializer} and {@link ValidationErrorDescriptionSerializer}.
     */
    private final Gson jsonParser;

    /**
     * Storage of users {@link UserStorage}.
     */
    private final UserStorage userStorage;

    /**
     * Storage of folders {@link FolderStorage}.
     */
    private final FolderStorage folderStorage;

    /**
     * Instantiates RegistrationRoute.
     *
     * @param userStorage - storage of users.
     */
    public RegistrationRoute(UserStorage userStorage, FolderStorage folderStorage) {

        if (logger.isInfoEnabled()) {
            logger.info("Creating RegistrationRoute with Gson, {}.", userStorage);
        }

        this.jsonParser = createJsonParser();
        this.userStorage = checkNotNull(userStorage);
        this.folderStorage = checkNotNull(folderStorage);
    }

    /**
     * <p>Handles registration request {@link Request}.
     *
     * @return successful response {@link ResponseStatus#SUCCESS} or validation error json in case of failed handling.
     */
    @Override
    public Object handle(Request request, Response response) {

        try {

            RegisterUser command = jsonParser.fromJson(request.body(), RegisterUser.class);
            new Registration(userStorage, folderStorage).handle(command);

            if (logger.isInfoEnabled()) {
                logger.info("Registration process succeeded. {}.", command);
            }

        } catch (InvalidLoginException | InvalidPasswordException e) {

            if (logger.isErrorEnabled()) {
                logger.error("User credentials are invalid: {}.", e.getMessage());
            }

            response.status(ResponseStatus.UNPROCESSABLE_ENTITY);

            ValidationErrorDescription description = new ValidationErrorDescription(
                LOGIN_FIELD,
                DEFAULT_VALIDATION_ERROR_MESSAGE
            );

            return jsonParser.toJson(description);

        } catch (UserAlreadyExistsException e) {

            if (logger.isErrorEnabled()) {
                logger.error("Registration process failed: {}.", e.getMessage());
            }

            response.status(ResponseStatus.UNPROCESSABLE_ENTITY);

            ValidationErrorDescription description = new ValidationErrorDescription(LOGIN_FIELD, e.getMessage());

            return jsonParser.toJson(description);
        }

        return ResponseStatus.SUCCESS;
    }

    /**
     * Creates instance of json parser.
     *
     * @return created json parser.
     */
    private Gson createJsonParser() {

        return new GsonBuilder()
            .registerTypeAdapter(RegisterUser.class, new RegisterUserCommandDeserializer())
            .registerTypeAdapter(ValidationErrorDescription.class, new ValidationErrorDescriptionSerializer())
            .create();
    }
}
