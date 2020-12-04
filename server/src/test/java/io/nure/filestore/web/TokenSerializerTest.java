package io.nure.filestore.web;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import io.nure.filestore.storage.Token;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;


import static com.google.common.truth.Truth.assertWithMessage;
import static java.lang.String.format;

@DisplayName("Token Serializer should ")
class TokenSerializerTest {

    private static Gson setUpJsonParser() {

        GsonBuilder builder = new GsonBuilder();
        builder.registerTypeAdapter(Token.class, new TokenSerializer());

        return builder.create();
    }

    @DisplayName("successfully serialize token object.")
    @Test
    void testSuccessfulSerialization() {

        String tokenValue = "token-value";
        Token token = new Token(tokenValue);
        Gson jsonParser = setUpJsonParser();

        String parsedToken = jsonParser.toJson(token, Token.class);
        String expectedRegex = format("^\\s*\\{\"token\":\"%s\"}\\s*$", tokenValue);

        assertWithMessage("Cannot serialize token.")
                .that(parsedToken)
                .matches(expectedRegex);
    }
}
