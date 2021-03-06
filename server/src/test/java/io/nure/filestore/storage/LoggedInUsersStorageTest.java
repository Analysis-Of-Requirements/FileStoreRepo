package io.nure.filestore.storage;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;


import static com.google.common.truth.Truth.assertWithMessage;
import static io.nure.filestore.api.IdGenerator.generateId;
import static io.nure.filestore.api.ExpirationTimeCreator.expireAfterDays;
import static java.util.Arrays.stream;

@DisplayName("TokenStorage should ")
class LoggedInUsersStorageTest {

    private static Token createToken() {

        return new Token(generateId());
    }

    private static LoggedInUserRecord createRecord(Token token) {

        return new LoggedInUserRecord(token, new io.nure.filestore.storage.UserId(generateId()), expireAfterDays(2));
    }

    private static LoggedInUsersStorage createStorage(LoggedInUserRecord... records) {

        LoggedInUsersStorage storage = new LoggedInUsersStorage();

        stream(records).forEach(storage::put);

        return storage;
    }

    private static LoggedInUserRecord[] createDifferentRecords() {

        int n = 10;
        LoggedInUserRecord[] records = new LoggedInUserRecord[n];

        for (int i = 0; i < n; ++i) {

            records[i] = createRecord(createToken());
        }

        return records;
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

    @DisplayName("retrieve record by token.")
    @Test
    void testRetrievingRecordById() {

        Token token = createToken();
        LoggedInUserRecord expectedRecord = createRecord(token);
        LoggedInUsersStorage storage = createStorage(expectedRecord);

        assertWithMessage("Cannot retrieve record by token.")
            .that(storage.get(token).isPresent())
            .isTrue();
    }

    @DisplayName("return empty object if no record is found by passed token.")
    @Test
    void testRetrievingNotExistingRecord() {

        LoggedInUsersStorage storage = createStorage();

        assertWithMessage("Cannot return empty record for not-existing token.")
            .that(storage.get(createToken()).isPresent())
            .isFalse();
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
