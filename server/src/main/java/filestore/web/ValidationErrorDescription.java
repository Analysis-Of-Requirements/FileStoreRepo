package filestore.web;

import com.google.errorprone.annotations.Immutable;

import java.util.Objects;

import static java.util.Objects.hash;

/**
 * Value object for description of validation error.
 */
@Immutable
public final class ValidationErrorDescription {

    /**
     * Name of the field that caused validation error.
     */
    private final String fieldName;

    /**
     * Validation error message.
     */
    private final String message;

    /**
     * Instantiates ValidationErrorDescription.
     *
     * @param fieldName - name of the field of {@link spark.Request} body that caused validation error.
     * @param message   - validation error message.
     */
    public ValidationErrorDescription(String fieldName, String message) {
        this.fieldName = fieldName;
        this.message = message;
    }

    /**
     * Getter for field name.
     *
     * @return field name.
     */
    public String fieldName() {
        return fieldName;
    }

    /**
     * Getter for error message.
     *
     * @return error message.
     */
    public String getMessage() {
        return message;
    }

    @Override
    public boolean equals(Object o) {

        if (this == o) {
            return true;
        }

        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        ValidationErrorDescription that = (ValidationErrorDescription) o;

        return Objects.equals(fieldName, that.fieldName) &&
            Objects.equals(message, that.message);
    }

    @Override
    public int hashCode() {

        return hash(fieldName, message);
    }
}
