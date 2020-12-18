package filestore.api;

import io.nure.filestore.storage.FileContentStorage;
import io.nure.filestore.storage.FileMetadataRecord;
import io.nure.filestore.storage.FileMetadataStorage;
import io.nure.filestore.storage.FolderId;
import io.nure.filestore.storage.FolderRecord;
import io.nure.filestore.storage.FolderStorage;

import java.util.Optional;

public class FolderRemoving implements ApplicationProcess {

    private final FileMetadataStorage fileMetadataStorage;
    private final FileContentStorage fileContentStorage;
    private final FolderStorage folderStorage;

    public FolderRemoving(FileMetadataStorage fileMetadataStorage,
                          FileContentStorage fileContentStorage,
                          FolderStorage folderStorage) {
        this.fileMetadataStorage = fileMetadataStorage;
        this.fileContentStorage = fileContentStorage;
        this.folderStorage = folderStorage;
    }

    public void handle(RemoveFolder command) {
        FolderId folderId = command.getFolderId();
        Optional<FolderRecord> maybeFolder = folderStorage.get(command.getFolderId());
        if (!maybeFolder.isPresent()) {
            throw new FolderNotFoundException(format("Folder with id %s not found.", folderId));
        }
        for (FileMetadataRecord childFile : fileMetadataStorage.get(folderId)) {
            RemoveFile removeFile = new RemoveFile(childFile.identifier());
            FileRemoving fileRemoving = new FileRemoving(fileMetadataStorage, fileContentStorage);
            fileRemoving.handle(removeFile);
        }
        for (FolderRecord childFolder : folderStorage.getChildren(folderId)) {
            RemoveFolder removeFolder = new RemoveFolder(childFolder.identifier());
            FolderRemoving folderRemoving = new FolderRemoving(fileMetadataStorage, fileContentStorage, folderStorage);
            folderRemoving.handle(removeFolder);
        }
    }
}
