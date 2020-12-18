package filestore.web;

import io.nure.filestore.storage.FileContentStorage;
import io.nure.filestore.storage.FileMetadataStorage;
import io.nure.filestore.storage.FolderStorage;
import io.nure.filestore.storage.LoggedInUsersStorage;
import io.nure.filestore.storage.Storage;
import io.nure.filestore.storage.UserStorage;
import org.slf4j.Logger;

import static org.slf4j.LoggerFactory.getLogger;

/**
 * The FileHub web application. Initializes {@link Storage}s and {@link SparkStarter}.
 */
public class FileHubWebApplication {

    private static final Logger logger = getLogger(FileHubWebApplication.class);

    /**
     * Runs web application.
     */
    public void run() {

        if (logger.isInfoEnabled()) {
            logger.info("Call to FileHubWebApplication.run().");
        }

        UserStorage userStorage = new UserStorage();
        LoggedInUsersStorage loggedInUsersStorage = new LoggedInUsersStorage();
        FolderStorage folderStorage = new FolderStorage();
        FileMetadataStorage fileMetadataStorage = new FileMetadataStorage();
        FileContentStorage fileContentStorage = new FileContentStorage();
        SparkStarter starter = new SparkStarter(
            userStorage,
            loggedInUsersStorage,
            folderStorage,
            fileMetadataStorage,
            fileContentStorage
        );

        starter.start();
    }

    public static void main(String[] args) {

        new FileHubWebApplication().run();
    }
}
