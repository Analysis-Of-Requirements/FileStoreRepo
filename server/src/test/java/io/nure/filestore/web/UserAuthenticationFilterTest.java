package io.nure.filestore.web;

import io.nure.filestore.storage.UserId;
import io.nure.filestore.api.LoggedInUser;
import io.nure.filestore.storage.ExpirationTime;
import io.nure.filestore.storage.LoggedInUserRecord;
import io.nure.filestore.storage.LoggedInUsersStorage;
import io.nure.filestore.storage.Token;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import spark.HaltException;
import spark.Request;
import spark.Response;


import static com.google.common.truth.Truth.assertWithMessage;
import static io.nure.filestore.api.IdGenerator.generateId;
import static io.nure.filestore.api.ExpirationTimeCreator.expireAfterDays;
import static java.lang.String.format;
import static java.time.Instant.EPOCH;
import static java.util.Arrays.stream;
import static org.junit.jupiter.api.Assertions.assertThrows;

@DisplayName("UserAuthenticationFilter should ")
class UserAuthenticationFilterTest {

    private static LoggedInUsersStorage createStorage(LoggedInUserRecord... records) {

        LoggedInUsersStorage storage = new LoggedInUsersStorage();

        stream(records).forEach(storage::put);

        return storage;
    }

    private static LoggedInUserRecord createRecord(Token token, boolean expired) {

        int days = 2;

        return new LoggedInUserRecord(token, new UserId(generateId()),
            expired ? new ExpirationTime(EPOCH) : expireAfterDays(days));
    }

    private static Token createToken() {

        return new Token(generateId());
    }

    private static Request createMockRequest(Token token) {

        return new Request() {

            @Override
            public String headers(String header) {

                return format("Bearer %s", token.value());
            }

            @Override
            public String requestMethod() {
                return "GET";
            }

            @Override
            public String pathInfo() {
                return "root";
            }
        };
    }

    private static Response createResponse() {

        return new Response() {
        };
    }

    private static UserAuthenticationFilter createFilter(LoggedInUsersStorage storage) {

        return new UserAuthenticationFilter(storage);
    }

    private static LoggedInUser createUser(UserId identifier) {

        return new LoggedInUser(identifier);
    }

    private LoggedInUser getActualUser() {

        return CurrentLoggedInUser.user();
    }

    @DisplayName("accept request with valid token.")
    @Test
    void testPassingWellFormedRequest() {

        Token token = createToken();
        LoggedInUserRecord loggedInUserRecord = createRecord(token, false);
        UserAuthenticationFilter filter = createFilter(createStorage(loggedInUserRecord));
        Request request = createMockRequest(token);
        Response response = createResponse();
        LoggedInUser expectedUser = createUser(loggedInUserRecord.userId());

        filter.handle(request, response);

        assertWithMessage("Cannot accept request with valid token.")
            .that(getActualUser())
            .isEqualTo(expectedUser);
    }

    @DisplayName("not accept request with expired token.")
    @Test
    void testFilteringRequestWithInvalidToken() {

        Token token = createToken();
        LoggedInUserRecord loggedInUserRecord = createRecord(token, true);
        UserAuthenticationFilter filter = createFilter(createStorage(loggedInUserRecord));
        Request request = createMockRequest(token);
        Response response = createResponse();

        assertThrows(
            HaltException.class,
            () -> filter.handle(request, response),
            "Cannot filter request with invalid token."
        );
    }

    @DisplayName("not accept request if user is not authenticated.")
    @Test
    void testFilteringRequestIfNotAuthenticatedUser() {

        UserAuthenticationFilter filter = createFilter(createStorage());
        Request request = createMockRequest(createToken());
        Response response = createResponse();

        assertThrows(
            HaltException.class,
            () -> filter.handle(request, response),
            "Cannot filter request with not authenticated user."
        );
    }
}
