package io.nure.filrestore.api;

import io.nure.filestore.storage.FolderId;
import io.nure.filestore.storage.FolderStorage;
import io.nure.filestore.storage.UserId;

/**
 * An exception that is thrown when {@link Folder} with {@link FolderId} of the owner user with {@link UserId} was not
 * found in {@link FolderStorage}.
 */
public class FolderNotFoundException extends RuntimeException {

    /**
     * Instantiates FolderNotFoundException.
     *
     * @param errorMessage error description.
     */
    public FolderNotFoundException(String errorMessage) {
        super(errorMessage);
    }
}
