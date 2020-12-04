package filestore.web;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;
import io.nure.filestore.api.FileMetadata;
import io.nure.filestore.api.Folder;
import io.nure.filestore.api.FolderContent;

import java.lang.reflect.Type;
import java.util.Collection;

/**
 * A {@link JsonSerializer} of a {@link FolderContent}.
 */
public class FolderContentSerializer implements JsonSerializer<FolderContent> {

    /**
     * Serializes {@link FolderContent} to JSON representation.
     *
     * @param content the content of the folder to serialize.
     * @return serialized content.
     */
    @Override
    public JsonElement serialize(FolderContent content, Type typeOfSrc, JsonSerializationContext context) {

        JsonArray folders = serializeFolders(content, context);
        JsonArray files = serializeFiles(content, context);

        return serializeFolderContent(files, folders);
    }

    /**
     * Serializes {@link Collection} of {@link Folder}s to {@link JsonArray}.
     *
     * @param content container of child folders to serialize.
     * @param context json serialization context.
     * @return serialized child folders.
     */
    private JsonArray serializeFolders(FolderContent content, JsonSerializationContext context) {

        Collection<Folder> folders = content.folders();
        JsonArray jsonFolders = new JsonArray();

        folders.forEach(folder -> {

            JsonElement serializedFolder = context.serialize(folder, Folder.class);

            jsonFolders.add(serializedFolder);
        });

        return jsonFolders;
    }

    /**
     * Serializes {@link Collection} of {@link FileMetadata} objects to {@link JsonArray}.
     *
     * @param content container of child files to serialize.
     * @param context json serialization context.
     * @return serialized child files.
     */
    private JsonArray serializeFiles(FolderContent content, JsonSerializationContext context) {

        Collection<FileMetadata> files = content.files();
        JsonArray jsonFiles = new JsonArray();

        files.forEach(file -> {

            JsonElement serializedFile = context.serialize(file, FileMetadata.class);

            jsonFiles.add(serializedFile);
        });

        return jsonFiles;
    }

    /**
     * Serializes {@link JsonArray}s of folders and files to a single {@link JsonElement}.
     *
     * @param files   files to serialize.
     * @param folders folders to serialize.
     * @return {@link JsonElement} with serialized array of files and array of folders.
     */
    private JsonElement serializeFolderContent(JsonArray files, JsonArray folders) {

        JsonObject responseWrapper = new JsonObject();

        responseWrapper.add("folders", folders);
        responseWrapper.add("files", files);

        return responseWrapper;
    }
}
