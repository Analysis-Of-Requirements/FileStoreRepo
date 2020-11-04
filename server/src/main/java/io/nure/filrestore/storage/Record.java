package io.nure.filrestore.storage;

/**
 * Unit of data, stored in {@link Storage}.
 *
 * @param <I> - identifier {@link RecordId} of the record.
 */
public interface Record<I extends RecordId> {

    /**
     * Getter for identifier of record.
     *
     * @return identifier of record.
     */
    I identifier();
}
