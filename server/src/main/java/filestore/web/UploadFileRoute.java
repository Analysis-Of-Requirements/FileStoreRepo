package filestore.web;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import io.nure.filestore.api.FileContent;
import io.nure.filestore.api.FileMetadata;
import io.nure.filestore.api.FileUploading;
import io.nure.filestore.api.Folder;
import io.nure.filestore.api.FolderNotFoundException;
import io.nure.filestore.api.LoggedInUser;
import io.nure.filestore.api.MimeType;
import io.nure.filestore.api.OwnershipViolatedException;
import io.nure.filestore.api.UploadFile;
import io.nure.filestore.storage.FileContentStorage;
import io.nure.filestore.storage.FileMetadataStorage;
import io.nure.filestore.storage.FileName;
import io.nure.filestore.storage.FileSize;
import io.nure.filestore.storage.FolderId;
import io.nure.filestore.storage.FolderStorage;
import io.nure.filestore.storage.UserId;
import org.slf4j.Logger;
import spark.Request;
import spark.Response;
import spark.Route;

import javax.servlet.MultipartConfigElement;
import javax.servlet.ServletException;
import javax.servlet.http.Part;
import java.io.IOException;
import java.io.InputStream;

import static com.google.common.base.Preconditions.checkNotNull;
import static com.google.common.io.ByteStreams.toByteArray;
import static io.nure.filestore.web.ResponseStatus.BAD_REQUEST;
import static io.nure.filestore.web.ResponseStatus.FORBIDDEN;
import static io.nure.filestore.web.ResponseStatus.INTERNAL_SERVER_ERROR;
import static io.nure.filestore.web.ResponseStatus.NOT_FOUND;
import static io.nure.filestore.web.ResponseStatus.SUCCESS;
import static org.slf4j.LoggerFactory.getLogger;

/**
 * The {@link Route} that handles client {@link Request}s to upload files.
 */
public class UploadFileRoute implements Route {

    private static final Logger logger = getLogger(UploadFileRoute.class);

    /**
     * The name of the parameter, that maps to a {@link FolderId} in the path to the {@link Route}.
     */
    private static final String FOLDER_ID_PARAMETER = "folderId";

    /**
     * The name of the {@link Part} of the {@link Request} that maps to the uploaded {@link FileContent}.
     */
    private static final String FILE_PART_NAME = "file";

    /**
     * The 'Content-Type' header name.
     */
    private static final String CONTENT_TYPE = "Content-Type";

    /**
     * The converter of Java {@link Object}s into their JSON representation.
     */
    private final Gson jsonConverter = createJsonConverter();

    /**
     * An instance of {@link FolderStorage}.
     */
    private final FolderStorage folderStorage;

    /**
     * An instance of {@link FileMetadataStorage}.
     */
    private final FileMetadataStorage fileMetadataStorage;

    /**
     * An instance of {@link FileContentStorage}.
     */
    private final FileContentStorage fileContentStorage;

    /**
     * Creates instance of the UploadFileRoute with provided storages.
     *
     * @param folderStorage       an instance of {@link FolderStorage}.
     * @param fileMetadataStorage an instance of {@link FileMetadataStorage}.
     * @param fileContentStorage  an instance of {@link FileContentStorage}.
     */
    public UploadFileRoute(
        FolderStorage folderStorage,
        FileMetadataStorage fileMetadataStorage,
        FileContentStorage fileContentStorage
    ) {

        this.folderStorage = checkNotNull(folderStorage);
        this.fileMetadataStorage = checkNotNull(fileMetadataStorage);
        this.fileContentStorage = checkNotNull(fileContentStorage);

        logDebug("Created instance of the UploadFileRoute.");
    }

    /**
     * Handles client {@link Request} to upload file with provided {@link FileContent} into destination {@link Folder}.
     *
     * @param request  the client {@link Request}.
     * @param response the server {@link Response}.
     * @return uploaded {@link FileMetadata} as JSON {@link String} for successful response. Or {@link String} error
     * message in case of failed file uploading.
     */
    @Override
    public Object handle(Request request, Response response) {

        LoggedInUser loggedInUser = getLoggedInUser();
        FolderId destinationFolderId = getDestinationFolderId(request);

        try {

            FileContent fileContentToUpload = getFileContent(request);
            UploadFile command = createCommand(request, destinationFolderId, loggedInUser, fileContentToUpload);

            logDebug("Created UploadFile command: {}.", command);

            FileUploading process = createProcess();
            FileMetadata uploadedFile = process.handle(command);

            logInfo("Uploaded file: {}.", uploadedFile);

            return sendSuccessfulResponse(response, uploadedFile);

        } catch (IOException e) {

            String errorMessage = "An error occurred when reading client request.";

            logInfo(errorMessage);
            logDebug(e.getMessage());

            sendInternalServerErrorResponse(response);

            return errorMessage;

        } catch (ServletException e) {

            String errorMessage = "Client request is not of type 'multipart/form-data'.";

            logInfo(errorMessage);
            logDebug(e.getMessage());

            sendBadRequestResponse(response);

            return errorMessage;

        } catch (FolderNotFoundException e) {

            String errorMessage = format("Destination folder was not found by id \"%s\".", destinationFolderId.value());

            logInfo(errorMessage);
            logDebug(e.getMessage());

            sendNotFoundResponse(response);

            return errorMessage;

        } catch (OwnershipViolatedException e) {

            String errorMessage = format(
                "User with id \"%s\" is not the owner of the folder with id \"%s\".",
                loggedInUser.identifier().value(),
                destinationFolderId.value()
            );

            logInfo(errorMessage);
            logDebug(e.getMessage());

            sendForbiddenResponse(response);

            return errorMessage;
        }
    }

    /**
     * Creates JSON converter with registered {@link FileMetadataSerializer}.
     *
     * @return created JSON converter.
     */
    private Gson createJsonConverter() {

        return new GsonBuilder()
            .registerTypeAdapter(FileMetadata.class, new FileMetadataSerializer())
            .create();
    }

    /**
     * Retrieves {@link LoggedInUser} from the {@link CurrentLoggedInUser}.
     *
     * @return retrieved logged-in user.
     */
    private LoggedInUser getLoggedInUser() {

        return CurrentLoggedInUser.user();
    }

    /**
     * Retrieves a {@link FolderId} of the destination {@link Folder} from the {@link Request}.
     *
     * @param clientRequest the request containing the identifier of the destination {@link Folder}.
     * @return retrieved {@link FolderId} of the destination {@link Folder}.
     */
    private FolderId getDestinationFolderId(Request clientRequest) {

        return new FolderId(clientRequest.params(FOLDER_ID_PARAMETER));
    }

    /**
     * Retrieves {@link FileContent} from the {@link Request}.
     *
     * @param request the client {@link Request}, containing {@link FileContent}.
     * @return retrieved {@link FileContent}.
     * @throws IOException      if an I/O exception occurred during the reading of the requested {@link Part}.
     * @throws ServletException if the {@link Request} is not of type {@code multipart/form-data}.
     */
    private FileContent getFileContent(Request request) throws IOException, ServletException {

        // The required action to explicitly tell the Jetty to treat the request as 'multipart/form-data'.
        // Otherwise, 'null' is received from {@code request.raw().getPart(FILE_PART_NAME)}.
        request.attribute("org.eclipse.jetty.multipartConfig", new MultipartConfigElement("/temp"));

        InputStream fileContentInputStream = request
            .raw()
            .getPart(FILE_PART_NAME)
            .getInputStream();

        return new FileContent(toByteArray(fileContentInputStream));
    }

    /**
     * Creates the {@link UploadFile} command with required data.
     *
     * @param request        the client {@link Request}.
     * @param parentFolderId the {@link FolderId} of the parent {@link Folder} of the uploading file.
     * @param loggedInUser   the {@link LoggedInUser} that is the owner of the uploading file.
     * @param fileContent    the {@link FileContent} of the uploading file.
     * @return the created {@link UploadFile} command.
     * @throws IOException      if an I/O exception occurred during the reading of the requested {@link Part}.
     * @throws ServletException if the {@link Request} is not of type {@code multipart/form-data}.
     */
    private UploadFile createCommand(
        Request request,
        FolderId parentFolderId,
        LoggedInUser loggedInUser,
        FileContent fileContent
    ) throws IOException, ServletException {

        Part file = request
            .raw()
            .getPart(FILE_PART_NAME);

        FileName name = new FileName(file.getSubmittedFileName());
        MimeType mimeType = new MimeType(file.getHeader(CONTENT_TYPE));
        FileSize size = new FileSize(file.getSize());
        UserId ownerId = loggedInUser.identifier();

        return new UploadFile(name, mimeType, size, parentFolderId, ownerId, fileContent);
    }

    /**
     * Creates the {@link FileUploading} process.
     *
     * @return the created {@link FileUploading} process.
     */
    private FileUploading createProcess() {

        return new FileUploading(folderStorage, fileMetadataStorage, fileContentStorage);
    }

    /**
     * Sends {@link Response} with uploaded {@link FileMetadata}.
     *
     * @param response     the successful server {@link Response}.
     * @param uploadedFile the uploaded {@link FileMetadata}.
     * @return the uploaded {@link FileMetadata} as JSON {@link String}.
     */
    private String sendSuccessfulResponse(Response response, FileMetadata uploadedFile) {

        response.status(SUCCESS);

        return jsonConverter.toJson(uploadedFile, FileMetadata.class);
    }

    /**
     * Sends 'Internal Server Error' {@link Response}.
     *
     * @param response the server {@link Response}.
     */
    private void sendInternalServerErrorResponse(Response response) {

        response.status(INTERNAL_SERVER_ERROR);
    }

    /**
     * Sends 'Bad Request' {@link Response}.
     *
     * @param response the server {@link Response}
     */
    private void sendBadRequestResponse(Response response) {

        response.status(BAD_REQUEST);
    }

    /**
     * Sends 'Not Found' {@link Response}.
     *
     * @param response the server {@link Response}.
     */
    private void sendNotFoundResponse(Response response) {

        response.status(NOT_FOUND);
    }

    /**
     * Sends 'Forbidden' {@link Response}.
     *
     * @param response the server {@link Response}.
     */
    private void sendForbiddenResponse(Response response) {

        response.status(FORBIDDEN);
    }

    /**
     * Logs message at 'Info' level.
     *
     * @param message          the message to log.
     * @param messageArguments the message arguments.
     */
    private void logInfo(String message, Object... messageArguments) {

        if (logger.isInfoEnabled()) {
            logger.info(message, messageArguments);
        }
    }

    /**
     * Logs message at 'Debug' level.
     *
     * @param message          the message to log.
     * @param messageArguments the message arguments.
     */
    private void logDebug(String message, Object... messageArguments) {

        if (logger.isDebugEnabled()) {
            logger.debug(message, messageArguments);
        }
    }
}
