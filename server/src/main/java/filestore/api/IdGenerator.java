package filestore.api;

import org.slf4j.Logger;

import static java.util.Base64.getUrlEncoder;
import static java.util.concurrent.ThreadLocalRandom.current;
import static org.slf4j.LoggerFactory.getLogger;

/**
 * Generator of identifiers.
 *
 * <p>Generated identifier is unique among others, created by generator.
 * <p>See <a href="https://neilmadden.blog/2018/08/30/moving-away-from-uuids/">article</a>.
 *
 * <p>This implementation is thread-safe.
 * See <a href="https://stackoverflow.com/questions/1461568/is-securerandom-thread-safe">article</a>.
 * See another
 * <a href="https://plumbr.io/blog/locked-threads/shooting-yourself-in-the-foot-with-random-number-generators">article
 * </a>.
 */
public class IdGenerator {

    private static final Logger logger = getLogger(IdGenerator.class);

    /**
     * This allows only static reference to class, because there is no use of the instance of this class.
     */
    private IdGenerator() {
    }

    /**
     * Generates 20-byte random identifier.
     *
     * @return generated identifier.
     */
    public static String generateId() {

        if (logger.isInfoEnabled()) {
            logger.info("Call to IdGenerator.generateId().");
        }

        byte[] base = new byte[20];
        current().nextBytes(base);

        return getUrlEncoder().withoutPadding().encodeToString(base);
    }
}
