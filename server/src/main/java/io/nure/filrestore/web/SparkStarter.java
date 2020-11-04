package io.nure.filrestore.web;

import io.nure.filestore.storage.FolderStorage;
import io.nure.filestore.storage.LoggedInUserRecord;
import io.nure.filestore.storage.LoggedInUsersStorage;
import io.nure.filestore.storage.Storage;
import io.nure.filestore.storage.UserStorage;
import org.slf4j.Logger;
import spark.Filter;
import spark.Request;
import spark.Route;
import spark.Spark;

import static com.google.common.base.Preconditions.checkNotNull;
import static java.util.Arrays.asList;
import static org.slf4j.LoggerFactory.getLogger;
import static spark.Spark.before;
import static spark.Spark.get;
import static spark.Spark.path;
import static spark.Spark.port;
import static spark.Spark.post;
import static spark.Spark.staticFiles;

/**
 * The starter of web part of FileHub application {@link FileStoreWebApplication}, built upon {@link Spark}.
 * Configures routes {@link Route} to start handling requests {@link Request}.
 */
public class SparkStarter {

    private static final Logger logger = getLogger(SparkStarter.class);

    /**
     * Default port which server can start listening.
     */
    private final static int DEFAULT_PORT = 802;

    /**
     * The {@link Storage} of users {@link UserStorage}.
     */
    private final UserStorage userStorage;

    /**
     * The {@link Storage} of {@link LoggedInUserRecord}s.
     */
    private final LoggedInUsersStorage loggedInUsers;

    /**
     * The {@link Storage} of folders {@link FolderStorage}.
     */
    private final FolderStorage folderStorage;

    /**
     * Instantiates SparkStarter.
     *
     * @param userStorage   storage of registered users.
     * @param loggedInUsers storage of logged in users.
     */
    public SparkStarter(
            UserStorage userStorage,
            LoggedInUsersStorage loggedInUsers,
            FolderStorage folderStorage
    ) {

        if (logger.isInfoEnabled()) {
            logger.info("Creating SparkStarter.");
        }

        this.userStorage = checkNotNull(userStorage);
        this.loggedInUsers = checkNotNull(loggedInUsers);
        this.folderStorage = checkNotNull(folderStorage);
    }

    /**
     * Starts web part of application.
     */
    public void start() {

        if (logger.isInfoEnabled()) {
            logger.info("Call to SparkStarter.start().");
        }

        port(DEFAULT_PORT);
        staticFiles.location("/public");

        initializeFilters();
        initializeRoutes();
    }

    /**
     * Initializes {@link Filter}s of {@link Request}s.
     */
    private void initializeFilters() {

        asList("/root", "/folder/:folderId")
                .forEach(path -> before("/api" + path, new UserAuthenticationFilter(loggedInUsers)));

        before("/api/*", new LogRequestInfoFilter());

        if (logger.isInfoEnabled()) {
            logger.info("Initialized Spark filters.");
        }
    }

    /**
     * Initializes {@link Route}s.
     */
    private void initializeRoutes() {

        path("/api", () -> {
            post("/registration", new RegistrationRoute(userStorage, folderStorage));
            post("/login", new AuthenticationRoute(userStorage, loggedInUsers));
            get("/root", new GetRootFolderRoute(folderStorage));
            get("/folder/:folderId", new GetFolderRoute(folderStorage));
        });

        if (logger.isInfoEnabled()) {
            logger.info("Initialized Spark routes.");
        }
    }
}
