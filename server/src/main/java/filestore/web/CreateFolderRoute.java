package filestore.web;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import io.nure.filestore.api.CreateFolder;
import io.nure.filestore.api.Folder;
import io.nure.filestore.api.FolderCreating;
import io.nure.filestore.api.FolderNotFoundException;
import io.nure.filestore.api.LoggedInUser;
import io.nure.filestore.api.OwnershipViolatedException;
import io.nure.filestore.api.User;
import io.nure.filestore.storage.FolderId;
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
 * The {@link Route} that handles client {@link Request}s to create new folders.
 */
public class CreateFolderRoute implements Route {

    private static final Logger logger = getLogger(CreateFolderRoute.class);

    /**
     * The name of request parameter, containing {@link FolderId}.
     */
    private static final String FOLDER_ID_REQUEST_PARAMETER = "folderId";

    /**
     * The converter of Java {@link Object}s into their JSON representation.
     */
    private final Gson jsonConverter = createJsonConverter();

    /**
     * A storage of all folders of {@link FileHubWebApplication}.
     */
    private final FolderStorage folderStorage;

    /**
     * Instantiates CreateFolderRoute with passed storage of folders.
     *
     * @param folderStorage a storage of all folders of the {@link FileHubWebApplication}.
     */
    public CreateFolderRoute(FolderStorage folderStorage) {

        this.folderStorage = checkNotNull(folderStorage);

        if (logger.isDebugEnabled()) {
            logger.debug("Created instance of the CreateFolderRoute.");
        }
    }

    /**
     * Handles a {@link Request} of client to create a new folder inside the provided {@link Folder}.
     *
     * @param request  the client request.
     * @param response the server response.
     * @return created {@link Folder} as JSON {@link String} in case of successful handling. Or {@link String} error
     * message if the destination parent {@link Folder} was not found.
     */
    @Override
    public Object handle(Request request, Response response) {

        LoggedInUser loggedInUser = getLoggedInUser();
        FolderId parentFolderId = getParentFolderId(request);
        CreateFolder command = createCommand(parentFolderId, loggedInUser);
        FolderCreating process = createProcess();

        try {

            Folder newFolder = process.handle(command);

            if (logger.isInfoEnabled()) {
                logger.info("Created folder: {}.", newFolder);
            }

            return createSuccessfulResponse(response, newFolder);

        } catch (FolderNotFoundException | OwnershipViolatedException e) {

            if (logger.isInfoEnabled()) {
                logger.info("The destination parent folder with id \"{}\" was not found.", parentFolderId.value());
            }

            return createFolderNotFoundResponse(response, parentFolderId, loggedInUser.identifier());
        }
    }

    /**
     * Creates JSON converter with registered {@link FolderSerializer}.
     *
     * @return created JSON converter.
     */
    private Gson createJsonConverter() {

        return new GsonBuilder()
            .registerTypeAdapter(Folder.class, new FolderSerializer())
            .create();
    }

    /**
     * Retrieves {@link LoggedInUser} from the client {@link CurrentLoggedInUser}.
     *
     * @return the instance of retrieved authenticated user.
     */
    private LoggedInUser getLoggedInUser() {

        return CurrentLoggedInUser.user();
    }

    /**
     * Retrieves a {@link FolderId} of the destination parent folder from the client {@link Request}.
     *
     * @param clientRequest the client request containing the identifier of the parent folder.
     * @return retrieved identifier of the parent folder.
     */
    private FolderId getParentFolderId(Request clientRequest) {

        return new FolderId(clientRequest.params(FOLDER_ID_REQUEST_PARAMETER));
    }

    /**
     * Creates the {@link CreateFolder} command.
     *
     * @param parentFolderId    an identifier of the destination parent {@link Folder}.
     * @param authenticatedUser an authenticated {@link User} that may have such parent {@link Folder}.
     * @return the created command.
     */
    private CreateFolder createCommand(FolderId parentFolderId, LoggedInUser authenticatedUser) {

        return new CreateFolder(parentFolderId, authenticatedUser.identifier());
    }

    /**
     * Creates the {@link FolderCreating} process with given storage of folders.
     *
     * @return the created process.
     */
    private FolderCreating createProcess() {

        return new FolderCreating(folderStorage);
    }

    /**
     * Creates successful {@link Response} with created folder.
     *
     * @param serverResponse the server response object.
     * @param createdFolder  the created subfolder.
     * @return the created folder as JSON {@link String}.
     */
    private String createSuccessfulResponse(Response serverResponse, Folder createdFolder) {

        serverResponse.status(ResponseStatus.SUCCESS);

        return jsonConverter.toJson(createdFolder, Folder.class);
    }

    /**
     * Creates failed {@link Response} with not found destination folder.
     *
     * @param serverResponse      the server response.
     * @param notFoundFolderId    the identifier of the 'not-found' destination parent folder.
     * @param parentFolderOwnerId the identifier if the owner of the folder.
     * @return the error message of the response.
     */
    private String createFolderNotFoundResponse(
        Response serverResponse,
        FolderId notFoundFolderId,
        UserId parentFolderOwnerId) {

        serverResponse.status(ResponseStatus.NOT_FOUND);

        return format(
            "The destination folder with id \"%s\", that is owned by the user with id \"%s\", was not found.",
            notFoundFolderId.value(),
            parentFolderOwnerId.value()
        );
    }
}
