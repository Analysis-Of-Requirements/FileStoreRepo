package io.nure.filestore.storage;

import nl.jqno.equalsverifier.EqualsVerifier;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

@DisplayName("UserRecord should ")
class UserRecordTest {

    @DisplayName("have correct implementations of equals() and hashcode().")
    @Test
    void testEqualsAndHashCode() {

        EqualsVerifier.forClass(UserRecord.class).verify();
    }
}
