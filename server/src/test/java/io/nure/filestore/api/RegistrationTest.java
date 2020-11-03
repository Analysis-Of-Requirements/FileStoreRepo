package io.nure.filestore.api;

import com.google.common.testing.NullPointerTester;
import io.nure.filestore.storage.FolderStorage;
import io.nure.filestore.storage.LoginName;
import io.nure.filestore.storage.Password;
import io.nure.filestore.storage.UserId;
import io.nure.filestore.storage.UserRecord;
import io.nure.filestore.storage.UserStorage;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.stream.Stream;

import static com.google.common.truth.Truth.assertWithMessage;
import static io.nure.filestore.api.IdGenerator.generateId;
import static java.util.Arrays.stream;
import static org.junit.jupiter.api.Assertions.assertThrows;

@DisplayName("Registration process should ")
class RegistrationTest {

    private static Stream<Arguments> validRegisterUserCommands() {

        return Stream.of(
            Arguments.of(createRegisterUserCommand("admin", "qwerty123A")),
            Arguments.of(createRegisterUserCommand("50402", "qwertyABC1")),
            Arguments.of(createRegisterUserCommand("aAAAAA", "qwerty123A"))
        );
    }

    private static UserStorage createUserStorage(UserRecord... records) {

        UserStorage storage = new UserStorage();

        stream(records)
            .forEach(storage::put);

        return storage;
    }

    private static FolderStorage createFolderStorage() {

        return new FolderStorage();
    }

    private static RegisterUser createRegisterUserCommand(String login, String password) {

        return new RegisterUser(new LoginName(login), new Password(password));
    }

    private static UserRecord createUserRecord(String login, String password) {

        return new UserRecord(new UserId(generateId()), new LoginName(login), password);
    }

    @DisplayName("successfully register user.")
    @ParameterizedTest
    @MethodSource("validRegisterUserCommands")
    void testSuccessfulRegistration(RegisterUser command) {

        UserStorage userStorage = createUserStorage();
        FolderStorage folderStorage = createFolderStorage();

        new Registration(userStorage, folderStorage).handle(command);

        String encodedPassword = HashEncoder.encode(command.password().value());

        assertWithMessage("Registration process fails when correct login name and password were " +
            "provided.")
            .that(userStorage
                .getAll()
                .stream()
                .allMatch(record -> record.loginName().equals(command.login())
                    && record.passwordHash().equals(encodedPassword))
            ).isTrue();

        assertWithMessage("Cannot create root folder of registered user.")
            .that(folderStorage
                .getAll()
                .stream()
                .filter(record -> record.parentId() == null && record.name().value().equals("Root"))
                .count())
            .isEqualTo(1);
    }

    @DisplayName("fail in case of a found user with the same login.")
    @Test
    void testFailingRegistration() {

        String login = "mockLogin";
        String password = "qwerty123A";
        UserStorage userStorage = createUserStorage(createUserRecord(login, password));
        RegisterUser command = createRegisterUserCommand(login, password);

        assertThrows(
            UserAlreadyExistsException.class,
            () -> new Registration(userStorage, createFolderStorage()).handle(command),
            "Cannot fail if found user with the same login."
        );
    }

    @DisplayName("require not-null UserStorage to pass to constructor.")
    @Test
    void testFailedInitialization() {

        new NullPointerTester()
            .setDefault(FolderStorage.class, createFolderStorage())
            .setDefault(UserStorage.class, createUserStorage())
            .testAllPublicConstructors(Registration.class);
    }

    @DisplayName("require not-null RegisterUser command to pass to register().")
    @Test
    void testNullCommand() throws NoSuchMethodException {

        new NullPointerTester().testMethod(
            new Registration(createUserStorage(), createFolderStorage()),
            Registration.class.getDeclaredMethod("handle", RegisterUser.class)
        );
    }
}
