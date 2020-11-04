package io.nure.filrestore.api;

import io.nure.filestore.web.FileStoreWebApplication;

import java.time.ZoneId;
import java.util.TimeZone;

import static java.util.TimeZone.getTimeZone;

/**
 * A provider of {@link TimeZone} that is used by {@link FileStoreWebApplication}.
 */
public class ApplicationTimeZoneProvider {

    /**
     * An identifier for a time offset from UTC of +02:00. <a href="https://en.wikipedia.org/wiki/UTC%2B02:00">See</a>.
     */
    private static final String APPLICATION_TIME_ZONE_ID = "UTC+02:00";

    /**
     * This allows only static reference to class, because there is no use of the instance of this class.
     */
    private ApplicationTimeZoneProvider() {
    }

    /**
     * Retrieves {@link TimeZone} of the application.
     *
     * @return time zone of the application.
     */
    public static TimeZone timeZone() {

        return getTimeZone(ZoneId.of(APPLICATION_TIME_ZONE_ID));
    }
}
