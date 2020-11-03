package io.nure.filestore.storage;

import nl.jqno.equalsverifier.EqualsVerifier;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

@DisplayName("UserId should ")
class UserIdTest {

    @DisplayName("have correct implementations of equals() and hashcode().")
    @Test
    void testEqualsAndHashCode() {

        EqualsVerifier.forClass(UserId.class).verify();
    }
}
