package filestore.web;

import io.nure.filestore.api.DownloadFile;
import io.nure.filestore.api.FileContent;
import io.nure.filestore.api.FileContentView;
import io.nure.filestore.api.FileNotFoundException;
import io.nure.filestore.api.LoggedInUser;
import io.nure.filestore.api.View;
import io.nure.filestore.storage.FileContentStorage;
import io.nure.filestore.storage.FileId;
import io.nure.filestore.storage.FileMetadataStorage;
import org.slf4j.Logger;
import spark.Request;
import spark.Response;
import spark.Route;

import java.util.Base64;

import static com.google.common.base.Preconditions.checkNotNull;
import static org.slf4j.LoggerFactory.getLogger;

/**
 * The {@link Route} that handles {@link Request}s of client to retrieve {@link FileContent},
 */
public class GetFileContentRoute implements Route {

    private static final Logger logger = getLogger(GetFileContentRoute.class);

    private final FileContentStorage fileContentStorage;

    private final FileMetadataStorage fileMetadataStorage;

    public GetFileContentRoute(FileContentStorage fileContentStorage, FileMetadataStorage fileMetadataStorage) {
        this.fileContentStorage = checkNotNull(fileContentStorage);
        this.fileMetadataStorage = checkNotNull(fileMetadataStorage);
    }

    @Override
    public Object handle(Request request, Response response) {

        LoggedInUser user = getLoggedInUser();
        FileId fileId = getFileId(request);
        DownloadFile query = createQuery(user, fileId);
        FileContentView view = createView();

        try {

            FileContent content = view.handle(query);

            if (logger.isInfoEnabled()) {
                logger.info("Created folder content: {}.", content);
            }

            return makeSuccessfulResponse(response, content);

        } catch (FileNotFoundException e) {

            if (logger.isInfoEnabled()) {
                logger.info("File not found {}", fileId.value());
            }

            return makeNotFoundResponse(response, fileId);
        }
    }

    /**
     * Retrieves {@link LoggedInUser} from the {@link CurrentLoggedInUser}.
     *
     * @return logged in user.
     */
    private LoggedInUser getLoggedInUser() {

        return CurrentLoggedInUser.user();
    }

    private FileId getFileId(Request request) {

        String param = "fileId";

        return new FileId(request.params(param));
    }

    /**
     * Creates query todownload file.
     *
     * @param user     owner of requested file
     * @param fileId identifier of requested file
     * @return query to retrieve content of the parent folder.
     */
    private DownloadFile createQuery(LoggedInUser user, FileId fileId) {

        return new DownloadFile(fileId, user.identifier());
    }

    /**
     * Creates {@link View} of the {@link FileContent}.
     *
     * @return view of the {@link FileContent}.
     */
    private FileContentView createView() {

        return new FileContentView(fileContentStorage, fileMetadataStorage);
    }

    /**
     * Makes successful {@link Response} with retrieved {@link FileContent}.
     *
     * @param response server response object.
     * @param content  retrieved content of the file.
     * @return 200;
     */
    private int makeSuccessfulResponse(Response response, FileContent content) {

        response.status(ResponseStatus.SUCCESS);
        response.body(Base64.getEncoder().encodeToString(content.value()));

        if (logger.isInfoEnabled()) {
            logger.info("Response created.");
        }

        return ResponseStatus.SUCCESS;
    }

    /**
     * Makes {@link Response} of not found file with {@link FileId}.
     *
     * @param response         response object.
     * @param fileId identifier of not found file.
     * @return error message of not found file.
     */
    private String makeNotFoundResponse(Response response, FileId fileId) {

        response.status(ResponseStatus.NOT_FOUND);

        return format("File with id \"%s\" was not found.", fileId.value());
    }
}
