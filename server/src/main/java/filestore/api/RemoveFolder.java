package filestore.api;

import io.nure.filestore.storage.FolderId;

public class RemoveFolder implements Command {

    private final FolderId folderId;

    public RemoveFolder(FolderId folderId) {
        this.folderId = folderId;
    }

    public FolderId getFolderId() {
        return folderId;
    }
}
