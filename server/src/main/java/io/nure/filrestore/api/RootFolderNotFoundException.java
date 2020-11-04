package io.nure.filrestore.api;

import io.nure.filestore.storage.FolderStorage;
import io.nure.filestore.storage.UserId;

/**
 * An exception that is thrown when root {@link Folder} of user with {@link UserId} was
 * not found in {@link FolderStorage}.
 */
public class RootFolderNotFoundException extends RuntimeException {

    /**
     * Instantiates RootFolderNotFoundException.
     *
     * @param errorMessage error description.
     */
    public RootFolderNotFoundException(String errorMessage) {
        super(errorMessage);
    }
}
