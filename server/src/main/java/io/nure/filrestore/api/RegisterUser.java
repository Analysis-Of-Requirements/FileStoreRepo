package io.nure.filrestore.api;

import io.nure.filestore.storage.InvalidLoginException;
import io.nure.filestore.storage.LoginName;
import io.nure.filestore.storage.Password;
import io.nure.filestore.web.FileStoreWebApplication;
import org.slf4j.Logger;

import static com.google.common.base.Preconditions.checkNotNull;
import static java.lang.String.format;
import static org.slf4j.LoggerFactory.getLogger;

/**
 * Command to register user with particular {@link LoginName} and {@link Password}
 * into FileHub application {@link FileStoreWebApplication}.
 */
public class RegisterUser implements Command {

    private static final Logger logger = getLogger(RegisterUser.class);

    /**
     * User login. Should have not-null value that is at least 4 characters long.
     */
    private final LoginName loginName;

    /**
     * User password. Should have non-null value that is at least 8 characters long.
     */
    private final Password password;

    /**
     * Instantiates RegisterUser command.
     *
     * @param loginName - user login object.
     * @param password  - user password object.
     */
    public RegisterUser(LoginName loginName, Password password) throws InvalidLoginException {

        if (logger.isInfoEnabled()) {

            logger.info("Creating RegisterUser instance with \"{}\" and \"{}\".", loginName, password);
        }

        this.loginName = checkNotNull(loginName);
        this.password = checkNotNull(password);
    }

    /**
     * Getter for user login.
     *
     * @return user login object.
     */
    public LoginName login() {
        return loginName;
    }

    /**
     * Getter for user password.
     *
     * @return user password object.
     */
    public Password password() {
        return password;
    }

    @Override
    public String toString() {

        return format("RegisterUser: {%s, %s}", loginName, password);
    }
}
