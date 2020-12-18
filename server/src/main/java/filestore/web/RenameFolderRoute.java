package filestore.web;

import com.google.gson.Gson;
import com.google.gson.JsonParseException;
import io.nure.filestore.api.FolderNotFoundException;
import io.nure.filestore.api.FolderRenaming;
import io.nure.filestore.api.OwnershipViolatedException;
import io.nure.filestore.api.RenameFolder;
import io.nure.filestore.storage.FolderStorage;
import org.slf4j.Logger;
import spark.Request;
import spark.Response;
import spark.Route;

import static com.google.common.base.Preconditions.checkNotNull;
import static io.nure.filestore.web.ResponseStatus.BAD_REQUEST;
import static io.nure.filestore.web.ResponseStatus.SUCCESS;
import static java.lang.String.format;
import static org.slf4j.LoggerFactory.getLogger;

public class RenameFolderRoute implements Route {

    private static final Logger logger = getLogger(RenameFolderRoute.class);

    private final FolderStorage folderStorage;

    private final Gson jsonParser = new Gson();

    public RenameFolderRoute(FolderStorage folderStorage) {
        this.folderStorage = checkNotNull(folderStorage);
    }

    @Override
    public Object handle(Request request, Response response) {

        try {

            RenameFolder renameFolder = jsonParser.fromJson(request.body(), RenameFolder.class);
            FolderRenaming process = new FolderRenaming(folderStorage);
            process.handle(renameFolder);

            return SUCCESS;

        } catch (FolderNotFoundException e) {

            if (logger.isErrorEnabled()) {
                logger.error("Folder not found: {}.", e.getMessage());
            }

            return makeNotFoundErrorResponse(response, e.getMessage());

        }  catch (OwnershipViolatedException e) {

            if (logger.isErrorEnabled()) {
                logger.error("Owner is invalid: {}.", e.getMessage());
            }

            return makeNotFoundErrorResponse(response, e.getMessage());

        } catch (JsonParseException | NullPointerException | ClassCastException e) {

            if (logger.isErrorEnabled()) {
                logger.error("Invalid request body: {}. Error message: {}.", request.body(), e.getMessage());
            }

            return makeBadRequestResponse(request, response);
        }
    }

    private String makeNotFoundErrorResponse(Response response, String message) {
        response.status(ResponseStatus.NOT_FOUND);
        return message;
    }

    private String makeBadRequestResponse(Request request, Response response) {

        response.status(BAD_REQUEST);

        return format("Malformed request url: %s", request.url());
    }
}
