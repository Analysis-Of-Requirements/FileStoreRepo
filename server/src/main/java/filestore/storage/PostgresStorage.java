package filestore.storage;

import org.slf4j.Logger;
import org.sql2o.Connection;
import org.sql2o.Sql2o;
import io.nure.filestore.storage.Record.RecordDto;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import static com.google.common.base.Preconditions.checkNotNull;
import static java.util.Optional.empty;
import static java.util.Optional.of;
import static java.util.Optional.ofNullable;
import static java.util.stream.Collectors.toList;
import static org.slf4j.LoggerFactory.getLogger;

public abstract class PostgresStorage<I extends RecordId, R extends Record<I>, D extends RecordDto>
        implements Storage<I, R> {

    private static final Logger logger = getLogger(PostgresStorage.class);

    private final Sql2o sql2o;
    private final TableName tableName;
    private final Class<D> recordDtoType;

    protected PostgresStorage(Sql2o sql2o, TableName tableName, Class<D> recordDtoType) {
        this.sql2o = sql2o;
        this.tableName = tableName;
        this.recordDtoType = recordDtoType;
    }

    @Override
    public Collection<R> getAll() {
        try (Connection conn = sql2o.beginTransaction()) {

            if (logger.isDebugEnabled()) {
                logger.debug("Before selecting everything from {}.", tableName.value());
            }

            List<D> records = conn.createQuery("select * from " + tableName.value())
                    .executeAndFetch(recordDtoType);

            if (logger.isDebugEnabled()) {
                logger.debug("After selecting everything from {}. Length: {}.", tableName.value(), records.size());
            }

            conn.commit();

            if (logger.isDebugEnabled()) {
                logger.debug("Transaction committed.");
            }

            return records
                    .stream()
                    .map(this::convert)
                    .collect(toList());
        }
    }

    @Override
    public Optional<R> get(I identifier) {

        checkNotNull(identifier);

        try (Connection conn = sql2o.beginTransaction()) {

            D record = conn.createQuery("select * from " +
                    tableName.value() +
                    " where " +
                    identifier.columnName() +
                    " = :idValue")
                    .addParameter("idValue", identifier.value())
                    .executeAndFetchFirst(recordDtoType);

            conn.commit();

            return ofNullable(record)
                    .isPresent()
                    ? of(convert(record))
                    : empty();
        }
    }

    @Override
    public abstract void put(R record);

    @Override
    public void delete(I identifier) {

        try (Connection conn = sql2o.beginTransaction()) {

            conn.createQuery("delete from " +
                    tableName.value() +
                    " where " +
                    identifier.columnName() +
                    " = :idValue")
                    .addParameter("idValue", identifier.value())
                    .executeUpdate();

            conn.commit();
        }
    }

    protected Connection beginTransaction() {
        return sql2o.beginTransaction();
    }

    protected TableName tableName() {
        return tableName;
    }

    protected abstract R convert(D dto);
}
