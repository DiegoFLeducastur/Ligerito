package com.proyecto.ligerito.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;

import com.proyecto.ligerito.dto.MochilaCreateRequest;
import com.proyecto.ligerito.dto.MochilaResponse;
import com.proyecto.ligerito.service.MochilaService;
import com.proyecto.ligerito.dto.MochilaPatchRequest;
import com.proyecto.ligerito.dto.MochilaPublicaResponse;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@Tag(name = "Mochila", description = "Gestión de mochilas del usuario")
@RestController
@RequestMapping("/api/mochilas")
@CrossOrigin(origins = { "http://localhost:5173", "http://127.0.0.1:5173" })
public class MochilaController {

    private final MochilaService mochilaService;

    public MochilaController(MochilaService mochilaService) {
        this.mochilaService = mochilaService;
    }

    @GetMapping
    public List<MochilaResponse> listarPorUsuario(@RequestParam Long usuarioId) {
        return mochilaService.listarPorUsuario(usuarioId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MochilaResponse crearMochila(@Valid @RequestBody MochilaCreateRequest request) {
        return mochilaService.crearMochila(request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminarMochila(@PathVariable Long id) {
        mochilaService.eliminarPorId(id);
    }

    @PatchMapping("/{id}")
    public MochilaResponse actualizarMochila(
            @PathVariable Long id,
            @RequestBody MochilaPatchRequest request) {
        return mochilaService.actualizarParcial(id, request);
    }

    @GetMapping("/publicas")
    public List<MochilaPublicaResponse> listarPublicas(){
        return mochilaService.listarPublicas();
    }

}