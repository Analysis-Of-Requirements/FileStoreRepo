package filestore.api;

import io.nure.filestore.storage.FileType;

import java.util.LinkedHashMap;
import java.util.Map;

import static com.google.common.base.Preconditions.checkNotNull;
import static io.nure.filestore.storage.FileType.DOC;
import static io.nure.filestore.storage.FileType.IMAGE;
import static io.nure.filestore.storage.FileType.MUSIC;
import static io.nure.filestore.storage.FileType.SPREADSHEET;
import static io.nure.filestore.storage.FileType.UNDEFINED;
import static io.nure.filestore.storage.FileType.VIDEO;
import static java.util.Collections.synchronizedMap;

/**
 * The creator of the {@link FileType} objects.
 */
public class FileTypeCreator {

    /**
     * The {@link Map} of allowed MIME-type {@link String}s and corresponding {@link FileType}s.
     */
    private static final Map<String, FileType> allowedMimeTypes = synchronizedMap(new LinkedHashMap<>());

    static {

        allowedMimeTypes.put("application/vnd.ms-excel", SPREADSHEET);
        allowedMimeTypes.put("text/csv", SPREADSHEET);
        allowedMimeTypes.put("application/pdf", DOC);
        allowedMimeTypes.put("application/msword", DOC);
        allowedMimeTypes.put("text/", DOC);
        allowedMimeTypes.put("image/", IMAGE);
        allowedMimeTypes.put("video/", VIDEO);
        allowedMimeTypes.put("music/", MUSIC);
    }

    /**
     * Creates instance of the {@link FileType} based on the {@link MimeType}.
     *
     * <p>If the provided {@link MimeType} starts with any value from the range of {@code allowedMimeTypes}, then the
     * corresponding {@link FileType} is returned. If none matched - then the {@link FileType#UNDEFINED} is returned.
     *
     * <p>For example, for input "text/css" the {@link FileType#DOC} is returned. For input "abcd" the
     * {@link FileType#UNDEFINED} is returned.
     *
     * @param mimeType the {@link MimeType} to convert to {@link FileType}.
     * @return created {@link FileType}.
     */
    public static FileType fromMimeType(MimeType mimeType) {

        checkNotNull(mimeType);

        return allowedMimeTypes
            .entrySet()
            .stream()
            .filter(entry -> mimeType.value().startsWith(entry.getKey()))
            .map(Map.Entry::getValue)
            .findFirst()
            .orElse(UNDEFINED);
    }
}
