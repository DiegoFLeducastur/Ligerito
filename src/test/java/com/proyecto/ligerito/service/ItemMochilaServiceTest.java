package com.proyecto.ligerito.service;

import com.proyecto.ligerito.dto.ItemMochilaCreateRequest;
import com.proyecto.ligerito.dto.ItemMochilaPatchRequest;
import com.proyecto.ligerito.dto.ItemMochilaResponse;
import com.proyecto.ligerito.model.Categoria;
import com.proyecto.ligerito.model.ItemArmario;
import com.proyecto.ligerito.model.ItemMochila;
import com.proyecto.ligerito.model.Mochila;
import com.proyecto.ligerito.repository.CategoriaRepository;
import com.proyecto.ligerito.repository.ItemArmarioRepository;
import com.proyecto.ligerito.repository.ItemMochilaRepository;
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
class ItemMochilaServiceTest {

    @Mock
    private ItemMochilaRepository itemMochilaRepository;
    @Mock
    private MochilaRepository mochilaRepository;
    @Mock
    private CategoriaRepository categoriaRepository;
    @Mock
    private ItemArmarioRepository itemArmarioRepository;

    @InjectMocks
    private ItemMochilaService itemMochilaService;

    // ─────────────────────────────────────────────────
    // crearItemMochila — camino feliz: item nuevo
    // ─────────────────────────────────────────────────

    @Test
    void crearItemMochila_itemNuevo_creaConCantidadUno() {
        // Arrange
        ItemMochilaCreateRequest request = new ItemMochilaCreateRequest(1L, 10L, 100L);

        Mochila mochila = mochila(1L);
        Categoria categoria = categoria(10L, "Ropa", mochila);
        ItemArmario itemArmario = itemArmario(100L, "Chubasquero", 350, "desc", "http://link");

        when(mochilaRepository.findById(1L)).thenReturn(Optional.of(mochila));
        when(categoriaRepository.findById(10L)).thenReturn(Optional.of(categoria));
        when(itemArmarioRepository.findById(100L)).thenReturn(Optional.of(itemArmario));
        when(itemMochilaRepository.findByItemArmarioIdAndMochilaIdAndCategoriaId(100L, 1L, 10L))
                .thenReturn(Optional.empty());

        ItemMochila guardado = itemMochila(1L, mochila, categoria, itemArmario, 1);
        when(itemMochilaRepository.save(any(ItemMochila.class))).thenReturn(guardado);

        // Act
        ItemMochilaResponse resultado = itemMochilaService.crearItemMochila(request);

        // Assert
        assertNotNull(resultado);
        assertEquals(1, resultado.getCantidad());
        assertEquals("Chubasquero", resultado.getNombre());
        assertEquals("Ropa", resultado.getCategoriaNombre());
        assertEquals(350, resultado.getPeso());
        verify(itemMochilaRepository).save(any(ItemMochila.class));
    }

    // ─────────────────────────────────────────────────
    // crearItemMochila — item ya existe: incrementa cantidad
    // ─────────────────────────────────────────────────

    @Test
    void crearItemMochila_itemYaExiste_incrementaCantidad() {
        // Arrange
        ItemMochilaCreateRequest request = new ItemMochilaCreateRequest(1L, 10L, 100L);

        Mochila mochila = mochila(1L);
        Categoria categoria = categoria(10L, "Ropa", mochila);
        ItemArmario itemArmario = itemArmario(100L, "Chubasquero", 350, "desc", null);

        when(mochilaRepository.findById(1L)).thenReturn(Optional.of(mochila));
        when(categoriaRepository.findById(10L)).thenReturn(Optional.of(categoria));
        when(itemArmarioRepository.findById(100L)).thenReturn(Optional.of(itemArmario));

        ItemMochila existente = itemMochila(5L, mochila, categoria, itemArmario, 2);
        when(itemMochilaRepository.findByItemArmarioIdAndMochilaIdAndCategoriaId(100L, 1L, 10L))
                .thenReturn(Optional.of(existente));

        ItemMochila actualizado = itemMochila(5L, mochila, categoria, itemArmario, 3);
        when(itemMochilaRepository.save(existente)).thenReturn(actualizado);

        // Act
        ItemMochilaResponse resultado = itemMochilaService.crearItemMochila(request);

        // Assert
        assertEquals(3, resultado.getCantidad());
        verify(itemMochilaRepository).save(existente);
    }

    // ─────────────────────────────────────────────────
    // crearItemMochila — validaciones 404 / 400
    // ─────────────────────────────────────────────────

    @Test
    void crearItemMochila_mochilaNoExiste_lanza404() {
        // Arrange
        when(mochilaRepository.findById(99L)).thenReturn(Optional.empty());

        // Act + Assert
        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> itemMochilaService.crearItemMochila(new ItemMochilaCreateRequest(99L, 1L, 1L)));
        assertEquals(404, ex.getStatusCode().value());
        verify(itemMochilaRepository, never()).save(any());
    }

    @Test
    void crearItemMochila_categoriaNoExiste_lanza404() {
        // Arrange
        when(mochilaRepository.findById(1L)).thenReturn(Optional.of(mochila(1L)));
        when(categoriaRepository.findById(99L)).thenReturn(Optional.empty());

        // Act + Assert
        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> itemMochilaService.crearItemMochila(new ItemMochilaCreateRequest(1L, 99L, 1L)));
        assertEquals(404, ex.getStatusCode().value());
    }

    @Test
    void crearItemMochila_itemArmarioNoExiste_lanza404() {
        // Arrange
        Mochila mochila = mochila(1L);
        when(mochilaRepository.findById(1L)).thenReturn(Optional.of(mochila));
        when(categoriaRepository.findById(10L)).thenReturn(Optional.of(categoria(10L, "Ropa", mochila)));
        when(itemArmarioRepository.findById(99L)).thenReturn(Optional.empty());

        // Act + Assert
        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> itemMochilaService.crearItemMochila(new ItemMochilaCreateRequest(1L, 10L, 99L)));
        assertEquals(404, ex.getStatusCode().value());
    }

    @Test
    void crearItemMochila_categoriaNoPerteneceMochila_lanza400() {
        // Arrange
        Mochila mochila = mochila(1L);
        Mochila otraMochila = mochila(2L);
        Categoria categoriaDeOtraMochila = categoria(10L, "Ropa", otraMochila);
        ItemArmario itemArmario = itemArmario(100L, "Chubasquero", 350, null, null);

        when(mochilaRepository.findById(1L)).thenReturn(Optional.of(mochila));
        when(categoriaRepository.findById(10L)).thenReturn(Optional.of(categoriaDeOtraMochila));
        when(itemArmarioRepository.findById(100L)).thenReturn(Optional.of(itemArmario));

        // Act + Assert
        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> itemMochilaService.crearItemMochila(new ItemMochilaCreateRequest(1L, 10L, 100L)));
        assertEquals(400, ex.getStatusCode().value());
    }

    // ─────────────────────────────────────────────────
    // listarPorMochila
    // ─────────────────────────────────────────────────

    @Test
    void listarPorMochila_devuelveItemsMapeados() {
        // Arrange
        Mochila mochila = mochila(1L);
        Categoria categoria = categoria(10L, "Dormir", mochila);
        ItemArmario itemArmario = itemArmario(100L, "Saco", 800, "ligero", null);

        List<ItemMochila> items = List.of(
                itemMochila(1L, mochila, categoria, itemArmario, 1),
                itemMochila(2L, mochila, categoria, itemArmario, 2));

        when(itemMochilaRepository.findByMochilaId(1L)).thenReturn(items);

        // Act
        List<ItemMochilaResponse> resultado = itemMochilaService.listarPorMochila(1L);

        // Assert
        assertEquals(2, resultado.size());
        assertEquals("Saco", resultado.get(0).getNombre());
        assertEquals(1, resultado.get(0).getCantidad());
        assertEquals(2, resultado.get(1).getCantidad());
    }

    @Test
    void listarPorMochila_sinItems_devuelveListaVacia() {
        // Arrange
        when(itemMochilaRepository.findByMochilaId(1L)).thenReturn(List.of());

        // Act
        List<ItemMochilaResponse> resultado = itemMochilaService.listarPorMochila(1L);

        // Assert
        assertTrue(resultado.isEmpty());
    }

    // ─────────────────────────────────────────────────
    // eliminarPorId
    // ─────────────────────────────────────────────────

    @Test
    void eliminarPorId_itemExiste_eliminaCorrectamente() {
        // Arrange
        Mochila mochila = mochila(1L);
        Categoria categoria = categoria(10L, "Ropa", mochila);
        ItemArmario itemArmario = itemArmario(100L, "Gorra", 50, null, null);
        ItemMochila item = itemMochila(3L, mochila, categoria, itemArmario, 1);

        when(itemMochilaRepository.findById(3L)).thenReturn(Optional.of(item));

        // Act
        itemMochilaService.eliminarPorId(3L);

        // Assert
        verify(itemMochilaRepository).delete(item);
    }

    @Test
    void eliminarPorId_itemNoExiste_lanza404() {
        // Arrange
        when(itemMochilaRepository.findById(404L)).thenReturn(Optional.empty());

        // Act + Assert
        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> itemMochilaService.eliminarPorId(404L));
        assertEquals(404, ex.getStatusCode().value());
        verify(itemMochilaRepository, never()).delete(any());
    }

    // ─────────────────────────────────────────────────
    // actualizarParcial
    // ─────────────────────────────────────────────────

    @Test
    void actualizarParcial_actualizaCantidadCorrectamente() {
        // Arrange
        Mochila mochila = mochila(1L);
        Categoria categoria = categoria(10L, "Ropa", mochila);
        ItemArmario itemArmario = itemArmario(100L, "Gorra", 50, null, null);
        ItemMochila item = itemMochila(1L, mochila, categoria, itemArmario, 1);

        when(itemMochilaRepository.findById(1L)).thenReturn(Optional.of(item));

        ItemMochila guardado = itemMochila(1L, mochila, categoria, itemArmario, 5);
        when(itemMochilaRepository.save(item)).thenReturn(guardado);

        // Act
        ItemMochilaResponse resultado = itemMochilaService.actualizarParcial(1L, new ItemMochilaPatchRequest(5));

        // Assert
        assertEquals(5, resultado.getCantidad());
        verify(itemMochilaRepository).save(item);
    }

    @Test
    void actualizarParcial_itemNoExiste_lanza404() {
        // Arrange
        when(itemMochilaRepository.findById(404L)).thenReturn(Optional.empty());

        // Act + Assert
        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> itemMochilaService.actualizarParcial(404L, new ItemMochilaPatchRequest(3)));
        assertEquals(404, ex.getStatusCode().value());
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

    private ItemArmario itemArmario(Long id, String nombre, int peso, String descripcion, String enlace) {
        ItemArmario ia = new ItemArmario();
        ia.setId(id);
        ia.setNombre(nombre);
        ia.setPeso(peso);
        ia.setDescripcion(descripcion);
        ia.setEnlace(enlace);
        return ia;
    }

    private ItemMochila itemMochila(Long id, Mochila mochila, Categoria categoria, ItemArmario itemArmario,
            int cantidad) {
        ItemMochila im = new ItemMochila();
        im.setId(id);
        im.setMochila(mochila);
        im.setCategoria(categoria);
        im.setItemArmario(itemArmario);
        im.setCantidad(cantidad);
        return im;
    }
}
