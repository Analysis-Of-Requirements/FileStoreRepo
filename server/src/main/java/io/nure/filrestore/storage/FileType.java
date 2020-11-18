package io.nure.filrestore.storage;

/**
 * Enumeration of all possible types of {@link FileMetadataRecord}.
 */
public enum FileType {

    /**
     * The type for files with mime type "image/*".
     */
    IMAGE("image"),

    /**
     * The type for files with mime type "application/pdf", "application/msword", "text/*".
     */
    DOC("doc"),

    /**
     * The type of files with mime types: "application/vnd.ms-excel", "text/csv"
     */
    SPREADSHEET("excel"),

    /**
     * The type for files with mime type "video/*".
     */
    VIDEO("video"),

    /**
     * The type for files with mime type "audio/*".
     */
    MUSIC("music"),

    /**
     * The type for files with other mime types that are not defined by constants above.
     */
    UNDEFINED("undefined");

    /**
     * Value of the type of the file.
     */
    private final String value;

    /**
     * Instantiates FileType.
     *
     * @param value the value of the file type.
     */
    FileType(String value) {
        this.value = value;
    }

    /**
     * Getter for the value of the type of the file.
     *
     * @return the value of the type of the file.
     */
    public String value() {
        return value;
    }

    @Override
    public String toString() {
        return "FileType{" +
            "value='" + value + '\'' +
            '}';
    }
}
