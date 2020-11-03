package io.nure.filestore.web;

/**
 * Constants of HTTP response status codes. {@link "https://en.wikipedia.org/wiki/List_of_HTTP_status_codes"}.
 */
public final class ResponseStatus {

    /**
     * Standard response for successful HTTP requests.
     */
    public final static int SUCCESS = 200;

    /**
     * The server could not understand the request due to invalid syntax.
     */
    public final static int BAD_REQUEST = 400;

    /**
     * Used when authentication is required and has failed or has not yet been provided.
     */
    public final static int UNAUTHORIZED = 401;

    /**
     * The client does not have access rights to the content.
     */
    public final static int FORBIDDEN = 403;

    /**
     * The server can not find the requested resource.
     */
    public final static int NOT_FOUND = 404;

    /**
     * The request was well-formed but was unable to be followed due to semantic errors.
     */
    public final static int UNPROCESSABLE_ENTITY = 422;

    /**
     * The server encountered an unexpected condition which prevented it from fulfilling the request.
     */
    public final static int INTERNAL_SERVER_ERROR = 500;

    /**
     * This allows only static reference to class, because there is no use of the instance of this class.
     */
    private ResponseStatus() {
    }
}
