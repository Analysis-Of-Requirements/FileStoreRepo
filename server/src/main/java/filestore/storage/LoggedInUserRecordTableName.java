package filestore.storage;

public class LoggedInUserRecordTableName implements TableName {
    @Override
    public String value() {
        return "logged_in_users";
    }
}
