package com.proyecto.ligerito.dto;

import java.util.List;

/**
 * DTO para mostrar el detalle público de una mochila compartida.
 */
public class MochilaPublicaDetalleResponse {

    private Long id;
    private String nombre;
    private String nickUsuario;
    private Integer pesoTotal;
    private List<String> categorias;
    private List<ItemPublicoResponse> items;

    public MochilaPublicaDetalleResponse() {
    }

    public MochilaPublicaDetalleResponse(Long id, String nombre, String nickUsuario, Integer pesoTotal,
            List<String> categorias, List<ItemPublicoResponse> items) {
        this.id = id;
        this.nombre = nombre;
        this.nickUsuario = nickUsuario;
        this.pesoTotal = pesoTotal;
        this.categorias = categorias;
        this.items = items;
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

    public String getNickUsuario() {
        return nickUsuario;
    }

    public void setNickUsuario(String nickUsuario) {
        this.nickUsuario = nickUsuario;
    }

    public Integer getPesoTotal() {
        return pesoTotal;
    }

    public void setPesoTotal(Integer pesoTotal) {
        this.pesoTotal = pesoTotal;
    }

    public List<String> getCategorias() {
        return categorias;
    }

    public void setCategorias(List<String> categorias) {
        this.categorias = categorias;
    }

    public List<ItemPublicoResponse> getItems() {
        return items;
    }

    public void setItems(List<ItemPublicoResponse> items) {
        this.items = items;
    }

}
