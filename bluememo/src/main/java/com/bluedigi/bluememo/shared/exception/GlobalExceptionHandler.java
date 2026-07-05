package com.bluedigi.bluememo.shared.exception;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(
        MethodArgumentNotValidException ex,
        HttpServletRequest request
    ) {
        String errorMessage = ex.getBindingResult().getFieldErrors().stream()
            .map(error -> error.getField() + ": " + error.getDefaultMessage())
            .findFirst()
            .orElse("Validation error");

        return buildResponse(errorMessage, HttpStatus.BAD_REQUEST, request.getRequestURI());
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErrorResponse> handleResponseStatusException(
            ResponseStatusException exception,
            HttpServletRequest request
    ) {
        
        HttpStatus status = HttpStatus.valueOf(exception.getStatusCode().value());

        return buildResponse(
                exception.getReason(),
                status,
                request.getRequestURI()
        );
    }


    private ResponseEntity<ErrorResponse> buildResponse(
            String message,
            HttpStatus status,
            String path
    ) {
        ErrorResponse errorResponse = new ErrorResponse(
                message,
                status.value(),
                path,
                LocalDateTime.now()
        );

        return ResponseEntity.status(status).body(errorResponse);
    }
}
