package filestore.web;

import io.nure.filestore.api.LoggedInUser;

/**
 * The storage of currently {@link LoggedInUser}s. One {@link Thread} can have no more than one {@link LoggedInUser} at
 * a time.
 */
public final class CurrentLoggedInUser {

    /**
     * Actual storage of {@link LoggedInUser}s.
     */
    private static final ThreadLocal<LoggedInUser> userStorage = new ThreadLocal<>();

    /**
     * This allows only static reference to class, because there is no use of the instance of this class.
     */
    private CurrentLoggedInUser() {
    }

    /**
     * Specifies currently {@link LoggedInUser}.
     *
     * @param loggedInUser logged-in user to set.
     */
    public static void setUser(LoggedInUser loggedInUser) {

        userStorage.set(loggedInUser);
    }

    /**
     * Retrieves currently {@link LoggedInUser}.
     *
     * @return currently logged-in user.
     */
    public static LoggedInUser user() {

        return userStorage.get();
    }
}
