package io.nure.filestore.api;


import io.nure.filestore.storage.UserId;
import io.nure.filrestore.api.ExpirationTimeCreator;
import io.nure.filrestore.api.TokenExpirationProxy;
import io.nure.filrestore.api.TokenExpiredException;
import io.nure.filrestore.api.TokenNotFoundException;
import io.nure.filrestore.storage.ExpirationTime;
import io.nure.filrestore.storage.LoggedInUserRecord;
import io.nure.filrestore.storage.LoggedInUsersStorage;
import io.nure.filrestore.storage.Token;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;


import static com.google.common.truth.Truth.assertWithMessage;
import static io.nure.filestore.api.IdGenerator.generateId;
import static java.time.Instant.EPOCH;
import static java.util.Arrays.stream;
import static org.junit.jupiter.api.Assertions.assertThrows;

@DisplayName("TokenExpirationProxy should ")
class TokenExpirationProxyTest {

    private static LoggedInUsersStorage createStorage(LoggedInUserRecord... records) {

        LoggedInUsersStorage storage = new LoggedInUsersStorage();

        stream(records).forEach(storage::put);

        return storage;
    }

    private static LoggedInUserRecord createRecord(Token token, boolean expired) {

        int days = 2;

        return new LoggedInUserRecord(token, new UserId(generateId()),
            expired ? new ExpirationTime(EPOCH) : ExpirationTimeCreator.expireAfterDays(days));
    }

    private static Token createToken() {

        return new Token(generateId());
    }

    private TokenExpirationProxy createTokenExpirationProxy(LoggedInUsersStorage storage) {

        return new TokenExpirationProxy(storage);
    }

    private static LoggedInUserRecord createRecord(Token token) {

        return new LoggedInUserRecord(token, new UserId(generateId()), ExpirationTimeCreator.expireAfterDays(2));
    }

    private static LoggedInUserRecord[] createDifferentRecords() {

        int n = 10;
        LoggedInUserRecord[] records = new LoggedInUserRecord[n];

        for (int i = 0; i < n; ++i) {

            records[i] = createRecord(createToken());
        }

        return records;
    }

    @DisplayName("retrieve user record with valid expiration time.")
    @Test
    void testSuccessfulRetrieval() {

        Token token = createToken();
        TokenExpirationProxy proxy = createTokenExpirationProxy(createStorage(createRecord(token, false)));

        Assertions.assertDoesNotThrow(
            () -> proxy.get(token),
            "Cannot retrieve existing record by valid token."
        );
    }

    @DisplayName("fail if the record with passed token doesn't exist.")
    @Test
    void testWithNotIssuedToken() {

        TokenExpirationProxy proxy = new TokenExpirationProxy(createStorage());

        assertThrows(
            TokenNotFoundException.class,
            () -> proxy.get(createToken()),
            "Cannot fail if the record with token was not found."
        );
    }

    @DisplayName("fail if passed token has expired.")
    @Test
    void testExpiredToken() {

        Token token = createToken();
        TokenExpirationProxy proxy = new TokenExpirationProxy(createStorage(createRecord(token, true)));

        assertThrows(
            TokenExpiredException.class,
            () -> proxy.get(token),
            "Cannot fail if token has expired."
        );
    }

    @DisplayName("put new record.")
    @Test
    void testPuttingNewRecord() {

        Token token = createToken();
        LoggedInUserRecord record = createRecord(token);
        LoggedInUsersStorage storage = createStorage();

        storage.put(record);

        assertWithMessage("Cannot put new record to storage.")
            .that(storage.get(token).get())
            .isEqualTo(record);
    }

    @DisplayName("replace record with the same token.")
    @Test
    void testReplacingRecord() {

        Token token = createToken();
        LoggedInUserRecord formerRecord = createRecord(token);
        LoggedInUserRecord expectedRecord = createRecord(token);
        LoggedInUsersStorage storage = createStorage(formerRecord);

        storage.put(expectedRecord);

        assertWithMessage("Cannot replace existing record in the storage.")
            .that(storage.get(token).get())
            .isEqualTo(expectedRecord);
    }

    @DisplayName("retrieve all registered records.")
    @Test
    void testRetrievingAllRecords() {

        LoggedInUserRecord[] expectedRecords = createDifferentRecords();
        LoggedInUsersStorage storage = createStorage(expectedRecords);

        assertWithMessage("Cannot retrieve all registered records.")
            .that(storage.getAll())
            .containsExactlyElementsIn(expectedRecords);
    }

    @DisplayName("delete existing record.")
    @Test
    void testDeletingExistingRecord() {

        Token token = createToken();
        LoggedInUserRecord record = createRecord(token);
        LoggedInUsersStorage storage = createStorage(record);

        assertWithMessage("Cannot delete existing record.")
            .that(storage.delete(token).isPresent())
            .isTrue();
    }

    @DisplayName("not delete not-existing record.")
    @Test
    void testDeletingNotExistingRecord() {

        LoggedInUsersStorage storage = createStorage();

        assertWithMessage("Cannot return empty record.")
            .that(storage.delete(createToken()).isPresent())
            .isFalse();
    }
}
