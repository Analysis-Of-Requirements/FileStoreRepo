package filestore.api;

import io.nure.filestore.storage.UserRecord;
import io.nure.filestore.storage.UserStorage;

public class FileNotFoundException extends RuntimeException {

    public FileNotFoundException(String message) {
        super(message);
    }
}
