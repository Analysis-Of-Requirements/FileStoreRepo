package io.nure.filrestore.web;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;
import io.nure.filrestore.storage.Token;
import java.lang.reflect.Type;

/**
 * JSON serializer {@link JsonSerializer} for {@link Token}s.
 */
public class TokenSerializer implements JsonSerializer<Token> {

    /**
     * Serializes {@link Token} object to json {@link JsonElement}.
     *
     * @param token token to serialize.
     * @return serialized token.
     */
    @Override
    public JsonElement serialize(Token token, Type typeOfSrc, JsonSerializationContext context) {

        JsonObject wrapper = new JsonObject();
        wrapper.addProperty("token", token.value());

        return wrapper;
    }
}
