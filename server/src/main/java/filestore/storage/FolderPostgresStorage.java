package filestore.storage;

import org.slf4j.Logger;
import org.sql2o.Connection;
import org.sql2o.Sql2o;

import static org.slf4j.LoggerFactory.getLogger;

public class FolderPostgresStorage extends PostgresStorage<FolderId, FolderRecord, FolderRecord.Dto> {

    private static final Logger logger = getLogger(FolderPostgresStorage.class);

    public FolderPostgresStorage(Sql2o sql2o) {
        super(sql2o, new FolderTableName(), FolderRecord.Dto.class);
    }

    @Override
    public void put(FolderRecord record) {
        try (Connection conn = beginTransaction()) {

            if (logger.isDebugEnabled()) {
                logger.debug("Inserting Record {} at {}...", record, tableName().value());
            }

            conn.createQuery(
                    "insert into " + tableName().value() +
                    " (\"folder_id\", " +
                    "\"name\", " +
                    "parent_id, " +
                    "owner_id " +
                    ") " +
                    "VALUES (" +
                            ":file_id, " +
                            ":name, " +
                            ":parent_id, " +
                            ":owner_id)")
                    .addParameter("file_id", record.identifier().value())
                    .addParameter("name", record.name().value())
                    .addParameter("parent_id", record.parentId().value())
                    .addParameter("owner_id", record.ownerId().value())
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
    protected FolderRecord convert(FolderRecord.Dto dto) {
        return FolderRecord.fromDto(dto);
    }
}
