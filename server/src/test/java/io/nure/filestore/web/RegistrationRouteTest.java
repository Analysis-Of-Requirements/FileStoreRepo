package io.nure.filestore.web;

import io.nure.filestore.storage.FolderStorage;
import io.nure.filestore.storage.LoginName;
import io.nure.filestore.storage.UserId;
import io.nure.filestore.storage.UserRecord;
import io.nure.filestore.storage.UserStorage;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import spark.Request;
import spark.Response;

import java.util.UUID;
import java.util.stream.Stream;

import static com.google.common.truth.Truth.assertWithMessage;
import static io.nure.filestore.web.ResponseStatus.SUCCESS;
import static io.nure.filestore.web.ResponseStatus.UNPROCESSABLE_ENTITY;
import static java.lang.String.format;

@DisplayName("Registration Route should ")
class RegistrationRouteTest {

    private static Stream<Arguments> validJsonUserCredentials() {

        return Stream.of(
            Arguments.of(createJsonCredentials("admin", "qwerty123A")),
            Arguments.of(createJsonCredentials("zigmo", "abcd21Si")),
            Arguments.of(createJsonCredentials("length123SF", "3vmsSdfSa"))
        );
    }

    private static Stream<Arguments> invalidJsonUserCredentials() {

        return Stream.of(
            Arguments.of(createJsonCredentials("admin", "qwerty")),
            Arguments.of(createJsonCredentials("50", "qwerty123A"))
        );
    }

    private static Stream<Arguments> invalidLoginNames() {

        return Stream.of(
            Arguments.of("login"),
            Arguments.of("abcd"),
            Arguments.of("1234dffbDF")
        );
    }

    private static String createJsonCredentials(String login, String password) {

        return format("{" +
            "\"login\":\"%s\"," +
            "\"password\":\"%s\"" +
            "}", login, password);
    }

    private static RegistrationRoute createRoute(UserStorage storage) {

        return new RegistrationRoute(storage, new FolderStorage());
    }

    private static RegistrationRoute createRoute() {

        return createRoute(new UserStorage());
    }

    private static UserStorage createStorage(UserRecord record) {

        UserStorage storage = new UserStorage();

        storage.put(record);

        return storage;
    }

    private static UserRecord createRecord(String loginName) {

        return new UserRecord(
            new UserId(UUID.randomUUID().toString()),
            new LoginName(loginName),
            "qwerty123A"
        );
    }

    private static String failedCredentialsErrorMessage() {

        return "{\"validationErrors\":[{\"field\":\"login\",\"message\":\"Login or password is incorrect. " +
            "Please, try again.\"}]}";
    }

    private static String failedRegistrationProcessErrorMessage(String loginName) {

        return format("{\"validationErrors\":[{\"field\":\"login\",\"message\":\"There is already a user registered " +
            "with such login name: %s.\"}]}", loginName);
    }

    private static Request createMockRequest(String body) {

        return new Request() {

            @Override
            public String body() {

                return body;
            }
        };
    }

    private static Response createMockResponse() {

        return new Response() {

            private int status;

            @Override
            public void status(int statusCode) {
                status = statusCode;
            }

            @Override
            public int status() {
                return status;
            }
        };
    }

    @DisplayName("successfully handle registration request.")
    @ParameterizedTest
    @MethodSource("validJsonUserCredentials")
    void testSuccessfulHandling(String serializedRegisterUserCommand) {

        RegistrationRoute route = createRoute();
        Request request = createMockRequest(serializedRegisterUserCommand);
        Response response = createMockResponse();

        assertWithMessage("Cannot handle successful registration.")
            .that(route.handle(request, response))
            .isEqualTo(SUCCESS);
    }

    @DisplayName("respond with validation error for invalid credentials.")
    @ParameterizedTest
    @MethodSource("invalidJsonUserCredentials")
    void testFailedUserCredentialsParsing(String json) {

        RegistrationRoute handler = createRoute();
        Request request = createMockRequest(json);
        Response response = createMockResponse();

        assertWithMessage("Cannot handle failed registration for invalid login or password.")
            .that(handler.handle(request, response))
            .isEqualTo(failedCredentialsErrorMessage());

        assertWithMessage("Cannot return validation error status for invalid login or password.")
            .that(response.status())
            .isEqualTo(UNPROCESSABLE_ENTITY);
    }

    @DisplayName("respond with validation error if registration process fails.")
    @ParameterizedTest
    @MethodSource("invalidLoginNames")
    void testFailedRegistrationProcess(String loginName) {

        RegistrationRoute route = createRoute(createStorage(createRecord(loginName)));
        Request request = createMockRequest(createJsonCredentials(loginName, "qwerty123A"));
        Response response = createMockResponse();

        assertWithMessage("Cannot handle failed registration process.")
            .that(route.handle(request, response))
            .isEqualTo(failedRegistrationProcessErrorMessage(loginName));

        assertWithMessage(
            "Cannot return validation error status for when registration process failed."
        )
            .that(response.status())
            .isEqualTo(UNPROCESSABLE_ENTITY);
    }
}
