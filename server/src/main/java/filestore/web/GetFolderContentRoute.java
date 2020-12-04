package filestore.web;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import io.nure.filestore.api.FileMetadata;
import io.nure.filestore.api.Folder;
import io.nure.filestore.api.FolderContent;
import io.nure.filestore.api.FolderContentView;
import io.nure.filestore.api.FolderNotFoundException;
import io.nure.filestore.api.GetFolderContentQuery;
import io.nure.filestore.api.LoggedInUser;
import io.nure.filestore.api.View;
import io.nure.filestore.storage.FileMetadataRecord;
import io.nure.filestore.storage.FileMetadataStorage;
import io.nure.filestore.storage.FolderId;
import io.nure.filestore.storage.FolderRecord;
import io.nure.filestore.storage.FolderStorage;
import io.nure.filestore.storage.UserId;
import org.slf4j.Logger;
import spark.Request;
import spark.Response;
import spark.Route;

import static com.google.common.base.Preconditions.checkNotNull;
import static java.lang.String.format;
import static org.slf4j.LoggerFactory.getLogger;

/**
 * The {@link Route} that handles {@link Request}s of client to retrieve {@link FolderContent} of the {@link Folder}.
 */
public class GetFolderContentRoute implements Route {

    private static final Logger logger = getLogger(GetFolderContentRoute.class);

    /**
     * A json parser {@link Gson}.
     *
     * <p>Should include:
     * <ul>
     *     <li>{@link FolderSerializer}</li>
     *     <li>{@link FileMetadataSerializer}</li>
     *     <li>{@link FolderContentSerializer}</li>
     * </ul>
     */
    private final Gson jsonParser = createJsonParser();

    /**
     * The storage of {@link FolderRecord}s.
     */
    private final FolderStorage folderStorage;

    /**
     * The storage of {@link FileMetadataRecord}s.
     */
    private final FileMetadataStorage fileMetadataStorage;

    /**
     * Instantiates GetFolderContentRoute with necessary storages.
     *
     * @param folderStorage       the storage of folders.
     * @param fileMetadataStorage the storage of metadata of files.
     */
    public GetFolderContentRoute(FolderStorage folderStorage, FileMetadataStorage fileMetadataStorage) {

        this.folderStorage = checkNotNull(folderStorage);
        this.fileMetadataStorage = checkNotNull(fileMetadataStorage);
    }

    /**
     * Handles {@link Request} of client to get {@link FolderContent} of the {@link Folder} that is owned by the
     * {@link LoggedInUser}.
     *
     * @param request  request of the client.
     * @param response server response.
     * @return successful {@link Response} with JSON of retrieved {@link FolderContent} or
     * {@link ResponseStatus#NOT_FOUND} if the parent {@link Folder} was not found.
     */
    @Override
    public Object handle(Request request, Response response) {

        LoggedInUser user = getLoggedInUser();
        FolderId requestedFolderId = getFolderId(request);
        GetFolderContentQuery query = createQuery(user, requestedFolderId);
        FolderContentView view = createView();

        try {

            FolderContent content = view.handle(query);

            if (logger.isInfoEnabled()) {
                logger.info("Created folder content: {}.", content);
            }

            return makeSuccessfulResponse(response, content);

        } catch (FolderNotFoundException e) {

            if (logger.isInfoEnabled()) {
                logger.info("Parent folder with id \"{}\" was not found.", requestedFolderId.value());
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
            .registerTypeAdapter(FileMetadata.class, new FileMetadataSerializer())
            .registerTypeAdapter(FolderContent.class, new FolderContentSerializer())
            .create();
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
     * Retrieves {@link FolderId} from the {@link Request}.
     *
     * @param request request of the client.
     * @return extracted folder identifier.
     */
    private FolderId getFolderId(Request request) {

        String folderIdParameter = "folderId";

        return new FolderId(request.params(folderIdParameter));
    }

    /**
     * Creates query to get {@link FolderContent} of the {@link Folder} with {@link FolderId} that is owned by the
     * {@link LoggedInUser} with {@link UserId}.
     *
     * @param user     owner of requested parent folder.
     * @param folderId identifier of requested parent folder.
     * @return query to retrieve content of the parent folder.
     */
    private GetFolderContentQuery createQuery(LoggedInUser user, FolderId folderId) {

        return new GetFolderContentQuery(user.identifier(), folderId);
    }

    /**
     * Creates {@link View} of the {@link FolderContent}.
     *
     * @return view of the {@link FolderContent}.
     */
    private FolderContentView createView() {

        return new FolderContentView(folderStorage, fileMetadataStorage);
    }

    /**
     * Makes successful {@link Response} with retrieved {@link FolderContent}.
     *
     * @param response server response object.
     * @param content  retrieved content of the folder.
     * @return folder content in JSON format.
     */
    private String makeSuccessfulResponse(Response response, FolderContent content) {

        response.status(ResponseStatus.SUCCESS);

        String contentJson = jsonParser.toJson(content, FolderContent.class);

        if (logger.isInfoEnabled()) {
            logger.info("JSON of FolderContent: {}.", contentJson);
        }

        return contentJson;
    }

    /**
     * Makes {@link Response} of not found folder with {@link FolderId}.
     *
     * @param response         response object.
     * @param notFoundFolderId identifier of not found folder.
     * @return error message of not found folder.
     */
    private String makeNotFoundResponse(Response response, FolderId notFoundFolderId) {

        response.status(ResponseStatus.NOT_FOUND);

        return format("Folder with id \"%s\" was not found.", notFoundFolderId.value());
    }
}
