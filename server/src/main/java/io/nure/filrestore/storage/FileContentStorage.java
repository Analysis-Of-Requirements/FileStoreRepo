package io.nure.filrestore.storage;

import io.nure.filestore.storage.InMemoryStorage;

/**
 * The {@link Storage} of {@link FileContentRecord}s.
 *
 * <p>Each record is identified among others by {@link FileId}.
 */
public class FileContentStorage extends InMemoryStorage<FileId, FileContentRecord> {
}
