package filestore.web;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;
import io.nure.filestore.api.FileMetadata;

import java.lang.reflect.Type;

/**
 * A {@link JsonSerializer} of {@link FileMetadata} objects.
 */
public class FileMetadataSerializer implements JsonSerializer<FileMetadata> {

    /**
     * Serializes passed {@link FileMetadata} to {@link JsonElement}.
     *
     * @param fileMetaData the file to serialize.
     * @return serialized file.
     */
    @Override
    public JsonElement serialize(FileMetadata fileMetaData, Type typeOfSrc, JsonSerializationContext context) {

        JsonObject wrapper = new JsonObject();

        wrapper.addProperty("name", fileMetaData.name().value());
        wrapper.addProperty("id", fileMetaData.identifier().value());
        wrapper.addProperty("fileType", fileMetaData.fileType().value());
        wrapper.addProperty("size", fileMetaData.size().value());
        wrapper.addProperty("parentId", fileMetaData.parentId().value());

        return wrapper;
    }
}
