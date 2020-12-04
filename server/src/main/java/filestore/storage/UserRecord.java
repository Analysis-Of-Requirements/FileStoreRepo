package filestore.storage;

import com.google.errorprone.annotations.Immutable;

import java.util.Objects;

import static com.google.common.base.Preconditions.checkNotNull;
import static java.util.Objects.hash;

/**
 * A unit of data, stored in {@link UserStorage}.
 */
@Immutable
public final class UserRecord implements Record<UserId> {

    /**
     * An identifier of the user.
     */
    private final UserId userId;

    /**
     * A login name of the user.
     */
    private final LoginName loginName;

    /**
     * A hash of the user {@link Password}.
     */
    private final String passwordHash;

    /**
     * Instantiates UserRecord.
     *
     * @param userId       user identifier.
     * @param loginName    user login.
     * @param passwordHash hash of user password.
     */
    public UserRecord(UserId userId, LoginName loginName, String passwordHash) {

        this.userId = checkNotNull(userId);
        this.loginName = checkNotNull(loginName);
        this.passwordHash = checkNotNull(passwordHash);
    }

    public static UserRecord fromDto(Dto dto) {
        return new UserRecord(new UserId(dto.user_id), new LoginName(dto.login_name), dto.password_hash);
    }

    /**
     * Getter for user login.
     *
     * @return user login,
     */
    public LoginName loginName() {
        return loginName;
    }

    /**
     * Getter for hash of user password.
     *
     * @return hash of user password.
     */
    public String passwordHash() {
        return passwordHash;
    }

    /**
     * Getter for user identifier.
     *
     * @return user identifier.
     */
    @Override
    public UserId identifier() {
        return userId;
    }

    @Override
    public boolean equals(Object o) {

        if (this == o) {

            return true;
        }

        if (o == null || getClass() != o.getClass()) {

            return false;
        }

        UserRecord that = (UserRecord) o;

        return Objects.equals(userId, that.userId) &&
            Objects.equals(loginName, that.loginName) &&
            Objects.equals(passwordHash, that.passwordHash);
    }

    @Override
    public int hashCode() {

        return hash(userId, loginName, passwordHash);
    }

    @Override
    public String toString() {

        return "UserRecord {" +
            "userId=" + userId +
            ", loginName=" + loginName +
            ", passwordHash='" + passwordHash + '\'' +
            '}';
    }

    public static final class Dto implements RecordDto {
        public String user_id;
        public String login_name;
        public String password_hash;
    }
}
