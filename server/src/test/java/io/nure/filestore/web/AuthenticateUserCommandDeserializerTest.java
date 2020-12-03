package io.nure.filestore.web;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import io.nure.filestore.storage.LoginName;
import io.nure.filestore.storage.Password;
import io.nure.filestore.api.AuthenticateUser;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;


import static com.google.common.truth.Truth.assertWithMessage;

@DisplayName("Authenticate User Command Deserializer should ")
class AuthenticateUserCommandDeserializerTest {

    @DisplayName("should deserialize user credentials.")
    @Test
    void testSuccessfulDeserialization() {

        Gson parser = setUpJsonParser();

        LoginName expectedLogin = new LoginName("admin");
        Password expectedPassword = new Password("qwerty123A");
        String json = "{" +
            "\"login\":\"" + expectedLogin.value() + "\"," +
            "\"password\":\"" + expectedPassword.value() + "\"" +
            "}";

        AuthenticateUser command = parser.fromJson(json, AuthenticateUser.class);

        assertWithMessage("Cannot parse correct login.")
            .that(command.loginName())
            .isEqualTo(expectedLogin);

        assertWithMessage("Cannot parse correct password.")
            .that(command.password())
            .isEqualTo(expectedPassword);
    }

    private Gson setUpJsonParser() {

        GsonBuilder builder = new GsonBuilder();
        builder.registerTypeAdapter(AuthenticateUser.class, new AuthenticateUserCommandDeserializer());

        return builder.create();
    }
}
