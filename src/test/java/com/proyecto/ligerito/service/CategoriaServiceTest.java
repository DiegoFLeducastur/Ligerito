package com.proyecto.ligerito.service;

import com.proyecto.ligerito.dto.CategoriaCreateRequest;
import com.proyecto.ligerito.dto.CategoriaResponse;
import com.proyecto.ligerito.model.Categoria;
import com.proyecto.ligerito.model.Mochila;
import com.proyecto.ligerito.repository.CategoriaRepository;
import com.proyecto.ligerito.repository.MochilaRepository;

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
class CategoriaServiceTest {

    @Mock
    private CategoriaRepository categoriaRepository;

    @Mock
    private MochilaRepository mochilaRepository;

    @InjectMocks
    private CategoriaService categoriaService;

    // ─────────────────────────────────────────────────
    // crearCategoria
    // ─────────────────────────────────────────────────

    @Test
    void crearCategoria_nombreNuevo_creaYDevuelveResponse() {
        // Arrange
        CategoriaCreateRequest request = new CategoriaCreateRequest("Ropa", 1L);

        Mochila mochila = mochila(1L);
        when(mochilaRepository.findById(1L)).thenReturn(Optional.of(mochila));
        when(categoriaRepository.existsByNombreIgnoreCaseAndMochilaId("Ropa", 1L)).thenReturn(false);

        Categoria guardada = categoria(10L, "Ropa", mochila);
        when(categoriaRepository.save(any(Categoria.class))).thenReturn(guardada);

        // Act
        CategoriaResponse resultado = categoriaService.crearCategoria(request);

        // Assert
        assertNotNull(resultado);
        assertEquals(10L, resultado.getId());
        assertEquals("Ropa", resultado.getNombre());
        verify(categoriaRepository).save(any(Categoria.class));
    }

    @Test
    void crearCategoria_mochilaNoExiste_lanza404() {
        // Arrange
        when(mochilaRepository.findById(99L)).thenReturn(Optional.empty());

        // Act + Assert
        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> categoriaService.crearCategoria(new CategoriaCreateRequest("Ropa", 99L)));
        assertEquals(404, ex.getStatusCode().value());
        verify(categoriaRepository, never()).save(any());
    }

    @Test
    void crearCategoria_nombreDuplicadoEnMochila_lanza409() {
        // Arrange
        CategoriaCreateRequest request = new CategoriaCreateRequest("Ropa", 1L);
        when(mochilaRepository.findById(1L)).thenReturn(Optional.of(mochila(1L)));
        when(categoriaRepository.existsByNombreIgnoreCaseAndMochilaId("Ropa", 1L)).thenReturn(true);

        // Act + Assert
        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> categoriaService.crearCategoria(request));
        assertEquals(409, ex.getStatusCode().value());
        verify(categoriaRepository, never()).save(any());
    }

    @Test
    void crearCategoria_nombreDuplicadoCaseInsensitive_lanza409() {
        // Arrange — "ropa" ya existe, se intenta crear "ROPA"
        CategoriaCreateRequest request = new CategoriaCreateRequest("ROPA", 1L);
        when(mochilaRepository.findById(1L)).thenReturn(Optional.of(mochila(1L)));
        when(categoriaRepository.existsByNombreIgnoreCaseAndMochilaId("ROPA", 1L)).thenReturn(true);

        // Act + Assert
        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> categoriaService.crearCategoria(request));
        assertEquals(409, ex.getStatusCode().value());
    }

    @Test
    void crearCategoria_nombreDuplicadoEnOtraMochila_creaCorrectamente() {
        // Arrange — mismo nombre pero en mochila distinta: es válido
        CategoriaCreateRequest request = new CategoriaCreateRequest("Ropa", 2L);
        Mochila mochila2 = mochila(2L);
        when(mochilaRepository.findById(2L)).thenReturn(Optional.of(mochila2));
        when(categoriaRepository.existsByNombreIgnoreCaseAndMochilaId("Ropa", 2L)).thenReturn(false);

        Categoria guardada = categoria(20L, "Ropa", mochila2);
        when(categoriaRepository.save(any(Categoria.class))).thenReturn(guardada);

        // Act
        CategoriaResponse resultado = categoriaService.crearCategoria(request);

        // Assert
        assertEquals(20L, resultado.getId());
        assertEquals("Ropa", resultado.getNombre());
    }

    // ─────────────────────────────────────────────────
    // eliminarPorId
    // ─────────────────────────────────────────────────

    @Test
    void eliminarPorId_categoriaExiste_eliminaCorrectamente() {
        // Arrange
        Categoria categoria = categoria(5L, "Dormir", mochila(1L));
        when(categoriaRepository.findById(5L)).thenReturn(Optional.of(categoria));

        // Act
        categoriaService.eliminarPorId(5L);

        // Assert
        verify(categoriaRepository).delete(categoria);
    }

    @Test
    void eliminarPorId_categoriaNoExiste_lanza404() {
        // Arrange
        when(categoriaRepository.findById(404L)).thenReturn(Optional.empty());

        // Act + Assert
        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> categoriaService.eliminarPorId(404L));
        assertEquals(404, ex.getStatusCode().value());
        verify(categoriaRepository, never()).delete(any());
    }

    // ─────────────────────────────────────────────────
    // listarPorMochila
    // ─────────────────────────────────────────────────

    @Test
    void listarPorMochila_devuelveCategoriasMapeadas() {
        // Arrange
        Mochila mochila = mochila(1L);
        List<Categoria> categorias = List.of(
                categoria(1L, "Ropa", mochila),
                categoria(2L, "Dormir", mochila),
                categoria(3L, "Cocina", mochila));
        when(categoriaRepository.findByMochilaId(1L)).thenReturn(categorias);

        // Act
        List<CategoriaResponse> resultado = categoriaService.listarPorMochila(1L);

        // Assert
        assertEquals(3, resultado.size());
        assertEquals("Ropa", resultado.get(0).getNombre());
        assertEquals("Dormir", resultado.get(1).getNombre());
        assertEquals("Cocina", resultado.get(2).getNombre());
    }

    @Test
    void listarPorMochila_sinCategorias_devuelveListaVacia() {
        // Arrange
        when(categoriaRepository.findByMochilaId(1L)).thenReturn(List.of());

        // Act
        List<CategoriaResponse> resultado = categoriaService.listarPorMochila(1L);

        // Assert
        assertTrue(resultado.isEmpty());
    }

    // ─────────────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────────────

    private Mochila mochila(Long id) {
        Mochila m = new Mochila();
        m.setId(id);
        return m;
    }

    private Categoria categoria(Long id, String nombre, Mochila mochila) {
        Categoria c = new Categoria();
        c.setId(id);
        c.setNombre(nombre);
        c.setMochila(mochila);
        return c;
    }
}
