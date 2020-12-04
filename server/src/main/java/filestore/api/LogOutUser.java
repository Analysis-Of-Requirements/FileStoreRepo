package filestore.api;

import io.nure.filestore.storage.Token;

public class LogOutUser implements Command {

    private final Token token;

    public LogOutUser(Token token) {
        this.token = token;
    }

    public Token getToken() {
        return token;
    }
}
