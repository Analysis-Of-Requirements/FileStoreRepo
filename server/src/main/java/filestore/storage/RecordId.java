package filestore.storage;

/**
 * Identifier of a {@link Record}. Identifies record among others in {@link Storage}.
 */
public interface RecordId {

    /**
     * Getter for value of identifier.
     *
     * @return value of identifier.
     */
    String value();
}
