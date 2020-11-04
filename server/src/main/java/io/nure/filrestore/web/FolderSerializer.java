package io.nure.filrestore.web;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;
import io.nure.filestore.api.Folder;
import org.slf4j.Logger;

import java.lang.reflect.Type;

import static org.slf4j.LoggerFactory.getLogger;

/**
 * A {@link JsonSerializer} of {@link Folder}s.
 */
public class FolderSerializer implements JsonSerializer<Folder> {

    private static final Logger logger = getLogger(FolderSerializer.class);

    /**
     * Serializes passed {@link Folder} to {@link JsonElement}.
     *
     * @param folder the folder to serialize.
     * @return serialized folder.
     */
    @Override
    public JsonElement serialize(Folder folder, Type typeOfSrc, JsonSerializationContext context) {

        JsonObject wrapper = new JsonObject();

        wrapper.addProperty("name", folder.name().value());
        wrapper.addProperty("id", folder.identifier().value());
        wrapper.addProperty("parentId", getParentId(folder));

        if (logger.isInfoEnabled()) {
            logger.info("Folder converter to JSON: {}.", wrapper);
        }

        return wrapper;
    }

    /**
     * Retrieves value of identifier of parent folder of passed {@link Folder}.
     *
     * @param folder folder containing identifier of parent.
     * @return parent identifier of the folder or 'null' if folder has no parent.
     */
    private String getParentId(Folder folder) {

        return folder.parentId() == null ? null : folder.parentId().value();
    }
}
