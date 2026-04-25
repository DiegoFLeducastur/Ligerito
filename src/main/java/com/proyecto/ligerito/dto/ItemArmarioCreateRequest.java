package com.proyecto.ligerito.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ItemArmarioCreateRequest {
    
    @NotBlank(message = "El nombre no puede estar vacío")
    private String nombre;

    @NotNull(message = "El peso es obligatorio")
    @Min(value=0, message = "El peso no puede ser negativo")
    private Integer peso;

    private String descripcion;
    private String enlace;

    @NotNull(message="El usuarioId es obligatorio")
    private Long usuarioId;

    public ItemArmarioCreateRequest() {
    }

    public ItemArmarioCreateRequest(@NotBlank(message = "El nombre no puede estar vacío") String nombre,
            @NotNull(message = "El peso es obligatorio") @Min(value = 0, message = "El peso no puede ser negativo") Integer peso,
            String descripcion, String enlace, @NotNull(message = "El usuarioId es obligatorio") Long usuarioId) {
        this.nombre = nombre;
        this.peso = peso;
        this.descripcion = descripcion;
        this.enlace = enlace;
        this.usuarioId = usuarioId;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Integer getPeso() {
        return peso;
    }

    public void setPeso(Integer peso) {
        this.peso = peso;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getEnlace() {
        return enlace;
    }

    public void setEnlace(String enlace) {
        this.enlace = enlace;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    
}
