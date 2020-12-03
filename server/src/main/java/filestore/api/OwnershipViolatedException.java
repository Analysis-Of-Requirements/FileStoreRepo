package filestore.api;

import io.nure.filestore.storage.FileMetadataRecord;
import io.nure.filestore.storage.FolderRecord;

/**
 * An exception that is thrown when the {@link User} makes an attempt access someone else's {@link FileMetadataRecord}
 * or {@link FolderRecord}.
 */
public class OwnershipViolatedException extends RuntimeException {

    /**
     * Instantiates OwnershipViolatedException with error message.
     *
     * @param errorMessage the error message.
     */
    public OwnershipViolatedException(String errorMessage) {
        super(errorMessage);
    }
}
