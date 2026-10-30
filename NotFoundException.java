package com.stockanalyzer.exception;

public class NotFoundException extends RuntimeException {
    public NotFoundException(String what) { super(what + " was not found"); }
}
