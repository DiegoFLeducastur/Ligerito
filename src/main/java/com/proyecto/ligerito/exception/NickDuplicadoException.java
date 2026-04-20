package com.proyecto.ligerito.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class NickDuplicadoException extends RuntimeException {

    public NickDuplicadoException(String message) {
        super(message);
    }
}