package filestore.api;

import io.nure.filestore.storage.Storage;

/**
 * An abstract base for representation of data from certain {@link Storage}.
 */
public interface View<D, Q extends Query> {

    /**
     * Retrieves data {@link D} from {@link Storage} by a {@link Query}.
     *
     * @param query query to read data.
     * @return read data {@link D}.
     */
    D handle(Q query);
}
