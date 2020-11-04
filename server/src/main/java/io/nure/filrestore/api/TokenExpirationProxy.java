package io.nure.filrestore.api;

import io.nure.filestore.storage.ExpirationTime;
import io.nure.filestore.storage.LoggedInUserRecord;
import io.nure.filestore.storage.LoggedInUsersStorage;
import io.nure.filestore.storage.Token;
import org.slf4j.Logger;

import java.util.Collection;
import java.util.Optional;

import static com.google.common.base.Preconditions.checkNotNull;
import static java.time.Instant.now;
import static org.slf4j.LoggerFactory.getLogger;

/**
 * A proxy of {@link LoggedInUsersStorage}. Validates expiration time of the {@link LoggedInUserRecord} when
 * retrieving it from the storage.
 */
public class TokenExpirationProxy extends LoggedInUsersStorage {

    private static final Logger logger = getLogger(TokenExpirationProxy.class);

    /**
     * Actual storage of {@link LoggedInUserRecord}s.
     */
    private final LoggedInUsersStorage storage;

    /**
     * Instantiates TokenExpirationProxy.
     *
     * @param storage a storage of logged in users.
     */
    public TokenExpirationProxy(LoggedInUsersStorage storage) {
        this.storage = checkNotNull(storage);
    }

    /**
     * Retrieves {@link LoggedInUserRecord} from {@link LoggedInUsersStorage} if it has valid {@link ExpirationTime}.
     * Removes the record if it expired {@link ExpirationTime}.
     *
     * @param token token of requested record.
     * @return logged in user record, wrapped in {@link Optional}.
     * @throws TokenNotFoundException if token was not found in {@link LoggedInUsersStorage}.
     * @throws TokenExpiredException  if token expired {@link ExpirationTime}.
     */
    @Override
    public Optional<LoggedInUserRecord> get(Token token) throws TokenExpiredException, TokenNotFoundException {

        if (logger.isInfoEnabled()) {
            logger.info("Retrieving user record from the storage of logged in users by token: {}.", token);
        }

        checkNotNull(token);

        LoggedInUserRecord record = retrieveRecord(token);

        if (isRecordExpired(record)) {

            if (logger.isInfoEnabled()) {
                logger.info("Token has expired. {}", token);
            }

            deleteRecord(token);

            failExpirationTimeValidation(token);
        }

        return Optional.of(record);
    }

    /**
     * Fails validation of {@link ExpirationTime} of the {@link Token}.
     *
     * @param token validated token.
     * @throws TokenExpiredException to notify caller about failed validation of {@link ExpirationTime}.
     */
    private void failExpirationTimeValidation(Token token) throws TokenExpiredException {

        throw new TokenExpiredException(format("Token has expired. Token: %s.", token.value()));
    }

    /**
     * Deletes {@link LoggedInUserRecord} from the storage by {@link Token}.
     *
     * @param token token - identifier of the record to delete.
     */
    private void deleteRecord(Token token) {

        storage.delete(token);
    }

    /**
     * Validates expiration time of {@link LoggedInUserRecord}.
     *
     * @param record record to validate.
     * @return true if {@link ExpirationTime} of the record has run out of time.
     */
    private boolean isRecordExpired(LoggedInUserRecord record) {

        return record.expirationTime().value().isBefore(now());
    }

    /**
     * Retrieves {@link LoggedInUserRecord} by passed token.
     *
     * @param token token of logged-in user.
     * @return logged-in user record.
     * @throws TokenNotFoundException if record is not found by passed token.
     */
    private LoggedInUserRecord retrieveRecord(Token token) {

        return storage
            .get(token)
            .orElseThrow(() -> {

                if (logger.isInfoEnabled()) {
                    logger.info("Token was not found in the storage: {}.", token);
                }

                return new TokenNotFoundException(
                    format("Record with token %s was not found in the storage.", token.value())
                );
            });
    }

    /**
     * Retrieves {@link Collection} of all {@link LoggedInUserRecord}s that are currently in the storage.
     *
     * @return {@link Collection} of all storage records {@link LoggedInUserRecord}.
     */
    @Override
    public Collection<LoggedInUserRecord> getAll() {
        return storage.getAll();
    }

    /**
     * <p>Puts record {@link LoggedInUserRecord} into the storage. Replaces existing record if it was found by passed
     * {@link Token}.
     *
     * @param record - {@link LoggedInUserRecord} to put in the storage.
     */
    @Override
    public void put(LoggedInUserRecord record) {
        storage.put(checkNotNull(record));
    }

    /**
     * Deletes record {@link LoggedInUserRecord} from the storage if it was found by passed {@link Token}.
     *
     * @param identifier - {@link Token} of the record to delete.
     * @return deleted record wrapped into {@link Optional} or {@link Optional#empty()} if record was not found in the
     * storage.
     */
    @Override
    public Optional<LoggedInUserRecord> delete(Token identifier) {
        return storage.delete(checkNotNull(identifier));
    }
}
