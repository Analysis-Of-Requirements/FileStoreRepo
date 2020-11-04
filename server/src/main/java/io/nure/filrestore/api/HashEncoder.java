package io.nure.filrestore.api;

import org.slf4j.Logger;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import static com.google.common.base.Preconditions.checkNotNull;
import static java.nio.charset.StandardCharsets.UTF_8;
import static java.security.MessageDigest.getInstance;
import static javax.xml.bind.DatatypeConverter.printHexBinary;
import static org.slf4j.LoggerFactory.getLogger;

/**
 * Encoder of passed data into hash. Used to encode sensitive data.
 *
 * <p>This implementation is thread safe. {@link MessageDigest#getInstance(String)}.
 *
 * <p>Uses SHA-256 algorithm. <a href="https://en.wikipedia.org/wiki/SHA-2">See</a>.
 */
public class HashEncoder {

    private static final Logger logger = getLogger(HashEncoder.class);

    /**
     * This allows only static reference to class, because there is no use of the instance of this class.
     */
    private HashEncoder() {
    }

    /**
     * Encodes source string into hash.
     *
     * @param source - string to encode.
     * @return encoded hash.
     */
    public static String encode(String source) {

        if (logger.isInfoEnabled()) {
            logger.info("Attempt to encode \"{}\" to hash.", source);
        }

        checkNotNull(source);

        MessageDigest messageDigest;

        try {

            messageDigest = getInstance("SHA-256");

        } catch (NoSuchAlgorithmException e) {

            throw new RuntimeException("MessageDigest doesn't have SHA-256 algorithm provider.");
        }

        messageDigest.update(source.getBytes(UTF_8));
        byte[] encodedBytes = messageDigest.digest();

        return printHexBinary(encodedBytes).toUpperCase();
    }
}
