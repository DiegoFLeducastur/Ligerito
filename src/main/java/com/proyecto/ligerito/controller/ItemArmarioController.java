package com.proyecto.ligerito.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proyecto.ligerito.dto.ItemArmarioResponse;
import com.proyecto.ligerito.service.ItemArmarioService;

@RestController
@RequestMapping("/api/armario")
public class ItemArmarioController {

    private final ItemArmarioService itemArmarioService;

    public ItemArmarioController(ItemArmarioService itemArmarioService) {
        this.itemArmarioService = itemArmarioService;
    }

    @GetMapping
    public List<ItemArmarioResponse> listarArmario() {
        return itemArmarioService.listarTodos();
    }
}