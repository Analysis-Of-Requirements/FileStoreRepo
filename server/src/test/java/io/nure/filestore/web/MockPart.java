package io.nure.filestore.web;

import javax.servlet.http.Part;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Collection;

import static com.google.common.base.Preconditions.checkNotNull;

/**
 * The mock of {@link Part}. Mocks {@link Part#getInputStream()}, {@link Part#getSubmittedFileName()},
 * {@link Part#getHeader(String)}, {@link Part#getSize()} methods.
 */
class MockPart implements Part {

    private final byte[] partBody;

    private final String submittedFileName;

    private final String contentTypeHeader;

    private final long partSize;

    /**
     * Creates instance of MockPart with set data.
     *
     * @param partBody          the content of the file.
     * @param submittedFileName submitted file name.
     * @param contentTypeHeader the value of 'Content-Type' header.
     * @param partSize          the size of the submitted file.
     */
    public MockPart(byte[] partBody, String submittedFileName, String contentTypeHeader, long partSize) {

        this.partBody = checkNotNull(partBody);
        this.submittedFileName = checkNotNull(submittedFileName);
        this.contentTypeHeader = checkNotNull(contentTypeHeader);
        this.partSize = partSize;
    }

    @Override
    public InputStream getInputStream() {
        return new ByteArrayInputStream(partBody);
    }

    @Override
    public String getContentType() {
        return null;
    }

    @Override
    public String getName() {
        return null;
    }

    @Override
    public String getSubmittedFileName() {
        return submittedFileName;
    }

    @Override
    public long getSize() {
        return partSize;
    }

    @Override
    public void write(String fileName) throws IOException {

    }

    @Override
    public void delete() throws IOException {

    }

    @Override
    public String getHeader(String name) {
        return contentTypeHeader;
    }

    @Override
    public Collection<String> getHeaders(String name) {
        return null;
    }

    @Override
    public Collection<String> getHeaderNames() {
        return null;
    }
}
