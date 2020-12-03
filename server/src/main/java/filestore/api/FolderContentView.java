package filestore.api;

import io.nure.filestore.storage.FileMetadataRecord;
import io.nure.filestore.storage.FileMetadataStorage;
import io.nure.filestore.storage.FolderId;
import io.nure.filestore.storage.FolderRecord;
import io.nure.filestore.storage.FolderStorage;
import io.nure.filestore.storage.UserId;
import org.slf4j.Logger;

import java.util.ArrayList;
import java.util.Collection;

import static com.google.common.base.Preconditions.checkNotNull;
import static java.lang.String.format;
import static java.util.stream.Collectors.toCollection;
import static org.slf4j.LoggerFactory.getLogger;

/**
 * A {@link View} of the {@link FolderContent} of the {@link Folder} with {@link FolderId} and {@link UserId}.
 */
public class FolderContentView implements View<FolderContent, GetFolderContentQuery> {

    private static final Logger logger = getLogger(FolderContentView.class);

    /**
     * The storage of folders.
     */
    private final FolderStorage folderStorage;

    /**
     * The storage of metadata of files.
     */
    private final FileMetadataStorage fileMetadataStorage;

    /**
     * Instantiates FolderContentView with necessary storages.
     *
     * @param folderStorage       the storage of folders.
     * @param fileMetadataStorage the storage of metadata of files.
     */
    public FolderContentView(FolderStorage folderStorage, FileMetadataStorage fileMetadataStorage) {

        this.folderStorage = checkNotNull(folderStorage);
        this.fileMetadataStorage = checkNotNull(fileMetadataStorage);

        if (logger.isInfoEnabled()) {
            logger.info("Create view to get folder.");
        }
    }

    /**
     * Retrieves {@link FolderContent} by {@link FolderId} and {@link UserId}.
     *
     * @param query the query to retrieve content of the folder.
     * @return retrieved folder content.
     * @throws FolderNotFoundException if the queried parent folder doesn't exist.
     */
    @Override
    public FolderContent handle(GetFolderContentQuery query) {

        checkNotNull(query);

        if (logger.isInfoEnabled()) {
            logger.info("Retrieving content of folder with {} of {}.", query.folderId(), query.ownerId());
        }

        UserId folderOwnerId = query.ownerId();
        FolderId parentFolderId = query.folderId();

        if (isFolderAbsent(folderOwnerId, parentFolderId)) {

            if (logger.isInfoEnabled()) {
                logger.info("Folder with {} of {} was not found.", query.folderId(), query.ownerId());
            }

            raiseFolderNotFoundError(folderOwnerId, parentFolderId);
        }

        Collection<Folder> childrenFolders = retrieveFolders(parentFolderId);
        Collection<FileMetadata> childrenFileMetadata = retrieveFiles(parentFolderId);

        FolderContent content = createFolderContent(childrenFolders, childrenFileMetadata);

        if (logger.isInfoEnabled()) {
            logger.info("Created folder content: {}.", content);
        }

        return content;
    }

    /**
     * Asserts whether {@link Folder} with {@link FolderId} and {@link UserId} doesn't exist in the
     * {@link FolderStorage}.
     *
     * @param ownerId  identifier of the owner of the folder.
     * @param folderId identifier of the queried folder.
     * @return true if the folder doesn't exist.
     */
    private boolean isFolderAbsent(UserId ownerId, FolderId folderId) {

        return !folderStorage
            .get(folderId, ownerId)
            .isPresent();
    }

    /**
     * Raises {@link FolderNotFoundException}.
     *
     * @param ownerId  owner of the not found folder.
     * @param folderId identifier of not found folder.
     * @throws FolderNotFoundException to notify caller about not found folder.
     */
    private void raiseFolderNotFoundError(UserId ownerId, FolderId folderId) {

        throw new FolderNotFoundException(format(
            "Folder with ID \"%s\" of the owner with ID \"%s\" was not found.",
            folderId.value(),
            ownerId.value()
        ));
    }

    /**
     * Retrieves children folders of the parent folder with {@link FolderId}.
     *
     * @param parentFolderId the identifier of the parent folder.
     * @return collection of retrieved children folders.
     */
    private Collection<Folder> retrieveFolders(FolderId parentFolderId) {

        return folderStorage
            .getChildren(parentFolderId)
            .stream()
            .map(this::createFolderFrom)
            .collect(toCollection(ArrayList::new));
    }

    /**
     * Creates {@link Folder} based on {@link FolderRecord}.
     *
     * @param folderRecord base for the folder.
     * @return created folder.
     */
    private Folder createFolderFrom(FolderRecord folderRecord) {

        return new Folder(
            folderRecord.identifier(),
            folderRecord.name(),
            folderRecord.parentId()
        );
    }

    /**
     * Retrieves children files of the parent folder with {@link FolderId}.
     *
     * @param parentFolderId the identifier of the parent folder.
     * @return collection of retrieved children files.
     */
    private Collection<FileMetadata> retrieveFiles(FolderId parentFolderId) {

        return fileMetadataStorage
            .get(parentFolderId)
            .stream()
            .map(this::createFileFrom)
            .collect(toCollection(ArrayList::new));
    }

    /**
     * Creates {@link FileMetadata} based on {@link FileMetadataRecord}.
     *
     * @param record base for the file.
     * @return created file.
     */
    private FileMetadata createFileFrom(FileMetadataRecord record) {

        return new FileMetadata(
            record.name(),
            record.identifier(),
            record.fileType(),
            record.size(),
            record.parentId()
        );
    }

    /**
     * Creates {@link FolderContent} from passed collections of {@link Folder}s and {@link FileMetadata} objects.
     *
     * @param folders      collection of folders.
     * @param fileMetaData collection of files.
     * @return created folder content.
     */
    private FolderContent createFolderContent(Collection<Folder> folders, Collection<FileMetadata> fileMetaData) {

        return new FolderContent(folders, fileMetaData);
    }
}
