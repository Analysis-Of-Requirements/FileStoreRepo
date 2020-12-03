package filestore.storage;

public class FileMetadataTableName implements TableName {
    @Override
    public String value() {
        return "files_metadata";
    }
}
