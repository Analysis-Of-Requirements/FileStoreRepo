package io.nure.filestore.storage;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.stream.Stream;

import static java.lang.String.format;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

@DisplayName("LoginName should ")
class LoginNameTest {

    private static Stream<Arguments> invalidLoginData() {

        return Stream.of(
                Arguments.of("abc", "less than 4 characters."),
                Arguments.of(null, "null.")
        );
    }

    @Test
    @DisplayName("successfully initialize without an error.")
    void testCorrectInitialization() {

        String correctLoginName = "admin";

        assertDoesNotThrow(
                () -> new LoginName(correctLoginName),
                "Cannot initialize when correct login name is passed."
        );
    }

    @ParameterizedTest
    @MethodSource("invalidLoginData")
    @DisplayName("fail initialization when passed invalid login name.")
    void testInvalidLogin(String invalidLoginName, String errorMessage) {

        assertThrows(
                InvalidLoginException.class,
                () -> new LoginName(invalidLoginName),
                format("Should fail if login name is %s.", errorMessage)
        );
    }
}
