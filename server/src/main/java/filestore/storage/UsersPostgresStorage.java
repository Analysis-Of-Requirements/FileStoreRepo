package filestore.storage;

import org.slf4j.Logger;
import org.sql2o.Connection;
import org.sql2o.Sql2o;

import static org.slf4j.LoggerFactory.getLogger;

public class UsersPostgresStorage extends PostgresStorage<UserId, UserRecord, UserRecord.Dto> {

    private static final Logger logger = getLogger(UsersPostgresStorage.class);

    public UsersPostgresStorage(Sql2o sql2o) {
        super(sql2o, new UserRecordTableName(), UserRecord.Dto.class);
    }

    @Override
    public void put(UserRecord record) {
        try (Connection conn = beginTransaction()) {

            if (logger.isDebugEnabled()) {
                logger.debug("Inserting Record {} at {}...", record, tableName().value());
            }

            conn.createQuery(
                    "insert into " + tableName().value() +
                    " (\"user_id\", " +
                    "\"login_name\", " +
                    "password_hash, " +
                    ") " +
                    "VALUES (" +
                            ":user_id, " +
                            ":login_name, " +
                            ":password_hash)")
                    .addParameter("user_id", record.identifier().value())
                    .addParameter("login_name", record.loginName().value())
                    .addParameter("password_hash", record.passwordHash().value())
                    .executeUpdate();

            if (logger.isDebugEnabled()) {
                logger.debug("Record inserted {}.", record);
            }

            conn.commit();

            if (logger.isDebugEnabled()) {
                logger.debug("Transaction committed.");
            }
        }
    }

    @Override
    protected UserRecord convert(UserRecord.Dto dto) {
        return UserRecord.fromDto(dto);
    }
}
