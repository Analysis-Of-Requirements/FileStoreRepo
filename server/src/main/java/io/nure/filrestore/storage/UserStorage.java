package io.nure.filrestore.storage;

import java.util.Optional;

import static com.google.common.base.Preconditions.checkNotNull;

/**
 * A {@link Storage} of {@link UserRecord}s. Each record is identified by {@link UserId}.
 */
public class UserStorage extends InMemoryStorage<UserId, UserRecord> {

    /**
     * Retrieves {@link UserRecord} from the storage by passed {@link LoginName}.
     *
     * @param loginName - login name of queried record.
     * @return retrieved record wrapped in {@link Optional} or {@link Optional#empty()} if it was not found.
     */
    public Optional<UserRecord> get(LoginName loginName) {

        checkNotNull(loginName);

        return getAll()
            .stream()
            .filter(userRecord -> userRecord.loginName().equals(loginName))
            .findFirst();
    }

    /**
     * Retrieves {@link UserRecord} from the storage by passed {@link LoginName} and hash of
     * {@link Password}.
     *
     * @param loginName    a user login name.
     * @param passwordHash hash of password.
     * @return retrieved record wrapped in {@link Optional} or {@link Optional#empty()} if it was not found.
     */
    public Optional<UserRecord> get(LoginName loginName, String passwordHash) {

        checkNotNull(loginName);
        checkNotNull(passwordHash);

        return getAll()
            .stream()
            .filter(userRecord -> userRecord.loginName().equals(loginName)
                && userRecord.passwordHash().equals(passwordHash))
            .findFirst();
    }
}
