package filestore.storage;

import org.slf4j.Logger;
import org.sql2o.Connection;
import org.sql2o.Sql2o;
import ua.nure.bilenko.drivers.storage.owner.OwnerRecord.OwnerDto;

import static org.slf4j.LoggerFactory.getLogger;

public class FileContentPostgresStorage extends PostgresStorage<FileId, FileContentRecord, FileContentRecord.Dto> {

    private static final Logger logger = getLogger(FileContentPostgresStorage.class);

    public FileContentPostgresStorage(Sql2o sql2o) {
        super(sql2o, new FileContentRecordTableName(), FileContentRecord.Dto.class);
    }

    @Override
    public void put(FileContentRecord record) {
        try (Connection conn = beginTransaction()) {

            if (logger.isDebugEnabled()) {
                logger.debug("Inserting Record {} at {}...", record, tableName().value());
            }

            conn.createQuery(
                    "insert into " + tableName().value() +
                    " (\"file_id\", " +
                    "\"link\", " +
                    "VALUES (" +
                            ":file_id, " +
                            ":link, " +
                            ")")
                    .addParameter("fileId", record.identifier().value())
                    .addParameter("link", record.content().value())
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
    protected FileContentRecord convert(FileContentRecord.Dto dto) {
        return FileContentRecord.fromDto(dto);
    }
}
