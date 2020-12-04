package filestore.storage;

import java.util.Collection;
import java.util.Optional;

/**
 * Base interface for storage of records {@link Record}. Each record is identified among others by {@link RecordId}.
 *
 * @param <I> - identifier of record.
 * @param <R> - record - unit of data that is stored in storage.
 */
public interface Storage<I extends RecordId, R extends Record<I>> {

    /**
     * Retrieves all records {@link Record} that are currently in the storage.
     *
     * @return {@link Collection} of all storage records.
     */
    Collection<R> getAll();

    /**
     * Retrieves {@link Record} from the storage by passed {@link RecordId}.
     *
     * @param identifier - {@link RecordId} of the record.
     * @return retrieved {@link Record} wrapped in {@link Optional} or {@link Optional#empty()} if it was not found.
     */
    Optional<R> get(I identifier);

    /**
     * Puts {@link Record} to the storage. Overwrites a record with the same {@link RecordId} if it exists.
     *
     * @param record - record to put in the storage.
     */
    void put(R record);

    /**
     * Finds {@link Record} by {@link RecordId} and then removes it from the storage.
     *
     * @param identifier - identifier of record.
     * @return removed record wrapped in {@link Optional} or {@link Optional#empty()} if it was not found.
     */
    Optional<R> delete(I identifier);
}
