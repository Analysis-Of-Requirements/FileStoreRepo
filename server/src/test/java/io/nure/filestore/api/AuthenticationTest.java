package io.nure.filestore.api;

import com.google.common.testing.NullPointerTester;
import io.nure.filestore.storage.LoginName;
import io.nure.filestore.storage.Password;
import io.nure.filestore.storage.UserId;
import io.nure.filestore.storage.UserRecord;
import io.nure.filestore.storage.UserStorage;
import io.nure.filrestore.api.AuthenticateUser;
import io.nure.filrestore.api.Authentication;
import io.nure.filrestore.api.UserNotAuthenticatedException;
import io.nure.filrestore.storage.LoggedInUsersStorage;
import io.nure.filrestore.storage.Token;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;


import static com.google.common.truth.Truth.assertWithMessage;
import static io.nure.filestore.api.HashEncoder.encode;
import static io.nure.filestore.api.IdGenerator.generateId;
import static java.util.Arrays.stream;
import static org.junit.jupiter.api.Assertions.assertThrows;

@DisplayName("Authentication process should ")
class AuthenticationTest {

    private static UserStorage createUserStorage(UserRecord... records) {

        UserStorage storage = new UserStorage();

        stream(records).forEach(storage::put);

        return storage;
    }

    private static LoggedInUsersStorage createTokenStorage() {

        return new LoggedInUsersStorage();
    }

    private static AuthenticateUser createCommand(String loginName, String password) {

        return new AuthenticateUser(new LoginName(loginName), new Password(password));
    }

    private static UserRecord createUserRecord(String login, String password) {

        return new UserRecord(new UserId(generateId()), new LoginName(login), encode(password));
    }

    @DisplayName("fail if no user was found for provided login and password.")
    @Test
    void testFailedAuthentication() {

        String loginName = "admin";
        String password = "qwerty123A";
        Authentication process = new Authentication(createUserStorage(), createTokenStorage());

        assertThrows(
            UserNotAuthenticatedException.class,
            () -> process.handle(createCommand(loginName, password)),
            "Cannot fail when no user found."
        );
    }

    @DisplayName("return token if authentication succeeded.")
    @Test
    void testSuccessfulAuthentication() {

        String loginName = "admin";
        String password = "qwerty123A";
        UserStorage userStorage = createUserStorage(createUserRecord(loginName, password));
        Authentication process = new Authentication(userStorage, createTokenStorage());

        try {

            Token token = process.handle(createCommand(loginName, password));

            assertWithMessage("Cannot return token in case of successful authentication.")
                .that(token)
                .isNotNull();

        } catch (UserNotAuthenticatedException e) {

            assertWithMessage("Cannot authenticate existing user.").fail();
        }
    }

    @DisplayName("not accept null parameters in constructor.")
    @Test
    void testFailedInitialization() {

        NullPointerTester tester = new NullPointerTester();
        tester.setDefault(UserStorage.class, createUserStorage());
        tester.setDefault(LoggedInUsersStorage.class, createTokenStorage());

        tester.testAllPublicConstructors(Authentication.class);
    }

    @DisplayName("not accept null command in handle().")
    @Test
    void testNullCommand() throws NoSuchMethodException {

        NullPointerTester tester = new NullPointerTester();

        tester.testMethod(
            new Authentication(createUserStorage(), createTokenStorage()),
            Authentication.class.getMethod("handle", AuthenticateUser.class)
        );
    }
}
