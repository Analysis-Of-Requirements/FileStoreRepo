package filestore.web;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;
import io.nure.filestore.api.User;

import java.lang.reflect.Type;

/**
 * The {@link JsonSerializer} of {@link User}s.
 */
public class UserSerializer implements JsonSerializer<User> {

    /**
     * Serializes {@link User} to JSON format {@link JsonElement}.
     *
     * @param user user to serialize to JSON.
     * @return serialized user.
     */
    @Override
    public JsonElement serialize(User user, Type typeOfSrc, JsonSerializationContext context) {

        JsonObject wrapper = new JsonObject();

        wrapper.addProperty("id", user.identifier().value());
        wrapper.addProperty("name", user.loginName().value());

        return wrapper;
    }
}
