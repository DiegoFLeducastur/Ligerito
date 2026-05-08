package com.proyecto.ligerito.service;

import com.proyecto.ligerito.dto.ItemArmarioCreateRequest;
import com.proyecto.ligerito.dto.ItemArmarioPatchRequest;
import com.proyecto.ligerito.dto.ItemArmarioResponse;
import com.proyecto.ligerito.model.ItemArmario;
import com.proyecto.ligerito.model.Usuario;
import com.proyecto.ligerito.repository.ItemArmarioRepository;
import com.proyecto.ligerito.repository.UsuarioRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ItemArmarioServiceTest {

    @Mock
    private ItemArmarioRepository itemArmarioRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private ItemArmarioService itemArmarioService;

    // ─────────────────────────────────────────────────
    // listarPorUsuario
    // ─────────────────────────────────────────────────

    @Test
    void listarPorUsuario_devuelveItemsMapeados() {
        // Arrange
        List<ItemArmario> items = List.of(
                itemArmario(1L, "Saco de dormir", 800, "ligero", "http://link1"),
                itemArmario(2L, "Esterilla", 400, null, null));
        when(itemArmarioRepository.findByUsuarioId(5L)).thenReturn(items);

        // Act
        List<ItemArmarioResponse> resultado = itemArmarioService.listarPorUsuario(5L);

        // Assert
        assertEquals(2, resultado.size());
        assertEquals("Saco de dormir", resultado.get(0).getNombre());
        assertEquals(800, resultado.get(0).getPeso());
        assertEquals("Esterilla", resultado.get(1).getNombre());
        assertNull(resultado.get(1).getDescripcion());
    }

    @Test
    void listarPorUsuario_sinItems_devuelveListaVacia() {
        // Arrange
        when(itemArmarioRepository.findByUsuarioId(5L)).thenReturn(List.of());

        // Act
        List<ItemArmarioResponse> resultado = itemArmarioService.listarPorUsuario(5L);

        // Assert
        assertTrue(resultado.isEmpty());
    }

    // ─────────────────────────────────────────────────
    // crearItemArmario
    // ─────────────────────────────────────────────────

    @Test
    void crearItemArmario_usuarioExiste_creaYDevuelveResponse() {
        // Arrange
        ItemArmarioCreateRequest request = new ItemArmarioCreateRequest("Chubasquero", 350, "impermeable", "http://link", 5L);

        Usuario usuario = new Usuario();
        usuario.setId(5L);
        when(usuarioRepository.findById(5L)).thenReturn(Optional.of(usuario));

        ItemArmario guardado = itemArmario(1L, "Chubasquero", 350, "impermeable", "http://link");
        when(itemArmarioRepository.save(any(ItemArmario.class))).thenReturn(guardado);

        // Act
        ItemArmarioResponse resultado = itemArmarioService.crearItemArmario(request);

        // Assert
        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        assertEquals("Chubasquero", resultado.getNombre());
        assertEquals(350, resultado.getPeso());
        assertEquals("impermeable", resultado.getDescripcion());
        verify(itemArmarioRepository).save(any(ItemArmario.class));
    }

    @Test
    void crearItemArmario_usuarioNoExiste_lanza404() {
        // Arrange
        ItemArmarioCreateRequest request = new ItemArmarioCreateRequest("Gorra", 50, null, null, 999L);
        when(usuarioRepository.findById(999L)).thenReturn(Optional.empty());

        // Act + Assert
        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> itemArmarioService.crearItemArmario(request));
        assertEquals(404, ex.getStatusCode().value());
        verify(itemArmarioRepository, never()).save(any());
    }

    // ─────────────────────────────────────────────────
    // eliminarPorId
    // ─────────────────────────────────────────────────

    @Test
    void eliminarPorId_itemExiste_eliminaCorrectamente() {
        // Arrange
        ItemArmario item = itemArmario(3L, "Bastones", 200, null, null);
        when(itemArmarioRepository.findById(3L)).thenReturn(Optional.of(item));

        // Act
        itemArmarioService.eliminarPorId(3L);

        // Assert
        verify(itemArmarioRepository).delete(item);
    }

    @Test
    void eliminarPorId_itemNoExiste_lanza404() {
        // Arrange
        when(itemArmarioRepository.findById(404L)).thenReturn(Optional.empty());

        // Act + Assert
        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> itemArmarioService.eliminarPorId(404L));
        assertEquals(404, ex.getStatusCode().value());
        verify(itemArmarioRepository, never()).delete(any());
    }

    // ─────────────────────────────────────────────────
    // actualizarParcial
    // ─────────────────────────────────────────────────

    @Test
    void actualizarParcial_todosCampos_actualizaCorrectamente() {
        // Arrange
        ItemArmario item = itemArmario(1L, "Gorra", 50, "vieja desc", "http://old");
        when(itemArmarioRepository.findById(1L)).thenReturn(Optional.of(item));

        ItemArmario guardado = itemArmario(1L, "Gorra", 60, "nueva desc", "http://new");
        when(itemArmarioRepository.save(item)).thenReturn(guardado);

        ItemArmarioPatchRequest patch = new ItemArmarioPatchRequest(60, "nueva desc", "http://new");

        // Act
        ItemArmarioResponse resultado = itemArmarioService.actualizarParcial(1L, patch);

        // Assert
        assertEquals(60, resultado.getPeso());
        assertEquals("nueva desc", resultado.getDescripcion());
        assertEquals("http://new", resultado.getEnlace());
        verify(itemArmarioRepository).save(item);
    }

    @Test
    void actualizarParcial_soloPeso_noModificaDescripcionNiEnlace() {
        // Arrange
        ItemArmario item = itemArmario(1L, "Gorra", 50, "desc original", "http://original");
        when(itemArmarioRepository.findById(1L)).thenReturn(Optional.of(item));
        when(itemArmarioRepository.save(item)).thenReturn(item);

        ItemArmarioPatchRequest patch = new ItemArmarioPatchRequest(75, null, null);

        // Act
        itemArmarioService.actualizarParcial(1L, patch);

        // Assert
        assertEquals(75, item.getPeso());
        assertEquals("desc original", item.getDescripcion());
        assertEquals("http://original", item.getEnlace());
    }

    @Test
    void actualizarParcial_pesoNegativo_lanza400() {
        // Arrange
        ItemArmario item = itemArmario(1L, "Gorra", 50, null, null);
        when(itemArmarioRepository.findById(1L)).thenReturn(Optional.of(item));

        ItemArmarioPatchRequest patch = new ItemArmarioPatchRequest(-10, null, null);

        // Act + Assert
        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> itemArmarioService.actualizarParcial(1L, patch));
        assertEquals(400, ex.getStatusCode().value());
        verify(itemArmarioRepository, never()).save(any());
    }

    @Test
    void actualizarParcial_itemNoExiste_lanza404() {
        // Arrange
        when(itemArmarioRepository.findById(404L)).thenReturn(Optional.empty());

        // Act + Assert
        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> itemArmarioService.actualizarParcial(404L, new ItemArmarioPatchRequest(100, null, null)));
        assertEquals(404, ex.getStatusCode().value());
    }

    // ─────────────────────────────────────────────────
    // Helper
    // ─────────────────────────────────────────────────

    private ItemArmario itemArmario(Long id, String nombre, int peso, String descripcion, String enlace) {
        ItemArmario ia = new ItemArmario();
        ia.setId(id);
        ia.setNombre(nombre);
        ia.setPeso(peso);
        ia.setDescripcion(descripcion);
        ia.setEnlace(enlace);
        return ia;
    }
}
