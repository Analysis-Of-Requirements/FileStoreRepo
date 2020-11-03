package io.nure.filestore.storage;

import nl.jqno.equalsverifier.EqualsVerifier;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.stream.Stream;

import static java.lang.String.format;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

@DisplayName("Register User command should ")
class PasswordTest {

    private static Stream<Arguments> invalidPasswordData() {

        return Stream.of(
                Arguments.of("1234567", "less than 8 characters."),
                Arguments.of(null, "null.")
        );
    }

    @Test
    @DisplayName("successfully initialize without an error.")
    void testCorrectInitialization() {

        String correctPassword = "qwerty123A";

        assertDoesNotThrow(
                () -> new Password(correctPassword),
                "Cannot initialize when correct password is passed."
        );
    }

    @ParameterizedTest
    @MethodSource("invalidPasswordData")
    @DisplayName("fail initialization when passed invalid password.")
    void testInvalidPassword(String invalidPassword, String errorMessage) {

        assertThrows(
                InvalidPasswordException.class,
                () -> new Password(invalidPassword),
                format("Should fail if password is %s.", errorMessage)
        );
    }

    @DisplayName("have correct implementations of equals() and hashcode().")
    @Test
    void testEqualsAndHashCode() {

        EqualsVerifier.forClass(Password.class).verify();
    }
}
