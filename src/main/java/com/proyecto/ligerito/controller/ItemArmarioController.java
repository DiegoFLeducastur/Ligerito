package com.proyecto.ligerito.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;

import com.proyecto.ligerito.dto.ItemArmarioResponse;
import com.proyecto.ligerito.service.ItemArmarioService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/armario")
@CrossOrigin(origins = { "http://localhost:5173", "http://127.0.0.1:5173" })
@Tag(name = "Armario", description = "Gestión de items del armario del usuario")
public class ItemArmarioController {

    private final ItemArmarioService itemArmarioService;

    public ItemArmarioController(ItemArmarioService itemArmarioService) {
        this.itemArmarioService = itemArmarioService;
    }

    @Operation(summary = "Listar todos los items del armario")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista de items devuelta correctamente"),
            @ApiResponse(responseCode = "401", description = "No autenticado")
    })
    @GetMapping
    public List<ItemArmarioResponse> listarArmario() {
        return itemArmarioService.listarTodos();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminarItemArmario(@PathVariable Long id){
        itemArmarioService.eliminarPorId(id);
    }
}