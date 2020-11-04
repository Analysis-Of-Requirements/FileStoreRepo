package io.nure.filrestore.storage;

import com.google.errorprone.annotations.Immutable;

import java.util.Objects;

import static com.google.common.base.Preconditions.checkNotNull;
import static java.util.Objects.hash;

/**
 * A {@link Record} stored in {@link LoggedInUsersStorage}. The record describes logged-in {@link UserRecord}.
 */
@Immutable
public final class LoggedInUserRecord implements Record<Token> {

    /**
     * A value object of token.
     */
    private final Token token;

    /**
     * A reference to {@link UserRecord}.
     */
    private final UserId userId;

    /**
     * Expiration time of the record.
     */
    private final ExpirationTime expirationTime;

    /**
     * Instantiates LoggedInUserRecord.
     *
     * @param token          issued token.
     * @param userId         reference to {@link UserRecord}.
     * @param expirationTime expiration time of the token.
     */
    public LoggedInUserRecord(Token token, UserId userId, ExpirationTime expirationTime) {

        this.token = checkNotNull(token);
        this.userId = checkNotNull(userId);
        this.expirationTime = checkNotNull(expirationTime);
    }

    /**
     * Getter of token object.
     *
     * @return token object.
     */
    @Override
    public Token identifier() {
        return token;
    }

    /**
     * Getter of user id.
     *
     * @return user id value.
     */
    public UserId userId() {
        return userId;
    }

    /**
     * Getter of expiration time object.
     *
     * @return expiration time object.
     */
    public ExpirationTime expirationTime() {
        return expirationTime;
    }

    @Override
    public boolean equals(Object o) {

        if (this == o) {
            return true;
        }

        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        LoggedInUserRecord that = (LoggedInUserRecord) o;

        return Objects.equals(token, that.token) &&
            Objects.equals(userId, that.userId) &&
            Objects.equals(expirationTime, that.expirationTime);
    }

    @Override
    public int hashCode() {

        return hash(token, userId, expirationTime);
    }

    @Override
    public String toString() {

        return "LoggedInUserRecord {" +
            "token=" + token +
            ", userId=" + userId +
            ", expirationTime=" + expirationTime +
            '}';
    }
}
