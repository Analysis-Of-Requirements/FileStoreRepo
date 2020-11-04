package io.nure.filrestore.api;

import io.nure.filestore.storage.ExpirationTime;
import org.slf4j.Logger;

import java.util.Calendar;

import static java.time.Instant.now;
import static java.util.Calendar.DAY_OF_MONTH;
import static java.util.Calendar.getInstance;
import static org.slf4j.LoggerFactory.getLogger;

/**
 * The creator of {@link ExpirationTime} instances. Provides convenient API for creating {@link ExpirationTime} objects.
 */
public class ExpirationTimeCreator {

    private static final Logger logger = getLogger(ExpirationTimeCreator.class);

    /**
     * This allows only static reference to class, because there is no use of the instance of this class.
     */
    private ExpirationTimeCreator() {
    }

    /**
     * Creates {@link ExpirationTime} that will expire in provided number of days {@link Integer}.
     *
     * @param days number of days, after which time will expire.
     * @return created expiration time object.
     */
    public static ExpirationTime expireAfterDays(int days) {

        if (logger.isInfoEnabled()) {
            logger.info("Call to ExpirationTimeCreator.expireAfterDays(days: {}).", days);
        }

        if (days < 0) {
            throw new IllegalArgumentException("Cannot create time, that already expired.");
        }

        Calendar calendar = getInstance();
        calendar.setTimeZone(ApplicationTimeZoneProvider.timeZone());
        calendar.setTimeInMillis(now().toEpochMilli());
        calendar.add(DAY_OF_MONTH, days);

        return new ExpirationTime(calendar.toInstant());
    }
}
