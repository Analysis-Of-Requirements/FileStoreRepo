package filestore.api;

import com.google.errorprone.annotations.Immutable;

import static com.google.common.base.Preconditions.checkNotNull;
import static java.util.Objects.hash;

/**
 * The value object for MIME-type.
 *
 * @see <a href="https://www.iana.org/assignments/media-types/media-types.xhtml">MIME-types<a/>.
 */
@Immutable
public final class MimeType {

    /**
     * The value of the MIME-type.
     */
    private final String value;

    /**
     * Instantiates MimeType with provided value.
     *
     * @param value the value of the MIME-type.
     */
    public MimeType(String value) {
        this.value = checkNotNull(value);
    }

    /**
     * Retrieves the value of the MIME-type.
     *
     * @return the value of the MIME-type.
     */
    public String value() {
        return value;
    }

    @Override
    public boolean equals(Object o) {

        if (this == o) {
            return true;
        }

        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        MimeType mimeType = (MimeType) o;

        return value.equals(mimeType.value);
    }

    @Override
    public int hashCode() {
        return hash(value);
    }

    @Override
    public String toString() {
        return "MimeType{" +
            "value='" + value + '\'' +
            '}';
    }
}
