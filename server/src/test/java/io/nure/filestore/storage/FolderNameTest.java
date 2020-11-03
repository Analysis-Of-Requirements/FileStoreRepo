package io.nure.filestore.storage;

import com.google.common.testing.NullPointerTester;
import nl.jqno.equalsverifier.EqualsVerifier;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

@DisplayName("FolderName should ")
class FolderNameTest {

    @DisplayName("not accept passing null value to constructor.")
    @Test
    void testPassingNullToConstructor() {

        new NullPointerTester().testAllPublicConstructors(FolderName.class);
    }

    @DisplayName("have correct implementations of equals() and hashcode().")
    @Test
    void testEqualsAndHashCode() {

        EqualsVerifier.forClass(FolderName.class).verify();
    }
}
