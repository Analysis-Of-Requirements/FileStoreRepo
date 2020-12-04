package filestore.web;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import io.nure.filestore.api.Folder;
import io.nure.filestore.api.GetRootFolderQuery;
import io.nure.filestore.api.LoggedInUser;
import io.nure.filestore.api.RootFolderNotFoundException;
import io.nure.filestore.api.RootFolderView;
import io.nure.filestore.storage.FolderStorage;
import io.nure.filestore.storage.UserId;
import io.nure.filestore.storage.UserRecord;
import org.slf4j.Logger;
import spark.Request;
import spark.Response;
import spark.Route;

import static com.google.common.base.Preconditions.checkNotNull;
import static org.slf4j.LoggerFactory.getLogger;

/**
 * The {@link Route} that handles client {@link Request} to retrieve root {@link Folder} of the user with a
 * {@link UserId}.
 *
 * <p>A root folder is a folder, where all other files and folders of the
 * {@link UserRecord} are stored.
 */
public class GetRootFolderRoute implements Route {

    private static final Logger logger = getLogger(GetRootFolderRoute.class);

    /**
     * Error message for {@link Response} if root folder of the {@link LoggedInUser} was not found.
     */
    private static final String DEFAULT_NOT_FOUND_ERROR_MESSAGE = "Root folder was not found.";

    /**
     * A json parser {@link Gson}.
     *
     * <p>Should include {@link FolderSerializer}.
     */
    private final Gson jsonParser = createJsonParser();

    /**
     * Storage of folders.
     */
    private final FolderStorage storage;

    /**
     * Instantiates GetRootFolderRoute with storage of folders.
     *
     * @param storage storage of folders.
     */
    public GetRootFolderRoute(FolderStorage storage) {
        this.storage = checkNotNull(storage);
    }

    /**
     * Handles client request to retrieve root {@link Folder}.
     *
     * @param request  request of client.
     * @param response server response.
     * @return successful {@link Response} with JSON of retrieved root {@link Folder} or
     * {@link ResponseStatus#NOT_FOUND} if root folder was not found.
     */
    @Override
    public Object handle(Request request, Response response) {

        LoggedInUser user = getLoggedInUser();

        if (logger.isDebugEnabled()) {
            logger.debug("Logged in user: {}.", user);
        }

        GetRootFolderQuery query = createQuery(user);
        RootFolderView view = createView();

        try {

            Folder rootFolder = view.handle(query);

            if (logger.isInfoEnabled()) {
                logger.info("Retrieved root folder {} of the user {}.", rootFolder, user);
            }

            return makeSuccessfulResponse(response, rootFolder);

        } catch (RootFolderNotFoundException e) {

            if (logger.isInfoEnabled()) {
                logger.info("Root folder of {} was not found.", user);
            }

            return makeNotFoundResponse(response);
        }
    }

    /**
     * Creates instance of json parser.
     *
     * @return created json parser.
     */
    private Gson createJsonParser() {

        return new GsonBuilder()
            .registerTypeAdapter(Folder.class, new FolderSerializer())
            .create();
    }

    /**
     * Creates view of the root folder.
     *
     * @return view of the root folder.
     */
    private RootFolderView createView() {

        return new RootFolderView(storage);
    }

    /**
     * Retrieves {@link LoggedInUser} from the {@link CurrentLoggedInUser}.
     *
     * @return logged in user.
     */
    private LoggedInUser getLoggedInUser() {

        return CurrentLoggedInUser.user();
    }

    /**
     * Creates query to get root {@link Folder} of the {@link LoggedInUser}.
     *
     * @param user owner of requested root folder.
     * @return query to retrieve root folder of the user.
     */
    private GetRootFolderQuery createQuery(LoggedInUser user) {

        return new GetRootFolderQuery(user.identifier());
    }

    /**
     * Makes successful {@link Response} with retrieved {@link Folder}.
     *
     * @param response   response object.
     * @param rootFolder retrieved root folder.
     * @return response body.
     */
    private String makeSuccessfulResponse(Response response, Folder rootFolder) {

        response.status(ResponseStatus.SUCCESS);

        return jsonParser.toJson(rootFolder, Folder.class);
    }

    /**
     * Makes {@link Response} of not found root {@link Folder}.
     *
     * @param response response object.
     * @return response body.
     */
    private String makeNotFoundResponse(Response response) {

        response.status(ResponseStatus.NOT_FOUND);

        return DEFAULT_NOT_FOUND_ERROR_MESSAGE;
    }
}
