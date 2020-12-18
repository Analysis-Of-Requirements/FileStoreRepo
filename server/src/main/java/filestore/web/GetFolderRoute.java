package filestore.web;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import io.nure.filestore.api.Folder;
import io.nure.filestore.api.FolderNotFoundException;
import io.nure.filestore.api.FolderView;
import io.nure.filestore.api.GetFolderQuery;
import io.nure.filestore.api.LoggedInUser;
import io.nure.filestore.storage.FolderId;
import io.nure.filestore.storage.FolderStorage;
import io.nure.filestore.storage.UserId;
import org.slf4j.Logger;
import spark.Request;
import spark.Response;
import spark.Route;

import static com.google.common.base.Preconditions.checkNotNull;
import static io.nure.filestore.web.ResponseStatus.NOT_FOUND;
import static io.nure.filestore.web.ResponseStatus.SUCCESS;
import static org.slf4j.LoggerFactory.getLogger;

/**
 * The {@link Route} that handles {@link Request}s of a client to get {@link Folder}.
 */
public class GetFolderRoute implements Route {

    private static final Logger logger = getLogger(GetFolderRoute.class);

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
     * Instantiates GetFolderRoute with storage of folders.
     *
     * @param storage storage of folders.
     */
    public GetFolderRoute(FolderStorage storage) {
        this.storage = checkNotNull(storage);
    }

    /**
     * Handles {@link Request} from a client to get {@link Folder} by {@link FolderId} and {@link UserId}.
     *
     * @param request  request of client to get folder.
     * @param response server response.
     * @return successful {@link Response} with JSON of retrieved {@link Folder} or {@link ResponseStatus#NOT_FOUND}
     * if the folder was not found.
     */
    @Override
    public Object handle(Request request, Response response) {

        LoggedInUser user = getLoggedInUser();
        FolderId requestedFolderId = getFolderId(request);
        GetFolderQuery query = createQuery(user, requestedFolderId);
        FolderView view = createView();

        try {

            Folder requestedFolder = view.handle(query);

            if (logger.isInfoEnabled()) {
                logger.info("Retrieved folder {}.", requestedFolder);
            }

            return makeSuccessfulResponse(response, requestedFolder);

        } catch (FolderNotFoundException e) {

            if (logger.isInfoEnabled()) {
                logger.info("Folder of {} was not found.", user);
            }

            return makeNotFoundResponse(response, requestedFolderId);
        }
    }

    /**
     * Creates json parser.
     *
     * @return created json parser.
     */
    private Gson createJsonParser() {

        return new GsonBuilder()
            .registerTypeAdapter(Folder.class, new FolderSerializer())
            .create();
    }

    /**
     * Creates {@link FolderView}.
     *
     * @return view of the {@link Folder}.
     */
    private FolderView createView() {

        return new FolderView(storage);
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
     * Retrieves {@link FolderId} from {@link Request}.
     *
     * @param request client request.
     * @return extracted folder identifier.
     */
    private FolderId getFolderId(Request request) {

        String folderIdParameter = "folderId";

        return new FolderId(request.params(folderIdParameter));
    }

    /**
     * Creates query to get {@link Folder} by {@link FolderId} and by {@link UserId} of the {@link LoggedInUser}.
     *
     * @param user     owner of requested folder.
     * @param folderId identifier of requested folder.
     * @return query to retrieve folder.
     */
    private GetFolderQuery createQuery(LoggedInUser user, FolderId folderId) {

        return new GetFolderQuery(user.identifier(), folderId);
    }

    /**
     * Makes successful {@link Response} with retrieved {@link Folder}.
     *
     * @param response   response object.
     * @param rootFolder retrieved root folder.
     * @return response body.
     */
    private String makeSuccessfulResponse(Response response, Folder rootFolder) {

        response.status(SUCCESS);

        return jsonParser.toJson(rootFolder, Folder.class);
    }

    /**
     * Makes {@link Response} with identifier of not found folder.
     *
     * @param response         response object.
     * @param notFoundFolderId identifier of not found folder.
     * @return response body.
     */
    private String makeNotFoundResponse(Response response, FolderId notFoundFolderId) {

        response.status(NOT_FOUND);

        return format("Folder with id \"%s\" was not found.", notFoundFolderId.value());
    }
}
