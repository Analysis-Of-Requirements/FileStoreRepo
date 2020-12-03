package filestore.storage;

/**
 * A {@link Storage} of {@link LoggedInUserRecord}s. Each record is identified by {@link Token}.
 */
public class LoggedInUsersStorage extends InMemoryStorage<Token, LoggedInUserRecord> {
}
