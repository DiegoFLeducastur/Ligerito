package com.proyecto.ligerito.service;

import com.proyecto.ligerito.dto.LoginRequest;
import com.proyecto.ligerito.dto.LoginResponse;
import com.proyecto.ligerito.dto.RegisterRequest;
import com.proyecto.ligerito.exception.EmailDuplicadoException;
import com.proyecto.ligerito.exception.NickDuplicadoException;
import com.proyecto.ligerito.model.Usuario;
import com.proyecto.ligerito.repository.UsuarioRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioService usuarioService;

    // ─────────────────────────────────────────────────
    // registrarUsuario
    // ─────────────────────────────────────────────────

    @Test
    void registrarUsuario_datosNuevos_guardaYDevuelveUsuario() {
        // Arrange
        RegisterRequest request = new RegisterRequest("pepe", "pepe@mail.com", "1234");

        when(usuarioRepository.existsByEmail("pepe@mail.com")).thenReturn(false);
        when(usuarioRepository.existsByNick("pepe")).thenReturn(false);

        Usuario guardado = new Usuario();
        guardado.setId(1L);
        guardado.setNick("pepe");
        guardado.setEmail("pepe@mail.com");
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(guardado);

        // Act
        Usuario resultado = usuarioService.registrarUsuario(request);

        // Assert
        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        assertEquals("pepe", resultado.getNick());
        assertEquals("pepe@mail.com", resultado.getEmail());
        verify(usuarioRepository).save(any(Usuario.class));
    }

    @Test
    void registrarUsuario_emailDuplicado_lanzaEmailDuplicadoException() {
        // Arrange
        RegisterRequest request = new RegisterRequest("pepe", "duplicado@mail.com", "1234");
        when(usuarioRepository.existsByEmail("duplicado@mail.com")).thenReturn(true);

        // Act + Assert
        assertThrows(EmailDuplicadoException.class, () -> usuarioService.registrarUsuario(request));
        verify(usuarioRepository, never()).save(any());
    }

    @Test
    void registrarUsuario_nickDuplicado_lanzaNickDuplicadoException() {
        // Arrange
        RegisterRequest request = new RegisterRequest("nickRepetido", "nuevo@mail.com", "1234");
        when(usuarioRepository.existsByEmail("nuevo@mail.com")).thenReturn(false);
        when(usuarioRepository.existsByNick("nickRepetido")).thenReturn(true);

        // Act + Assert
        assertThrows(NickDuplicadoException.class, () -> usuarioService.registrarUsuario(request));
        verify(usuarioRepository, never()).save(any());
    }

    @Test
    void registrarUsuario_emailSeChequeaAntesQueNick() {
        // Arrange: ambos duplicados — debe lanzar EmailDuplicadoException, no NickDuplicadoException
        RegisterRequest request = new RegisterRequest("nickRepetido", "emailRepetido@mail.com", "1234");
        when(usuarioRepository.existsByEmail("emailRepetido@mail.com")).thenReturn(true);

        // Act + Assert
        assertThrows(EmailDuplicadoException.class, () -> usuarioService.registrarUsuario(request));
        verify(usuarioRepository, never()).existsByNick(any());
    }

    // ─────────────────────────────────────────────────
    // loginUsuario
    // ─────────────────────────────────────────────────

    @Test
    void loginUsuario_credencialesCorrectas_devuelveLoginResponse() {
        // Arrange
        LoginRequest request = new LoginRequest("pepe@mail.com", "1234");

        Usuario usuario = new Usuario();
        usuario.setId(5L);
        usuario.setNick("pepe");
        usuario.setEmail("pepe@mail.com");
        usuario.setPassword("1234");

        when(usuarioRepository.findByEmail("pepe@mail.com")).thenReturn(Optional.of(usuario));

        // Act
        LoginResponse resultado = usuarioService.loginUsuario(request);

        // Assert
        assertNotNull(resultado);
        assertEquals(5L, resultado.getId());
        assertEquals("pepe", resultado.getNick());
        assertEquals("pepe@mail.com", resultado.getEmail());
    }

    @Test
    void loginUsuario_emailNoRegistrado_lanza401() {
        // Arrange
        LoginRequest request = new LoginRequest("noexiste@mail.com", "1234");
        when(usuarioRepository.findByEmail("noexiste@mail.com")).thenReturn(Optional.empty());

        // Act + Assert
        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> usuarioService.loginUsuario(request));

        assertEquals(401, ex.getStatusCode().value());
    }

    @Test
    void loginUsuario_passwordIncorrecta_lanza401() {
        // Arrange
        LoginRequest request = new LoginRequest("pepe@mail.com", "wrongPassword");

        Usuario usuario = new Usuario();
        usuario.setPassword("correctPassword");
        when(usuarioRepository.findByEmail("pepe@mail.com")).thenReturn(Optional.of(usuario));

        // Act + Assert
        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> usuarioService.loginUsuario(request));

        assertEquals(401, ex.getStatusCode().value());
    }
}
