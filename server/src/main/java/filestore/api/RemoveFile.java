package filestore.api;

import io.nure.filestore.storage.FileId;

public class RemoveFile implements Command {

    private final FileId fileId;

    public RemoveFile(FileId fileId) {
        this.fileId = fileId;
    }

    public FileId getFileId() {
        return fileId;
    }
}
