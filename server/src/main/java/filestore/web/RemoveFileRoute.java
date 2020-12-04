package filestore.web;

import com.google.gson.JsonParseException;
import io.nure.filestore.api.FileNotFoundException;
import io.nure.filestore.api.FileRemoving;
import io.nure.filestore.api.RemoveFile;
import io.nure.filestore.storage.FileContentStorage;
import io.nure.filestore.storage.FileId;
import io.nure.filestore.storage.FileMetadataStorage;
import org.slf4j.Logger;
import spark.Request;
import spark.Response;
import spark.Route;

import static io.nure.filestore.web.ResponseStatus.BAD_REQUEST;
import static io.nure.filestore.web.ResponseStatus.SUCCESS;
import static java.lang.String.format;
import static org.slf4j.LoggerFactory.getLogger;

public class RemoveFileRoute implements Route {

    private static final Logger logger = getLogger(RemoveFileRoute.class);

    private final FileMetadataStorage fileMetadataStorage;
    private final FileContentStorage fileContentStorage;

    public RemoveFileRoute(FileMetadataStorage fileMetadataStorage, FileContentStorage fileContentStorage) {

        this.fileMetadataStorage = fileMetadataStorage;
        this.fileContentStorage = fileContentStorage;
    }

    @Override
    public Object handle(Request request, Response response) {

        try {

            String fileIdRaw = request.params("fileId");
            FileId fileId = new FileId(fileIdRaw);
            RemoveFile command = new RemoveFile(fileId);
            FileRemoving process = new FileRemoving(fileMetadataStorage, fileContentStorage);
            process.handle(command);

            return SUCCESS;

        } catch (FileNotFoundException e) {

            if (logger.isErrorEnabled()) {
                logger.error("File not found: {}.", e.getMessage());
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
