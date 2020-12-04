package filestore.storage;

public class FolderTableName implements TableName {
    @Override
    public String value() {
        return "folders";
    }
}
