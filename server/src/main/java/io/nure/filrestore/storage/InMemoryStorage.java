package io.nure.filrestore.storage;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static com.google.common.base.Preconditions.checkNotNull;
import static java.util.Collections.synchronizedMap;
import static java.util.Optional.ofNullable;

/**
 * Abstract implementation of {@link Storage} that stores {@link java.lang.Record}s in JVM memory.
 *
 * <p>This implementation is based on {@link HashMap} and is synchronized.
 *
 * @param <I> - identifier {@link RecordId} of record {@link java.lang.Record}.
 * @param <R> - record - unit of data that is stored in storage.
 */
public abstract class InMemoryStorage<I extends RecordId, R extends java.lang.Record<I>> implements Storage<I, R> {

    /**
     * Actual storage of records.
     */
    private final Map<I, R> storage = synchronizedMap(new HashMap<>());

    /**
     * Retrieves {@link Collection} of all {@link java.lang.Record}s that are currently in the storage.
     *
     * <p>Constant-time operation.
     *
     * @return {@link Collection} of all storage records {@link java.lang.Record}.
     */
    @Override
    public Collection<R> getAll() {
        return storage.values();
    }

    /**
     * Retrieves {@link java.lang.Record}, mapped to passed {@link RecordId}.
     *
     * <p>Constant-time operation.
     *
     * @param identifier - {@link RecordId} of {@link java.lang.Record} that may be in the storage.
     * @return {@link java.lang.Record} wrapped in {@link Optional} if it was found or {@link Optional#empty()} otherwise.
     */
    @Override
    public Optional<R> get(I identifier) {
        return ofNullable(storage.get(checkNotNull(identifier)));
    }

    /**
     * <p>Puts record {@link java.lang.Record} into the storage. Replaces existing record if it was found by passed
     * {@link RecordId}.
     *
     * @param record - {@link java.lang.Record} to put in the storage.
     */
    @Override
    public void put(R record) {

        checkNotNull(record);

        storage.put(checkNotNull(record.identifier()), record);
    }

    /**
     * <p>Deletes record {@link java.lang.Record} from the storage if it was found by passed {@link RecordId}.
     *
     * @param identifier - {@link RecordId} of record to delete.
     * @return deleted record wrapped into {@link Optional} or {@link Optional#empty()} if record was not found in the
     * storage.
     */
    @Override
    public Optional<R> delete(I identifier) {
        return ofNullable(storage.remove(checkNotNull(identifier)));
    }
}
