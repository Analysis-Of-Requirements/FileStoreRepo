package filestore.web;

import com.google.gson.Gson;
import com.google.gson.JsonParseException;
import io.nure.filestore.api.FileNotFoundException;
import io.nure.filestore.api.FileRenaming;
import io.nure.filestore.api.OwnershipViolatedException;
import io.nure.filestore.api.RenameFile;
import io.nure.filestore.storage.FileMetadataStorage;
import org.slf4j.Logger;
import spark.Request;
import spark.Response;
import spark.Route;

import static com.google.common.base.Preconditions.checkNotNull;
import static io.nure.filestore.web.ResponseStatus.BAD_REQUEST;
import static io.nure.filestore.web.ResponseStatus.SUCCESS;
import static java.lang.String.format;
import static org.slf4j.LoggerFactory.getLogger;

public class RenameFileRoute implements Route {

    private static final Logger logger = getLogger(RenameFileRoute.class);
    private final FileMetadataStorage fileMetadataStorage;
    private final Gson jsonParser = new Gson();

    public RenameFileRoute(FileMetadataStorage fileMetadataStorage) {
        this.fileMetadataStorage = checkNotNull(fileMetadataStorage);
    }

    @Override
    public Object handle(Request request, Response response) {

        try {

            RenameFile renameFile = jsonParser.fromJson(request.body(), RenameFile.class);
            FileRenaming process = new FileRenaming(fileMetadataStorage);
            process.handle(renameFile);

            return SUCCESS;

        } catch (FileNotFoundException e) {

            if (logger.isErrorEnabled()) {
                logger.error("File not found: {}.", e.getMessage());
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
