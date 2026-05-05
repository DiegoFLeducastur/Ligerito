package com.proyecto.ligerito.dto;

public class MochilaPublicaResponse {
    
private Long id;
private String nombre;
private String nickUsuario;
private Integer pesoTotal;

public MochilaPublicaResponse() {
}

/**
 *
 * @param id identificador unico de la mochila publica
 * @param nombre nombre de la mochila publica
 * @param nickUsuario nombre del creador de esta mochila
 * @param pesoTotal suma del peso de los items que contiene la mochila
 */
public MochilaPublicaResponse(Long id, String nombre, String nickUsuario, Integer pesoTotal) {
    this.id = id;
    this.nombre = nombre;
    this.nickUsuario = nickUsuario;
    this.pesoTotal = pesoTotal;
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




}
