package filestore.api;

import io.nure.filestore.storage.LoggedInUsersStorage;
import io.nure.filestore.storage.Token;

public class UserLoggingOut implements ApplicationProcess {

    private final LoggedInUsersStorage loggedInUsersStorage;

    public UserLoggingOut(LoggedInUsersStorage loggedInUsersStorage) {

        this.loggedInUsersStorage = loggedInUsersStorage;
    }

    public void handle(LogOutUser command) {
        Token token = command.getToken();
        loggedInUsersStorage.delete(token);
    }
}
