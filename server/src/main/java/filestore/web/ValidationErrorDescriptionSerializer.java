package filestore.web;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;

import java.lang.reflect.Type;

/**
 * JSON serializer {@link JsonSerializer} for {@link ValidationErrorDescription}.
 */
public class ValidationErrorDescriptionSerializer implements JsonSerializer<ValidationErrorDescription> {

    /**
     * Serializes {@link ValidationErrorDescription} to json {@link JsonElement}.
     *
     * @param description - description of validation error.
     * @return serialized {@link ValidationErrorDescription}.
     */
    @Override
    public JsonElement serialize(ValidationErrorDescription description, Type type, JsonSerializationContext context) {

        JsonObject errorCase = new JsonObject();
        errorCase.addProperty("field", description.fieldName());
        errorCase.addProperty("message", description.getMessage());

        JsonArray errorCases = new JsonArray();
        errorCases.add(errorCase);

        JsonObject response = new JsonObject();
        response.add("validationErrors", errorCases);

        return response;
    }
}
