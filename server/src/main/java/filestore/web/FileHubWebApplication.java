package filestore.web;

import io.nure.filestore.storage.FileContentPostgresStorage;
import io.nure.filestore.storage.FileMetadataPostgresStorage;
import io.nure.filestore.storage.FolderPostgresStorage;
import io.nure.filestore.storage.LoggedInUsersPostgresStorage;
import io.nure.filestore.storage.Storage;
import io.nure.filestore.storage.UsersPostgresStorage;
import org.slf4j.Logger;
import org.sql2o.Sql2o;

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

        Sql2o sql2o = new Sql2o("jdbc:postgresql://localhost:5432/filestore", "postgres", "1234");
        SparkStarter starter = new SparkStarter(
                new UsersPostgresStorage(sql2o),
                new LoggedInUsersPostgresStorage(sql2o),
                new FolderPostgresStorage(sql2o),
                new FileMetadataPostgresStorage(sql2o),
                new FileContentPostgresStorage(sql2o)
        );

        starter.start();
    }

    public static void main(String[] args) {

        new FileHubWebApplication().run();
    }
}
