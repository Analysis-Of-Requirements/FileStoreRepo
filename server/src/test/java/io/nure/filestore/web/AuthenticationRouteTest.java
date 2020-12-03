package io.nure.filestore.web;

import com.google.common.testing.NullPointerTester;
import io.nure.filestore.storage.LoginName;
import io.nure.filestore.storage.UserId;
import io.nure.filestore.storage.UserRecord;
import io.nure.filestore.storage.UserStorage;
import io.nure.filestore.storage.LoggedInUserRecord;
import io.nure.filestore.storage.LoggedInUsersStorage;
import io.nure.filestore.storage.Token;

import java.util.Optional;
import java.util.stream.Stream;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import spark.Request;
import spark.Response;


import static com.google.common.truth.Truth.assertWithMessage;
import static io.nure.filestore.api.IdGenerator.generateId;
import static java.lang.String.format;
import static java.util.Optional.ofNullable;

@DisplayName("AuthenticationRoute should ")
class AuthenticationRouteTest {

    private static Stream<Arguments> invalidCredentialsJson() {

        return Stream.of(
            Arguments.of(
                createJsonCredentials("123ї", validPassword()),
                "login has restricted character"),
            Arguments.of(
                createJsonCredentials("123", validPassword()),
                "login is less than 4 characters long"),
            Arguments.of(
                createJsonCredentials(validLoginName(), "12345aA"),
                "password is less than 8 characters long"),
            Arguments.of(
                createJsonCredentials(validLoginName(), "12345aAї"),
                "password has restricted character"),
            Arguments.of(
                createJsonCredentials(validLoginName(), "123456AA"),
                "password missing lower-case Latin"),
            Arguments.of(
                createJsonCredentials(validLoginName(), "123456aa"),
                "password missing upper-case Latin"),
            Arguments.of(
                createJsonCredentials(validLoginName(), "abcdedfgAA"),
                "password missing digits")
        );
    }

    private static String createValidJsonCredentials() {

        return createJsonCredentials(validLoginName(), validPassword());
    }

    private static String createJsonCredentials(String login, String password) {

        return format("{" +
            "\"login\":\"%s\"," +
            "\"password\":\"%s\"" +
            "}", login, password);
    }

    private static UserRecord createUserRecord() {

        return createUserRecord(generateId());
    }

    private static UserRecord createUserRecord(String passwordHash) {

        return new UserRecord(new UserId(generateId()), new LoginName("admin"), passwordHash);
    }

    private static UserStorage createMockUserStorage(UserRecord record) {

        return new UserStorage() {

            @Override
            public Optional<UserRecord> get(LoginName loginName, String passwordHash) {

                return ofNullable(record);
            }
        };
    }

    private static UserStorage createMockUserStorage() {

        return createMockUserStorage(createUserRecord());
    }

    private static UserStorage createEmptyMockUserStorage() {

        return createMockUserStorage(null);
    }

    private static LoggedInUsersStorage createMockTokenStorage() {

        return new LoggedInUsersStorage() {

            private LoggedInUserRecord record;

            @Override
            public void put(LoggedInUserRecord record) {

                this.record = record;
            }

            @Override
            public Optional<LoggedInUserRecord> get(Token identifier) {

                return ofNullable(record);
            }
        };
    }

    private static AuthenticationRoute createRoute(UserStorage userStorage, LoggedInUsersStorage loggedInUsersStorage) {

        return new AuthenticationRoute(userStorage, loggedInUsersStorage);
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

    private static Token createToken() {

        return new Token(generateId());
    }

    private static String validPassword() {

        return "qwerty123A";
    }

    private static String validLoginName() {

        return "admin";
    }

    private static String tokenJsonMatcher() {

        return "^\\s*\\{\"token\":\".+\"}\\s*$";
    }

    private static String validationErrorMatcher() {

        return "^\\s*\\{" +
            "\\s*\"validationErrors\"\\s*:\\s*\\[" +
            "\\s*\\{" +
            "\\s*\"field\"\\s*:\\s*\".+\"\\s*," +
            "\\s*\"message\"\\s*:\\s*\".+\"\\s*" +
            "}\\s*" +
            "]\\s*" +
            "}\\s*$";
    }

    private static String authorizationErrorMessage(String loginName, String password) {

        return format(
            "No user found for passed login name \"%s\" and password \"%s\".",
            loginName, password
        );
    }

    private static String malformedRequestBody() {

        return "{\"hello\":\"World.\"}";
    }

    private static String badRequestErrorMessage() {

        return format("Malformed request body: %s", malformedRequestBody());
    }

    @DisplayName("successfully handle authentication.")
    @Test
    void testSuccessfulAuthentication() {

        UserRecord userRecord = createUserRecord(validPassword());
        UserStorage userStorage = createMockUserStorage(userRecord);
        LoggedInUsersStorage loggedInUsersStorage = createMockTokenStorage();
        AuthenticationRoute route = createRoute(userStorage, loggedInUsersStorage);
        Request request = createMockRequest(createValidJsonCredentials());
        Response response = createMockResponse();

        String tokenJson = (String) route.handle(request, response);

        assertWithMessage("Cannot deserialize response for successful authentication.")
            .that(tokenJson)
            .matches(tokenJsonMatcher());

        int success = 200;

        assertWithMessage("Cannot respond with expected status.")
            .that(response.status())
            .isEqualTo(success);

        assertWithMessage("Cannot put issued token to persistent storage.")
            .that(loggedInUsersStorage.get(createToken()).get().userId())
            .isEqualTo(userRecord.identifier());
    }

    @DisplayName("fail in case of wrong login or password.")
    @ParameterizedTest
    @MethodSource("invalidCredentialsJson")
    void failCredentialsValidation(String json, String errorMessage) {

        AuthenticationRoute route = createRoute(createMockUserStorage(), createMockTokenStorage());
        Request request = createMockRequest(json);
        Response response = createMockResponse();

        String validationErrorJson = (String) route.handle(request, response);

        assertWithMessage(format("Cannot create validation error response if %s.", errorMessage))
            .that(validationErrorJson)
            .matches(validationErrorMatcher());

        int validationErrorStatus = 422;

        assertWithMessage("Cannot respond with expected status.")
            .that(response.status())
            .isEqualTo(validationErrorStatus);
    }

    @DisplayName("fail if user was not found for passed credentials.")
    @Test
    void testFailingAuthenticationProcess() {

        UserRecord userRecord = createUserRecord(validPassword());
        AuthenticationRoute route = createRoute(createEmptyMockUserStorage(), createMockTokenStorage());
        Request request = createMockRequest(
            createJsonCredentials(userRecord.loginName().value(), userRecord.passwordHash())
        );
        Response response = createMockResponse();

        String authorizationErrorMessage = (String) route.handle(request, response);

        assertWithMessage("Cannot make correct response for authorization exception.")
            .that(authorizationErrorMessage)
            .isEqualTo(authorizationErrorMessage(userRecord.loginName().value(), userRecord.passwordHash()));

        int authenticationErrorStatus = 401;

        assertWithMessage("Cannot respond with expected status.")
            .that(response.status())
            .isEqualTo(authenticationErrorStatus);
    }

    @DisplayName("fail if client made malformed request.")
    @Test
    void testProcessingMalFormedRequest() {

        AuthenticationRoute route = createRoute(createEmptyMockUserStorage(), createMockTokenStorage());
        Request request = createMockRequest(malformedRequestBody());
        Response response = createMockResponse();

        String errorMessage = (String) route.handle(request, response);

        assertWithMessage("Cannot make correct response for authorization exception.")
            .that(errorMessage)
            .isEqualTo(badRequestErrorMessage());

        int badRequestErrorStatus = 400;

        assertWithMessage("Cannot respond with expected status.")
            .that(response.status())
            .isEqualTo(badRequestErrorStatus);
    }

    @DisplayName("reject null arguments in constructor.")
    @Test
    void failInitialization() {

        NullPointerTester tester = new NullPointerTester();
        tester.setDefault(UserStorage.class, createEmptyMockUserStorage());
        tester.setDefault(LoggedInUsersStorage.class, createMockTokenStorage());

        tester.testAllPublicConstructors(AuthenticationRoute.class);
    }
}
