package io.nure.filestore.web;

import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;
import io.nure.filestore.api.RegisterUser;
import io.nure.filestore.storage.LoginName;
import io.nure.filestore.storage.Password;
import org.slf4j.Logger;

import java.lang.reflect.Type;

import static org.slf4j.LoggerFactory.getLogger;

/**
 * Deserializer {@link JsonDeserializer} for {@link RegisterUser} command.
 */
public class RegisterUserCommandDeserializer implements JsonDeserializer<RegisterUser> {

    private static final Logger logger = getLogger(RegisterUserCommandDeserializer.class);

    /**
     * Deserializes provided json to {@link RegisterUser} command.
     *
     * @param json - serialized {@link RegisterUser} command.
     * @return deserialized {@link RegisterUser} command.
     */
    @Override
    public RegisterUser deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context)
        throws JsonParseException {

        if (logger.isInfoEnabled()) {

            logger.info("Call to deserialize({})", json);
        }

        JsonObject wrapper = (JsonObject) json;

        String loginValue = wrapper.getAsJsonPrimitive("login").getAsString();
        String passwordValue = wrapper.getAsJsonPrimitive("password").getAsString();

        return new RegisterUser(new LoginName(loginValue), new Password(passwordValue));
    }
}
