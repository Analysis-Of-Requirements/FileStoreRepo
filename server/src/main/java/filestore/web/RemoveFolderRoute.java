package filestore.web;

import com.google.gson.JsonParseException;
import io.nure.filestore.api.FolderNotFoundException;
import io.nure.filestore.api.FolderRemoving;
import io.nure.filestore.api.RemoveFolder;
import io.nure.filestore.storage.FileContentStorage;
import io.nure.filestore.storage.FileMetadataStorage;
import io.nure.filestore.storage.FolderId;
import io.nure.filestore.storage.FolderStorage;
import org.slf4j.Logger;
import spark.Request;
import spark.Response;
import spark.Route;

import static io.nure.filestore.web.ResponseStatus.BAD_REQUEST;
import static io.nure.filestore.web.ResponseStatus.SUCCESS;
import static java.lang.String.format;
import static org.slf4j.LoggerFactory.getLogger;

public class RemoveFolderRoute implements Route {

    private static final Logger logger = getLogger(RemoveFolderRoute.class);

    private final FileMetadataStorage fileMetadataStorage;
    private final FileContentStorage fileContentStorage;
    private final FolderStorage folderStorage;

    public RemoveFolderRoute(FileMetadataStorage fileMetadataStorage,
                             FileContentStorage fileContentStorage,
                             FolderStorage folderStorage) {

        this.fileMetadataStorage = fileMetadataStorage;
        this.fileContentStorage = fileContentStorage;
        this.folderStorage = folderStorage;
    }

    @Override
    public Object handle(Request request, Response response) {

        try {

            String folderIdRaw = request.params("folderId");
            FolderId folderId = new FolderId(folderIdRaw);
            RemoveFolder command = new RemoveFolder(folderId);
            FolderRemoving process = new FolderRemoving(fileMetadataStorage, fileContentStorage, folderStorage);
            process.handle(command);

            return SUCCESS;

        } catch (FolderNotFoundException e) {

            if (logger.isErrorEnabled()) {
                logger.error("Folder not found: {}.", e.getMessage());
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
