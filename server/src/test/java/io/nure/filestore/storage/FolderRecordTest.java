package io.nure.filestore.storage;

import com.google.common.testing.NullPointerTester;
import nl.jqno.equalsverifier.EqualsVerifier;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

@DisplayName("FolderRecord should ")
class FolderRecordTest {

    private NullPointerTester createNullPointerTester() {

        return new NullPointerTester()
            .setDefault(FolderId.class, new FolderId(""))
            .setDefault(FolderName.class, new FolderName(""))
            .setDefault(UserId.class, new UserId(""));
    }

    @DisplayName("not accept null values in constructor.")
    @Test
    void testPassingNullIdentifierToConstructor() {

        createNullPointerTester().testAllPublicConstructors(FolderRecord.class);
    }

    @DisplayName("have correct implementations of equals() and hashcode().")
    @Test
    void testEqualsAndHashCode() {

        EqualsVerifier.forClass(FolderRecord.class).verify();
    }
}
