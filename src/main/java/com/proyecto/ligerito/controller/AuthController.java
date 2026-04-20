package com.proyecto.ligerito.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.proyecto.ligerito.model.Usuario;
import com.proyecto.ligerito.dto.LoginRequest;
import com.proyecto.ligerito.dto.LoginResponse;
import com.proyecto.ligerito.dto.RegisterRequest;
import com.proyecto.ligerito.dto.RegisterResponse;
import com.proyecto.ligerito.service.UsuarioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UsuarioService usuarioService;

    public AuthController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest request) {
        Usuario usuarioGuardado = usuarioService.registrarUsuario(request);

        RegisterResponse response = new RegisterResponse(
                usuarioGuardado.getId(),
                usuarioGuardado.getNick(),
                usuarioGuardado.getEmail());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = usuarioService.loginUsuario(request);
        return ResponseEntity.ok(response);
    }
}
