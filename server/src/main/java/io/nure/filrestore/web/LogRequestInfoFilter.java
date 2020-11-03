package io.nure.filrestore.web;

import java.util.Arrays;
import org.slf4j.Logger;
import spark.Filter;
import spark.Request;
import spark.Response;


import static java.lang.String.format;
import static org.slf4j.LoggerFactory.getLogger;

/**
 * A {@link Filter} for logging info of {@link Request} coming on 'api/*' paths.
 */
public class LogRequestInfoFilter implements Filter {

    private static final Logger logger = getLogger(LogRequestInfoFilter.class);

    /**
     * Logs info of coming {@link Request}.
     *
     * @param request  request of client.
     * @param response server response.
     */
    @Override
    public void handle(Request request, Response response) {

        if (logger.isInfoEnabled()) {

            logger.info(
                "Request: {}: {}. Headers: {}.",
                request.requestMethod(),
                request.pathInfo(),
                Arrays.toString(request
                    .headers()
                    .stream()
                    .map(header -> format("%s: %s", header, request.headers(header)))
                    .toArray()
                )
            );
        }
    }
}
