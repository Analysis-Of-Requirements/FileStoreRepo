package io.nure.filestore.storage;

import com.google.common.collect.ImmutableList;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static com.google.common.truth.Truth.assertWithMessage;
import static io.nure.filestore.api.IdGenerator.generateId;
import static java.util.Arrays.stream;

class FolderStorageTest {

    private static UserId createUserId() {

        return new UserId(generateId());
    }

    private static FolderId createFolderId() {

        return new FolderId(generateId());
    }

    private static FolderRecord createFolderRecord() {

        return createFolderRecord(createFolderId(), createUserId());
    }

    private static FolderRecord createFolderRecord(FolderId folderId) {

        return createFolderRecord(folderId, null, createUserId());
    }

    private static FolderRecord createFolderRecord(FolderId folderId, UserId userId) {

        return createFolderRecord(folderId, null, userId);
    }

    private static FolderRecord createFolderRecord(FolderId folderId, FolderId parentId, UserId userId) {

        return new FolderRecord(
            folderId,
            new FolderName(""),
            parentId,
            userId
        );
    }

    private static FolderStorage createStorage(FolderRecord... records) {

        FolderStorage storage = new FolderStorage();

        stream(records).forEach(storage::put);

        return storage;
    }

    private static FolderRecord[] createDifferentFolderRecords() {

        int n = 10;
        FolderRecord[] records = new FolderRecord[n];

        for (int i = 0; i < n; ++i) {

            records[i] = createFolderRecord(createFolderId());
        }

        return records;
    }

    @DisplayName("put new record.")
    @Test
    void testPuttingNewRecord() {

        FolderId folderId = createFolderId();
        FolderRecord record = createFolderRecord(folderId);
        FolderStorage storage = createStorage();

        storage.put(record);

        assertWithMessage("Cannot put new record to storage.")
            .that(storage.get(folderId).get())
            .isEqualTo(record);
    }

    @DisplayName("replace record with the same identifier.")
    @Test
    void testReplacingRecord() {

        FolderId folderId = createFolderId();
        FolderRecord formerRecord = createFolderRecord(folderId);
        FolderRecord expectedRecord = createFolderRecord(folderId);
        FolderStorage storage = createStorage(formerRecord);

        storage.put(expectedRecord);

        assertWithMessage("Cannot replace existing record in the storage.")
            .that(storage.get(folderId).get())
            .isEqualTo(expectedRecord);
    }

    @DisplayName("retrieve record by an identifier.")
    @Test
    void testRetrievingRecordById() {

        FolderId folderId = createFolderId();
        FolderRecord expectedRecord = createFolderRecord(folderId);
        FolderStorage storage = createStorage(expectedRecord);

        assertWithMessage("Cannot retrieve record by identifier.")
            .that(storage.get(folderId).isPresent())
            .isTrue();
    }

    @DisplayName("return empty object if no record is found by passed identifier.")
    @Test
    void testRetrievingNotExistingRecord() {

        FolderStorage storage = createStorage();

        assertWithMessage("Cannot return empty record if it doesn't exist.")
            .that(storage.get(createFolderId()).isPresent())
            .isFalse();
    }

    @DisplayName("retrieve all registered records.")
    @Test
    void testRetrievingAllRecords() {

        FolderRecord[] expectedRecords = createDifferentFolderRecords();
        FolderStorage storage = createStorage(expectedRecords);

        assertWithMessage("Cannot retrieve all registered records.")
            .that(storage.getAll())
            .containsExactlyElementsIn(expectedRecords);
    }

    @DisplayName("delete existing record.")
    @Test
    void testDeletingExistingRecord() {

        FolderId folderId = createFolderId();
        FolderRecord record = createFolderRecord(folderId);
        FolderStorage storage = createStorage(record);

        assertWithMessage("Cannot delete existing record.")
            .that(storage.delete(folderId).isPresent())
            .isTrue();
    }

    @DisplayName("not delete not-existing record.")
    @Test
    void testDeletingNotExistingRecord() {

        FolderStorage storage = createStorage();

        assertWithMessage("Cannot return empty record.")
            .that(storage.delete(createFolderId()).isPresent())
            .isFalse();
    }

    @DisplayName("retrieve root folder by user identifier.")
    @Test
    void testRetrievingRootFolder() {

        FolderRecord record = createFolderRecord(createFolderId());
        FolderStorage storage = createStorage(record);

        assertWithMessage("Cannot retrieve root folder of user.")
            .that(storage.getRoot(record.ownerId()).isPresent())
            .isTrue();
    }

    @DisplayName("return empty object when retrieving not-existing root folder.")
    @Test
    void testRetrievingNotExistingRootFolder() {

        FolderRecord record = createFolderRecord(createFolderId());
        FolderStorage storage = createStorage();

        assertWithMessage("Cannot retrieve root folder of user.")
            .that(storage.getRoot(record.ownerId()).isPresent())
            .isFalse();
    }

    @DisplayName("retrieve children of parent folder.")
    @Test
    void testRetrievingChildrenFolders() {

        FolderRecord rootFolder = createFolderRecord();
        FolderRecord childFolder = createFolderRecord(createFolderId(), rootFolder.identifier(), createUserId());
        FolderStorage storage = createStorage(rootFolder, childFolder);

        assertWithMessage("Cannot retrieve root folder of user.")
            .that(storage.getChildren(rootFolder.identifier()))
            .containsExactlyElementsIn(ImmutableList.of(childFolder));
    }

    @DisplayName("retrieve record by identifiers of folder and its owner.")
    @Test
    void testRetrievingRecordByFolderIdAndUserId() {

        FolderId folderId = createFolderId();
        UserId userId = createUserId();
        FolderRecord expectedRecord = createFolderRecord(folderId, userId);
        FolderStorage storage = createStorage(expectedRecord);

        assertWithMessage("Cannot retrieve record by identifiers of folder and its owner.")
            .that(storage.get(folderId, userId).isPresent())
            .isTrue();
    }

    @DisplayName("return empty object if no record is found by passed folder identifier and owner identifier.")
    @Test
    void testRetrievingNotExistingRecordByFolderIdAndUserId() {

        FolderStorage storage = createStorage();

        assertWithMessage("Cannot return empty record if it doesn't exist.")
            .that(storage.get(createFolderId(), createUserId()).isPresent())
            .isFalse();
    }
}
