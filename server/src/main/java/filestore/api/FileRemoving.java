package filestore.api;

import io.nure.filestore.storage.FileContentRecord;
import io.nure.filestore.storage.FileContentStorage;
import io.nure.filestore.storage.FileId;
import io.nure.filestore.storage.FileMetadataRecord;
import io.nure.filestore.storage.FileMetadataStorage;

import java.util.Optional;

public class FileRemoving implements ApplicationProcess {

    private final FileMetadataStorage fileMetadataStorage;
    private final FileContentStorage fileContentStorage;

    public FileRemoving(FileMetadataStorage fileMetadataStorage, FileContentStorage fileContentStorage) {
        this.fileMetadataStorage = fileMetadataStorage;
        this.fileContentStorage = fileContentStorage;
    }

    public void handle(RemoveFile command) {
        FileId fileId = command.getFileId();
        Optional<FileMetadataRecord> fileMetadataRecord = fileMetadataStorage.delete(fileId);
        if (!fileMetadataRecord.isPresent()) {
            throw new FileNotFoundException(format("File with id %s was not found.", fileId));
        }
        Optional<FileContentRecord> fileContentRecord = fileContentStorage.delete(fileId);
        if (!fileContentRecord.isPresent()) {
            throw new FileNotFoundException(format("File with id %s was not found.", fileId));
        }
    }
}
