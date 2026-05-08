package com.proyecto.ligerito.service;

import java.util.ArrayList;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.proyecto.ligerito.dto.LoginRequest;
import com.proyecto.ligerito.dto.LoginResponse;
import com.proyecto.ligerito.dto.RegisterRequest;
import com.proyecto.ligerito.exception.EmailDuplicadoException;
import com.proyecto.ligerito.exception.NickDuplicadoException;
import com.proyecto.ligerito.model.Usuario;
import com.proyecto.ligerito.repository.UsuarioRepository;

/**
 * Servicio que gestiona la lógica de negocio de los usuarios.
 * Cubre el registro de nuevos usuarios, validando unicidad de email y nick,
 * y la autenticación mediante email y contraseña.
 */
@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Registra un nuevo usuario en el sistema.
     * Verifica que el email y el nick no estén ya en uso antes de persistir.
     *
     * @param request datos del nuevo usuario (nick, email y contraseña)
     * @return el {@link Usuario} recién creado y guardado en base de datos
     * @throws EmailDuplicadoException si ya existe un usuario con el mismo email
     * @throws NickDuplicadoException  si ya existe un usuario con el mismo nick
     */
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
                passwordEncoder.encode(request.getPassword()),
                new ArrayList<>(),
                new ArrayList<>());

        return usuarioRepository.save(usuario);
    }

    /**
     * Autentica a un usuario mediante email y contraseña.
     * La contraseña se compara en texto plano contra la almacenada en base de datos.
     *
     * @param request credenciales del usuario (email y contraseña)
     * @return {@link LoginResponse} con el ID, nick y email del usuario autenticado
     * @throws ResponseStatusException 401 si el email no existe o la contraseña es incorrecta
     */
    public void eliminarUsuario(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado");
        }
        usuarioRepository.deleteById(id);
    }

    public LoginResponse loginUsuario(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales incorrectas"));

        if(!passwordEncoder.matches(request.getPassword(), usuario.getPassword())){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales incorrectas");
        }

        return new LoginResponse(
                usuario.getId(),
                usuario.getNick(),
                usuario.getEmail());
    }
}
