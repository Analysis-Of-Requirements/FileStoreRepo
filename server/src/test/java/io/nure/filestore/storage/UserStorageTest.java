package io.nure.filestore.storage;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static com.google.common.truth.Truth.assertWithMessage;
import static java.lang.String.format;
import static java.util.Arrays.stream;
import static java.util.UUID.randomUUID;

@DisplayName("User Storage should ")
class UserStorageTest {

    private static UserId createUserId() {

        return new UserId(randomUUID().toString());
    }

    private static UserRecord createUserRecord(UserId userId, String login, String password) {

        return new UserRecord(userId, new LoginName(login), password);
    }

    private static UserStorage createStorage(UserRecord... records) {

        UserStorage storage = new UserStorage();

        stream(records).forEach(storage::put);

        return storage;
    }

    private static UserRecord[] createDifferentUserRecords() {

        int n = 10;
        UserRecord[] expectedRecords = new UserRecord[n];

        for (int i = 0; i < n; ++i) {

            expectedRecords[i] = createUserRecord(createUserId(), format("aaa%d", i), format("qwerty%d23A", i));
        }

        return expectedRecords;
    }

    private static LoginName createLoginName() {

        return new LoginName("login");
    }

    @DisplayName("put new record.")
    @Test
    void testPuttingNewRecord() {

        UserId userId = createUserId();
        UserRecord record = createUserRecord(userId, "login", "password");
        UserStorage storage = createStorage();

        storage.put(record);

        assertWithMessage("Cannot put new user record to storage.")
            .that(storage.get(userId).get())
            .isEqualTo(record);
    }

    @DisplayName("replace record with the same identifier.")
    @Test
    void testReplacingRecord() {

        UserId userId = createUserId();
        UserRecord formerRecord = createUserRecord(userId, "login1", "password1");
        UserRecord expectedRecord = createUserRecord(userId, "login2", "password2");
        UserStorage storage = createStorage(formerRecord);

        storage.put(expectedRecord);

        assertWithMessage("Cannot replace existing record in the storage.")
            .that(storage.get(userId).get())
            .isEqualTo(expectedRecord);
    }

    @DisplayName("retrieve record by identifier.")
    @Test
    void testRetrievingRecordById() {

        UserId userId = createUserId();
        UserRecord expectedRecord = createUserRecord(userId, "login", "password");
        UserStorage storage = createStorage(expectedRecord);

        assertWithMessage("Cannot retrieve user record by identifier.")
            .that(storage.get(userId).isPresent())
            .isTrue();
    }

    @DisplayName("return empty object if no record is found by passed identifier.")
    @Test
    void testRetrievingNotExistingRecord() {

        UserStorage storage = createStorage();

        assertWithMessage("Cannot return empty record for not-existing identifier.")
            .that(storage.get(createUserId()).isPresent())
            .isFalse();
    }

    @DisplayName("retrieve all registered records.")
    @Test
    void testRetrievingAllRecords() {

        UserRecord[] expectedRecords = createDifferentUserRecords();
        UserStorage storage = createStorage(expectedRecords);

        assertWithMessage("Cannot retrieve all registered records.")
            .that(storage.getAll())
            .containsExactlyElementsIn(expectedRecords);
    }

    @DisplayName("delete existing record.")
    @Test
    void testDeletingExistingRecord() {

        UserId userId = createUserId();
        UserRecord record = createUserRecord(userId, "login", "password");
        UserStorage storage = createStorage(record);

        assertWithMessage("Cannot delete existing record.")
            .that(storage.delete(userId).isPresent())
            .isTrue();
    }

    @DisplayName("attempt to delete not-existing record.")
    @Test
    void testDeletingNotExistingRecord() {

        UserStorage storage = createStorage();

        assertWithMessage("Cannot return empty record.")
            .that(storage.delete(createUserId()).isPresent())
            .isFalse();
    }

    @DisplayName("retrieve record by login name.")
    @Test
    void testRetrievingRecordByLogin() {

        LoginName loginName = createLoginName();
        UserRecord expectedRecord = createUserRecord(createUserId(), loginName.value(), "password");
        UserStorage storage = createStorage(expectedRecord);

        assertWithMessage("Cannot get record by login name.")
            .that(storage.get(loginName).isPresent())
            .isTrue();
    }

    @DisplayName("return empty object if no record is found by passed login name.")
    @Test
    void testRetrievingNotExistingRecordByLogin() {

        UserStorage storage = createStorage();

        assertWithMessage("Cannot return empty record.")
            .that(storage.get(createLoginName()).isPresent())
            .isFalse();
    }

    @DisplayName("retrieve record by login name and password hash.")
    @Test
    void testRetrievingRecordByLoginNameAndPasswordHash() {

        LoginName loginName = createLoginName();
        String passwordHash = "passwordHash";
        UserStorage storage = createStorage(createUserRecord(createUserId(), loginName.value(), passwordHash));

        assertWithMessage("Cannot get record by login name and password hash.")
            .that(storage.get(loginName, passwordHash).isPresent())
            .isTrue();
    }

    @DisplayName("return empty object if no record is found by passed login name and password hash.")
    @Test
    void testRetrievingNotExistingRecordByLoginNameAndPasswordHash() {

        UserStorage storage = createStorage();
        String passwordHash = "passwordHash";

        assertWithMessage("Cannot return empty record.")
            .that(storage.get(createLoginName(), passwordHash).isPresent())
            .isFalse();
    }
}
