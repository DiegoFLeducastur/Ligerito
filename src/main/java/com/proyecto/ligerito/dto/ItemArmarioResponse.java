package com.proyecto.ligerito.dto;

public class ItemArmarioResponse {

    private Long id;
    private String nombre;
    private int peso;
    private String descripcion;
    private String enlace;

    public ItemArmarioResponse() {
    }

    public ItemArmarioResponse(Long id, String nombre, int peso, String descripcion, String enlace) {
        this.id = id;
        this.nombre = nombre;
        this.peso = peso;
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

    public int getPeso() {
        return peso;
    }

    public void setPeso(int peso) {
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
}