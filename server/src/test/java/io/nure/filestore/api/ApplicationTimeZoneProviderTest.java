package io.nure.filestore.api;

import java.time.ZoneId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;


import static com.google.common.truth.Truth.assertWithMessage;
import static java.util.TimeZone.getTimeZone;

@DisplayName("ServerTimeZoneProvider should ")
class ApplicationTimeZoneProviderTest {

    @DisplayName("provide caller with correct time zone.")
    @Test
    void testCreatedTimeZone() {

        String expectedTimeZone = getTimeZone(ZoneId.of("UTC+02:00")).getDisplayName();

        assertWithMessage("Cannot supply caller with expected time-zone.")
            .that(ApplicationTimeZoneProvider.timeZone().getDisplayName())
            .isEqualTo(expectedTimeZone);
    }
}
