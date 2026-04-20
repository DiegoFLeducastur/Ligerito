package com.proyecto.ligerito.service;

import java.util.ArrayList;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.proyecto.ligerito.dto.LoginRequest;
import com.proyecto.ligerito.dto.LoginResponse;
import com.proyecto.ligerito.dto.RegisterRequest;
import com.proyecto.ligerito.exception.EmailDuplicadoException;
import com.proyecto.ligerito.exception.NickDuplicadoException;
import com.proyecto.ligerito.model.Usuario;
import com.proyecto.ligerito.repository.UsuarioRepository;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Usuario registrarUsuario(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new EmailDuplicadoException("Ya existe un usuario con ese email");
        }

        if (usuarioRepository.existsByNick(request.getNick())) {
            throw new NickDuplicadoException("Ya existe un usuario con ese nick");
        }
        Usuario usuario = new Usuario(
                null,
                request.getNick(),
                request.getEmail(),
                request.getPassword(),
                new ArrayList<>(),
                new ArrayList<>());

        return usuarioRepository.save(usuario);
    }

    public LoginResponse loginUsuario(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales incorrectas"));

        if (!usuario.getPassword().equals(request.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales incorrectas");
        }

        return new LoginResponse(
                usuario.getId(),
                usuario.getNick(),
                usuario.getEmail());
    }
}
