package io.nure.filestore.storage;

import com.google.common.testing.NullPointerTester;
import nl.jqno.equalsverifier.EqualsVerifier;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

@DisplayName("FolderId should ")
class FolderIdTest {

    @DisplayName("not accept passing null value to constructor.")
    @Test
    void testPassingNullToConstructor() {

        new NullPointerTester().testAllPublicConstructors(FolderId.class);
    }

    @DisplayName("have correct implementations of equals() and hashcode().")
    @Test
    void testEqualsAndHashCode() {

        EqualsVerifier.forClass(FolderId.class).verify();
    }
}
