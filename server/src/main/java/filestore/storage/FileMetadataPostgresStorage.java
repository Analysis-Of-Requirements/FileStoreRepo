package filestore.storage;

import org.slf4j.Logger;
import org.sql2o.Connection;
import org.sql2o.Sql2o;

import static org.slf4j.LoggerFactory.getLogger;

public class FileMetadataPostgresStorage extends PostgresStorage<FileId, FileMetadataRecord, FileMetadataRecord.Dto> {

    private static final Logger logger = getLogger(FileMetadataPostgresStorage.class);

    public FileMetadataPostgresStorage(Sql2o sql2o) {
        super(sql2o, new FileMetadataTableName(), FileMetadataRecord.Dto.class);
    }

    @Override
    public void put(FileMetadataRecord record) {
        try (Connection conn = beginTransaction()) {

            if (logger.isDebugEnabled()) {
                logger.debug("Inserting Record {} at {}...", record, tableName().value());
            }

            conn.createQuery(
                    "insert into " + tableName().value() +
                    " (\"file_id\", " +
                    "\"name\", " +
                    "\"type\", " +
                    "size, " +
                    "parent_id, " +
                    "owner_id " +
                    ") " +
                    "VALUES (" +
                            ":file_id, " +
                            ":name, " +
                            ":type, " +
                            ":size, " +
                            ":parent_id, " +
                            ":owner_id)")
                    .addParameter("file_id", record.identifier().value())
                    .addParameter("name", record.name().value())
                    .addParameter("type", record.fileType().value())
                    .addParameter("size", record.size().value())
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
    protected FileMetadataRecord convert(FileMetadataRecord.Dto dto) {
        return FileMetadataRecord.fromDto(dto);
    }
}
