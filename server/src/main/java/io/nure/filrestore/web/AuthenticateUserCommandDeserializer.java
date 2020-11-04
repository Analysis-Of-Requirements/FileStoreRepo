package io.nure.filrestore.web;

import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;
import io.nure.filestore.api.AuthenticateUser;
import io.nure.filestore.storage.LoginName;
import io.nure.filestore.storage.Password;

import java.lang.reflect.Type;

/**
 * JSON deserializer {@link JsonDeserializer} for an {@link AuthenticateUser} command.
 */
public class AuthenticateUserCommandDeserializer implements JsonDeserializer<AuthenticateUser> {

    /**
     * Deserializes {@link AuthenticateUser} command.
     *
     * @param json - serialized command.
     * @return deserialized AuthenticateUser command.
     */
    @Override
    public AuthenticateUser deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context)
        throws JsonParseException {

        JsonObject wrapper = (JsonObject) json;

        String login = wrapper.getAsJsonPrimitive("login").getAsString();
        String password = wrapper.getAsJsonPrimitive("password").getAsString();

        return new AuthenticateUser(new LoginName(login), new Password(password));
    }
}
