package io.nure.filestore.web;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import io.nure.filestore.api.RegisterUser;
import io.nure.filestore.storage.InvalidLoginException;
import io.nure.filestore.storage.InvalidPasswordException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static com.google.common.truth.Truth.assertWithMessage;
import static java.lang.String.format;
import static org.junit.jupiter.api.Assertions.assertThrows;

@DisplayName("Register User Command Deserializer should ")
class RegisterUserCommandDeserializerTest {

    private static String createJsonUserCredentials(String login, String password) {

        return format("{" +
            "\"login\":\"%s\"," +
            "\"password\":\"%s\"" +
            "}", login, password);
    }

    @DisplayName("should deserialize correct user credentials.")
    @Test
    void testSuccessfulDeserialization() {

        Gson parser = createJsonParser();
        String expectedLogin = "admin";
        String expectedPassword = "qwerty123A";
        String json = createJsonUserCredentials(expectedLogin, expectedPassword);

        RegisterUser command = parser.fromJson(json, RegisterUser.class);

        assertWithMessage("Cannot parse correct login.")
            .that(command.login().value())
            .isEqualTo(expectedLogin);

        assertWithMessage("Cannot parse correct password.")
            .that(command.password().value())
            .isEqualTo(expectedPassword);
    }

    @DisplayName("crash if login fails validation.")
    @Test
    void failLoginDeserialization() {

        String failingJson = createJsonUserCredentials("50", "qwerty123A");
        Gson parser = createJsonParser();

        assertThrows(
            InvalidLoginException.class,
            () -> parser.fromJson(failingJson, RegisterUser.class),
            "Cannot discard wrongly-typed login."
        );
    }

    @DisplayName("crash if password fails validation.")
    @Test
    void failPasswordDeserialization() {

        String failingJson = createJsonUserCredentials("admin", "qwerty");
        Gson parser = createJsonParser();

        assertThrows(
            InvalidPasswordException.class,
            () -> parser.fromJson(failingJson, RegisterUser.class),
            "Cannot discard wrongly-typed password."
        );
    }

    private Gson createJsonParser() {

        GsonBuilder builder = new GsonBuilder();
        builder.registerTypeAdapter(RegisterUser.class, new RegisterUserCommandDeserializer());

        return builder.create();
    }
}
