package io.nure.filestore.web;

import nl.jqno.equalsverifier.EqualsVerifier;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

@DisplayName("ValidationErrorDescription should ")
class ValidationErrorDescriptionTest {

    @DisplayName("have correct implementations of equals() and hashcode().")
    @Test
    void testEqualsAndHashCode() {

        EqualsVerifier.forClass(ValidationErrorDescription.class).verify();
    }
}
