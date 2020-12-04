package filestore.storage;

public class UserRecordTableName implements TableName {
    @Override
    public String value() {
        return "users";
    }
}
