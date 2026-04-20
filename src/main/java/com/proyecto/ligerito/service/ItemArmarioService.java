package com.proyecto.ligerito.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.proyecto.ligerito.dto.ItemArmarioResponse;
import com.proyecto.ligerito.model.ItemArmario;
import com.proyecto.ligerito.repository.ItemArmarioRepository;

@Service
public class ItemArmarioService {

    private final ItemArmarioRepository itemArmarioRepository;

    public ItemArmarioService(ItemArmarioRepository itemArmarioRepository) {
        this.itemArmarioRepository = itemArmarioRepository;
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
}