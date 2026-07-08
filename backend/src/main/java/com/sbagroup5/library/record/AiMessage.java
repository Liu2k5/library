package com.sbagroup5.library.record;

import java.io.Serializable;

public record AiMessage(String author, String content) implements Serializable {

}
