package filestore.storage;

import org.slf4j.Logger;
import org.sql2o.Connection;
import org.sql2o.Sql2o;

import static org.slf4j.LoggerFactory.getLogger;

public class LoggedInUsersPostgresStorage extends PostgresStorage<Token, LoggedInUserRecord, LoggedInUserRecord.Dto> {

    private static final Logger logger = getLogger(LoggedInUsersPostgresStorage.class);

    public LoggedInUsersPostgresStorage(Sql2o sql2o) {
        super(sql2o, new LoggedInUserRecordTableName(), LoggedInUserRecord.Dto.class);
    }

    @Override
    public void put(LoggedInUserRecord record) {
        try (Connection conn = beginTransaction()) {

            if (logger.isDebugEnabled()) {
                logger.debug("Inserting Record {} at {}...", record, tableName().value());
            }

            conn.createQuery(
                    "insert into " + tableName().value() +
                    " (\"token\", " +
                    "\"user_id\", " +
                    "expiration_time, " +
                    ") " +
                    "VALUES (" +
                            ":token, " +
                            ":user_id, " +
                            ":expiration_time)")
                    .addParameter("token", record.identifier().value())
                    .addParameter("user_id", record.userId().value())
                    .addParameter("expiration_time", record.expirationTime().value())
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
    protected LoggedInUserRecord convert(LoggedInUserRecord.Dto dto) {
        return LoggedInUserRecord.fromDto(dto);
    }
}
