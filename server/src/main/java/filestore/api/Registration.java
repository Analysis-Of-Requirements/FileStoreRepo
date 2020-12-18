package filestore.api;

import io.nure.filestore.storage.FolderId;
import io.nure.filestore.storage.FolderName;
import io.nure.filestore.storage.FolderRecord;
import io.nure.filestore.storage.FolderStorage;
import io.nure.filestore.storage.UserId;
import io.nure.filestore.storage.UserRecord;
import io.nure.filestore.storage.UserStorage;
import io.nure.filestore.web.FileHubWebApplication;
import org.slf4j.Logger;

import static com.google.common.base.Preconditions.checkNotNull;
import static io.nure.filestore.api.HashEncoder.encode;
import static io.nure.filestore.api.IdGenerator.generateId;
import static org.slf4j.LoggerFactory.getLogger;

/**
 * A {@link ApplicationProcess} for registration users into the FileHub application
 * {@link FileHubWebApplication}. Executes {@link RegisterUser} command.
 */
public class Registration implements ApplicationProcess {

    private static final Logger logger = getLogger(Registration.class);

    /**
     * Storage of users {@link UserStorage}.
     */
    private final UserStorage userStorage;

    /**
     * Storage of folders {@link FolderStorage}.
     */
    private final FolderStorage folderStorage;

    /**
     * Instantiates Registration process.
     *
     * @param storage - reference to user storage.
     */
    public Registration(UserStorage storage, FolderStorage folderStorage) {

        if (logger.isInfoEnabled()) {
            logger.info("Creating Registration process with {}.", storage);
        }

        this.userStorage = checkNotNull(storage);
        this.folderStorage = checkNotNull(folderStorage);
    }

    /**
     * Executes {@link RegisterUser} command to register {@link UserRecord} in {@link UserStorage}.
     *
     * @param command - {@link RegisterUser} command.
     */
    public void handle(RegisterUser command) throws UserAlreadyExistsException {

        if (logger.isInfoEnabled()) {
            logger.info("Call to Registration.handle({}).", command);
        }

        checkNotNull(command);

        UserId userId = new UserId(generateId());
        String encodedPassword = encode(command.password().value());

        userStorage
            .get(command.login())
            .ifPresent(record -> {

                throw new UserAlreadyExistsException(format(
                    "There is already a user registered with such login name: %s.",
                    command.login().value()
                ));
            });

        UserRecord record = new UserRecord(userId, command.login(), encodedPassword);
        userStorage.put(record);

        FolderRecord rootFolder = createRootFolder(record.identifier());
        folderStorage.put(rootFolder);

        if (logger.isInfoEnabled()) {
            logger.info("User registered. {}.", command);
        }
    }

    /**
     * Creates record of {@link Folder} for user with {@link UserId}.
     *
     * @param ownerId identifier of owner of the folder.
     * @return create record of root folder.
     */
    private FolderRecord createRootFolder(UserId ownerId) {

        return new FolderRecord(
            new FolderId(generateId()),
            new FolderName("Root"),
            null,
            ownerId
        );
    }
}
