package io.nure.filestore.api;

import com.google.common.testing.NullPointerTester;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;

import static com.google.common.truth.Truth.assertWithMessage;
import static io.nure.filestore.api.HashEncoder.encode;
import static java.util.concurrent.Executors.newFixedThreadPool;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

@DisplayName("HashEncoder should ")
class HashEncoderTest {

    @DisplayName("correctly encode source string to hash.")
    @Test
    void testHashEncoding() {

        String source = "qwerty123A";
        String expected = "4A65FAF1C96C3BBBF1FD836046D83752219915EFF2D778F665B7CEA112A43470";
        String actual = encode(source);

        assertWithMessage("Is not able to encode source string to hash.")
            .that(actual)
            .isEqualTo(expected);
    }

    @DisplayName("fail when null source is passed.")
    @Test
    void testInvalidInput() {

        new NullPointerTester().testAllPublicStaticMethods(HashEncoder.class);
    }

    @DisplayName("not fail when used by multiple threads.")
    @Test
    void testMultithreadedHashEncoding() {

        int threadsNumber = 30;

        ExecutorService executorService = newFixedThreadPool(threadsNumber);
        CountDownLatch waiter = new CountDownLatch(threadsNumber);

        for (int i = 0; i < threadsNumber; ++i) {

            executorService.execute(() -> {

                int largeNumber = 1000;
                String testData = "qwerty123A";

                for (int j = 0; j < largeNumber; j++) {

                    assertDoesNotThrow(
                        () -> encode(testData),
                        "Cannot encode data when used by multiple threads."
                    );
                }

                waiter.countDown();
            });
        }

        try {

            waiter.await();
            executorService.shutdown();

        } catch (InterruptedException e) {

            assertWithMessage("An error happened while waiting threads to finish.").fail();
        }
    }
}
