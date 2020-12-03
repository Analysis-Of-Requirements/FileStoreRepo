package filestore.storage;

public class FileContentRecordTableName implements TableName {
    @Override
    public String value() {
        return "files_content";
    }
}
