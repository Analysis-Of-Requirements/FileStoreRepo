package io.nure.filestore.api;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;

import static com.google.common.truth.Truth.assertWithMessage;
import static io.nure.filestore.api.IdGenerator.generateId;
import static java.util.Collections.synchronizedSet;
import static java.util.concurrent.Executors.newFixedThreadPool;

@DisplayName("Id generator should ")
class IdGeneratorTest {

    @DisplayName("generate random identifier, that is different from previous ones.")
    @Test
    void testIdUniqueness() {

        final int largeNumber = 1000;
        String[] ids = new String[largeNumber];

        for (int i = 0; i < largeNumber; ++i) {
            ids[i] = generateId();
        }

        for (int i = 0; i < largeNumber; i++) {

            for (int j = 0; j < largeNumber; ++j) {

                // in case of pointers point at the same element.
                if (i == j) {

                    continue;
                }

                if (ids[i].equals(ids[j])) {

                    assertWithMessage("Duplicate identifier is found, but should't.").fail();
                }
            }
        }
    }

    @DisplayName("generate unique identifiers in multiple threads.")
    @Test
    void testMultithreadedIdGenerating() {

        int threadsNumber = 30;

        ExecutorService executorService = newFixedThreadPool(threadsNumber);
        CountDownLatch waiter = new CountDownLatch(threadsNumber);
        Set<String> identifiers = synchronizedSet(new HashSet<>());

        for (int i = 0; i < threadsNumber; ++i) {

            executorService.execute(() -> {

                int largeNumber = 1000;

                for (int j = 0; j < largeNumber; j++) {

                    if (!identifiers.add(generateId())) {

                        assertWithMessage("Duplicate identifier is generated, but should't.").fail();
                    }
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
