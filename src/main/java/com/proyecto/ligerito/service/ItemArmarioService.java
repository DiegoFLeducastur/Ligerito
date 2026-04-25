package com.proyecto.ligerito.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.proyecto.ligerito.dto.ItemArmarioCreateRequest;
import com.proyecto.ligerito.dto.ItemArmarioPatchRequest;
import com.proyecto.ligerito.dto.ItemArmarioResponse;
import com.proyecto.ligerito.model.ItemArmario;
import com.proyecto.ligerito.model.Usuario;
import com.proyecto.ligerito.repository.ItemArmarioRepository;
import com.proyecto.ligerito.repository.UsuarioRepository;

@Service
public class ItemArmarioService {

    private final ItemArmarioRepository itemArmarioRepository;
    private final UsuarioRepository usuarioRepository;

    public ItemArmarioService(ItemArmarioRepository itemArmarioRepository, UsuarioRepository usuarioRepository) {
        this.itemArmarioRepository = itemArmarioRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<ItemArmarioResponse> listarTodos() {
        List<ItemArmario> items = itemArmarioRepository.findAll();

        return items.stream()
                .map(item -> new ItemArmarioResponse(
                        item.getId(),
                        item.getNombre(),
                        item.getPeso(),
                        item.getDescripcion(),
                        item.getEnlace()))
                .toList();
    }

    public void eliminarPorId(Long id) {
        ItemArmario item = itemArmarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Item de armario no encontrado"));

        itemArmarioRepository.delete(item);
    }

    public ItemArmarioResponse actualizarParcial(Long id, ItemArmarioPatchRequest request) {
        ItemArmario item = itemArmarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Item de armario no encontrado"));

        if (request.getPeso() != null) {
            if (request.getPeso() < 0) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "El peso no puede ser negativo");
            }
            item.setPeso(request.getPeso());
        }

        if (request.getDescripcion() != null) {
            item.setDescripcion(request.getDescripcion());
        }

        if (request.getEnlace() != null) {
            item.setEnlace(request.getEnlace());
        }

        ItemArmario guardado = itemArmarioRepository.save(item);

        return new ItemArmarioResponse(
                guardado.getId(),
                guardado.getNombre(),
                guardado.getPeso(),
                guardado.getDescripcion(),
                guardado.getEnlace());
    }

    public ItemArmarioResponse crearItemArmario(ItemArmarioCreateRequest request) {
        Usuario usuario = usuarioRepository.findById(request.getUsuarioId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuario no encontrado"));

        ItemArmario nuevoItem = new ItemArmario(
                null,
                request.getNombre(),
                request.getPeso(),
                request.getDescripcion(),
                request.getEnlace(),
                usuario);

        ItemArmario guardado = itemArmarioRepository.save(nuevoItem);

        return new ItemArmarioResponse(
                guardado.getId(),
                guardado.getNombre(),
                guardado.getPeso(),
                guardado.getDescripcion(),
                guardado.getEnlace());
    }

}