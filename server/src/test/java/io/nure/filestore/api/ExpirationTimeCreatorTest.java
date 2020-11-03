package io.nure.filestore.api;

import com.google.common.collect.Range;
import io.nure.filrestore.api.ApplicationTimeZoneProvider;
import io.nure.filrestore.api.ExpirationTimeCreator;
import io.nure.filrestore.storage.ExpirationTime;
import java.util.Calendar;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;


import static com.google.common.collect.BoundType.OPEN;
import static com.google.common.collect.Range.range;
import static com.google.common.truth.Truth.assertWithMessage;
import static java.time.Instant.now;
import static java.util.Calendar.DAY_OF_MONTH;
import static java.util.Calendar.getInstance;
import static org.junit.jupiter.api.Assertions.assertThrows;

@DisplayName("ExpirationTimeCreator should ")
class ExpirationTimeCreatorTest {

    private static Range<Long> expectedRange(int daysDue) {

        Calendar calendar = getInstance();
        calendar.setTimeZone(ApplicationTimeZoneProvider.timeZone());
        calendar.setTimeInMillis(now().toEpochMilli());
        calendar.add(DAY_OF_MONTH, daysDue);
        int deltaMs = 100;

        return range(calendar.getTimeInMillis() - deltaMs, OPEN,
            calendar.getTimeInMillis() + deltaMs, OPEN);
    }

    @DisplayName("fail in case of negative value passed.")
    @Test
    void failExpirationDateCreating() {

        int negativeValue = -1;

        assertThrows(
            IllegalArgumentException.class,
            () -> ExpirationTimeCreator.expireAfterDays(negativeValue),
            "Cannot fail if negative value passed."
        );
    }

    @DisplayName("create valid expiration date.")
    @Test
    void testSuccessfulDateCreation() {

        int daysDue = 2;
        ExpirationTime expirationTime = ExpirationTimeCreator.expireAfterDays(daysDue);
        long actualMilliseconds = expirationTime.value().toEpochMilli();

        assertWithMessage("Cannot properly set expiration time.")
            .that(actualMilliseconds)
            .isIn(expectedRange(daysDue));
    }
}
