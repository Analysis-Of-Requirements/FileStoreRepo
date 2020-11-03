package io.nure.filestore.api;

import com.google.common.testing.NullPointerTester;
import io.nure.filrestore.api.LoggedInUser;
import nl.jqno.equalsverifier.EqualsVerifier;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

@DisplayName("Logged In User should ")
class LoggedInUserTest {

    @DisplayName("have correct implementations of equals() and hashcode().")
    @Test
    void testEqualsAndHashCode() {

        EqualsVerifier.forClass(LoggedInUser.class).verify();
    }

    @DisplayName("not accept null parameters.")
    @Test
    void testNullParameters() {

        new NullPointerTester().testAllPublicConstructors(LoggedInUser.class);
    }
}
