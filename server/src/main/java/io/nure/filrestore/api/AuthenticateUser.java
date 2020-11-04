package io.nure.filrestore.api;

import io.nure.filestore.storage.LoginName;
import io.nure.filestore.storage.Password;
import io.nure.filestore.storage.UserRecord;
import org.slf4j.Logger;

import static com.google.common.base.Preconditions.checkNotNull;
import static org.slf4j.LoggerFactory.getLogger;

/**
 * The command to authenticate user {@link UserRecord} with particular {@link LoginName}
 * and {@link Password}.
 */
public class AuthenticateUser {

    private static final Logger logger = getLogger(AuthenticateUser.class);

    /**
     * A user login.
     */
    private final LoginName loginName;

    /**
     * A user password.
     */
    private final Password password;

    /**
     * Instantiates AuthenticateUser command.
     *
     * @param loginName user login.
     * @param password  user password.
     */
    public AuthenticateUser(LoginName loginName, Password password) {

        if (logger.isInfoEnabled()) {
            logger.info("Creating AuthenticateUser instance with \"{}\" and \"{}\".", loginName, password);
        }

        this.loginName = checkNotNull(loginName);
        this.password = checkNotNull(password);
    }

    /**
     * Getter for user login.
     *
     * @return user login.
     */
    public LoginName loginName() {
        return loginName;
    }

    /**
     * Getter for user password.
     *
     * @return user password.
     */
    public Password password() {
        return password;
    }

    @Override
    public String toString() {

        return "AuthenticateUser {" +
            "loginName=" + loginName +
            ", password=" + password +
            '}';
    }
}
