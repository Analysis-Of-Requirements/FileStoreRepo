package filestore.storage;

import com.google.errorprone.annotations.Immutable;

@Immutable
public interface TableName {

    String value();
}
