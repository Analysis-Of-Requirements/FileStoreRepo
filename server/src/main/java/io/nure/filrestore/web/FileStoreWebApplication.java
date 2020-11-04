package io.nure.filrestore.web;

import io.nure.filestore.storage.FolderStorage;
import io.nure.filestore.storage.LoggedInUsersStorage;
import io.nure.filestore.storage.Storage;
import io.nure.filestore.storage.UserStorage;
import org.slf4j.Logger;

import static org.slf4j.LoggerFactory.getLogger;

/**
 * The FileHub web application. Initializes {@link Storage}s and {@link SparkStarter}.
 */
public class FileStoreWebApplication {

    private static final Logger logger = getLogger(FileStoreWebApplication.class);

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
        SparkStarter starter = new SparkStarter(
                userStorage,
                loggedInUsersStorage,
                folderStorage
        );

        starter.start();
    }

    public static void main(String[] args) {

        new FileStoreWebApplication().run();
    }
}
