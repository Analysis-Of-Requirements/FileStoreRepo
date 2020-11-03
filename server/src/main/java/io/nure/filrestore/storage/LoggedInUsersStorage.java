package io.nure.filrestore.storage;

import io.nure.filestore.storage.InMemoryStorage;
import io.nure.filestore.storage.Storage;

/**
 * A {@link Storage} of {@link LoggedInUserRecord}s. Each record is identified by {@link Token}.
 */
public class LoggedInUsersStorage extends InMemoryStorage<Token, LoggedInUserRecord> {
}
