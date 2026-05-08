package com.proyecto.ligerito.service;

import com.proyecto.ligerito.dto.*;
import com.proyecto.ligerito.model.*;
import com.proyecto.ligerito.repository.MochilaRepository;
import com.proyecto.ligerito.repository.UsuarioRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MochilaServiceTest {

    @Mock
    private MochilaRepository mochilaRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private MochilaService mochilaService;

    // ─────────────────────────────────────────────────
    // listarPorUsuario
    // ─────────────────────────────────────────────────

    @Test
    void listarPorUsuario_devuelveListaMapeadaAResponse() {
        // Arrange
        Mochila m1 = mochila(1L, "Mochila Verano", false);
        Mochila m2 = mochila(2L, "Mochila Invierno", true);
        when(mochilaRepository.findByUsuarioId(10L)).thenReturn(Arrays.asList(m1, m2));

        // Act
        List<MochilaResponse> resultado = mochilaService.listarPorUsuario(10L);

        // Assert
        assertEquals(2, resultado.size());
        assertEquals("Mochila Verano", resultado.get(0).getNombre());
        assertFalse(resultado.get(0).isEsPublica());
        assertEquals("Mochila Invierno", resultado.get(1).getNombre());
        assertTrue(resultado.get(1).isEsPublica());
    }

    @Test
    void listarPorUsuario_usuarioSinMochilas_devuelveListaVacia() {
        // Arrange
        when(mochilaRepository.findByUsuarioId(99L)).thenReturn(List.of());

        // Act
        List<MochilaResponse> resultado = mochilaService.listarPorUsuario(99L);

        // Assert
        assertNotNull(resultado);
        assertTrue(resultado.isEmpty());
    }

    // ─────────────────────────────────────────────────
    // crearMochila
    // ─────────────────────────────────────────────────

    @Test
    void crearMochila_usuarioExiste_creaYDevuelveResponse() {
        // Arrange
        MochilaCreateRequest request = new MochilaCreateRequest("Ruta del Norte", false, 5L);

        Usuario usuario = new Usuario();
        usuario.setId(5L);

        Mochila guardada = mochila(1L, "Ruta del Norte", false);
        guardada.setUsuario(usuario);

        when(usuarioRepository.findById(5L)).thenReturn(Optional.of(usuario));
        when(mochilaRepository.save(any(Mochila.class))).thenReturn(guardada);

        // Act
        MochilaResponse resultado = mochilaService.crearMochila(request);

        // Assert
        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        assertEquals("Ruta del Norte", resultado.getNombre());
        assertFalse(resultado.isEsPublica());
        verify(mochilaRepository).save(any(Mochila.class));
    }

    @Test
    void crearMochila_usuarioNoExiste_lanza404() {
        // Arrange
        MochilaCreateRequest request = new MochilaCreateRequest("X", false, 999L);
        when(usuarioRepository.findById(999L)).thenReturn(Optional.empty());

        // Act + Assert
        assertThrows(ResponseStatusException.class, () -> mochilaService.crearMochila(request));
        verify(mochilaRepository, never()).save(any());
    }

    // ─────────────────────────────────────────────────
    // eliminarPorId
    // ─────────────────────────────────────────────────

    @Test
    void eliminarPorId_mochilaExiste_eliminaCorrectamente() {
        // Arrange
        Mochila mochila = mochila(3L, "Para borrar", false);
        when(mochilaRepository.findById(3L)).thenReturn(Optional.of(mochila));

        // Act
        mochilaService.eliminarPorId(3L);

        // Assert
        verify(mochilaRepository).delete(mochila);
    }

    @Test
    void eliminarPorId_mochilaNoExiste_lanza404() {
        // Arrange
        when(mochilaRepository.findById(404L)).thenReturn(Optional.empty());

        // Act + Assert
        assertThrows(ResponseStatusException.class, () -> mochilaService.eliminarPorId(404L));
        verify(mochilaRepository, never()).delete(any());
    }

    // ─────────────────────────────────────────────────
    // actualizarParcial
    // ─────────────────────────────────────────────────

    @Test
    void actualizarParcial_cambioNombreYVisibilidad_actualizaAmbos() {
        // Arrange
        Mochila existente = mochila(1L, "Nombre Viejo", false);
        when(mochilaRepository.findById(1L)).thenReturn(Optional.of(existente));

        Mochila guardada = mochila(1L, "Nombre Nuevo", true);
        when(mochilaRepository.save(existente)).thenReturn(guardada);

        MochilaPatchRequest patch = new MochilaPatchRequest("Nombre Nuevo", true);

        // Act
        MochilaResponse resultado = mochilaService.actualizarParcial(1L, patch);

        // Assert
        assertEquals("Nombre Nuevo", resultado.getNombre());
        assertTrue(resultado.isEsPublica());
        verify(mochilaRepository).save(existente);
    }

    @Test
    void actualizarParcial_nombreBlanco_noModificaNombre() {
        // Arrange
        Mochila existente = mochila(1L, "Nombre Original", false);
        when(mochilaRepository.findById(1L)).thenReturn(Optional.of(existente));
        when(mochilaRepository.save(existente)).thenReturn(existente);

        MochilaPatchRequest patch = new MochilaPatchRequest("   ", null);

        // Act
        mochilaService.actualizarParcial(1L, patch);

        // Assert: el nombre no debe haber cambiado
        assertEquals("Nombre Original", existente.getNombre());
    }

    @Test
    void actualizarParcial_mochilaNoExiste_lanza404() {
        // Arrange
        when(mochilaRepository.findById(404L)).thenReturn(Optional.empty());

        // Act + Assert
        assertThrows(ResponseStatusException.class,
                () -> mochilaService.actualizarParcial(404L, new MochilaPatchRequest("x", true)));
    }

    // ─────────────────────────────────────────────────
    // listarPublicas
    // ─────────────────────────────────────────────────

    @Test
    void listarPublicas_devuelveMochilaConPesoCalculado() {
        // Arrange
        Mochila mochila = mochilaConItems(1L, "Mochila Pública", "trail_runner");

        when(mochilaRepository.findByEsPublicaTrue()).thenReturn(List.of(mochila));

        // Act
        List<MochilaPublicaResponse> resultado = mochilaService.listarPublicas();

        // Assert
        assertEquals(1, resultado.size());
        assertEquals("Mochila Pública", resultado.get(0).getNombre());
        assertEquals("trail_runner", resultado.get(0).getNickUsuario());
        assertEquals(300, resultado.get(0).getPesoTotal()); // 100g x 3 unidades
    }

    // ─────────────────────────────────────────────────
    // obtenerDetallePublic
    // ─────────────────────────────────────────────────

    @Test
    void obtenerDetallePublic_mochilaPublicaExiste_devuelveDetalle() {
        // Arrange
        Mochila mochila = mochilaConItems(7L, "Mochila Detalle", "pepe");
        mochila.setEsPublica(true);
        when(mochilaRepository.findById(7L)).thenReturn(Optional.of(mochila));

        // Act
        MochilaPublicaDetalleResponse resultado = mochilaService.obtenerDetallePublic(7L);

        // Assert
        assertNotNull(resultado);
        assertEquals("Mochila Detalle", resultado.getNombre());
        assertEquals("pepe", resultado.getNickUsuario());
        assertEquals(300, resultado.getPesoTotal());
        assertFalse(resultado.getItems().isEmpty());
    }

    @Test
    void obtenerDetallePublic_mochilaNoExiste_lanza404() {
        // Arrange
        when(mochilaRepository.findById(999L)).thenReturn(Optional.empty());

        // Act + Assert
        assertThrows(ResponseStatusException.class, () -> mochilaService.obtenerDetallePublic(999L));
    }

    @Test
    void obtenerDetallePublic_mochilaPrivada_lanza404() {
        // Arrange
        Mochila mochilaPrivada = mochila(2L, "Privada", false);
        when(mochilaRepository.findById(2L)).thenReturn(Optional.of(mochilaPrivada));

        // Act + Assert
        assertThrows(ResponseStatusException.class, () -> mochilaService.obtenerDetallePublic(2L));
    }

    // ─────────────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────────────

    private Mochila mochila(Long id, String nombre, boolean esPublica) {
        Mochila m = new Mochila();
        m.setId(id);
        m.setNombre(nombre);
        m.setEsPublica(esPublica);
        return m;
    }

    private Mochila mochilaConItems(Long id, String nombre, String nickUsuario) {
        Mochila m = new Mochila();
        m.setId(id);
        m.setNombre(nombre);
        m.setEsPublica(true);

        Usuario usuario = new Usuario();
        usuario.setNick(nickUsuario);
        m.setUsuario(usuario);

        ItemArmario itemArmario = new ItemArmario();
        itemArmario.setNombre("Saco de dormir");
        itemArmario.setPeso(100);
        itemArmario.setDescripcion("Ligero y cálido");
        itemArmario.setEnlace("https://example.com");

        Categoria categoria = new Categoria();
        categoria.setNombre("Dormir");

        ItemMochila item = new ItemMochila();
        item.setId(1L);
        item.setItemArmario(itemArmario);
        item.setCantidad(3);
        item.setCategoria(categoria);

        m.setItemsMochila(new ArrayList<>(List.of(item)));
        m.setCategorias(new ArrayList<>(List.of(categoria)));

        return m;
    }
}
