package com.proyecto.ligerito.dto;

/**
 * DTO para mostrar un item dentro del detalle público de una mochila.
 */

public class ItemPublicoResponse {
        
    private Long id;
    private String nombre;
    private Integer peso;
    private Integer cantidad;
    private String categoriaNombre;
    private String descripcion;
    private String enlace;

    public ItemPublicoResponse() {
    }
    
    public ItemPublicoResponse(Long id, String nombre, Integer peso, Integer cantidad, String categoriaNombre,
            String descripcion, String enlace) {
        this.id = id;
        this.nombre = nombre;
        this.peso = peso;
        this.cantidad = cantidad;
        this.categoriaNombre = categoriaNombre;
        this.descripcion = descripcion;
        this.enlace = enlace;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public String getCategoriaNombre() {
        return categoriaNombre;
    }

    public void setCategoriaNombre(String categoriaNombre) {
        this.categoriaNombre = categoriaNombre;
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

    
}
