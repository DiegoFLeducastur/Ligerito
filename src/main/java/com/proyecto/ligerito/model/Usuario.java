package com.proyecto.ligerito.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.ArrayList;
import java.util.List;

/**
 * Entidad que representa a un usuario registrado en el sistema.
 * Es la raíz del agregado: posee sus {@link Mochila mochilas} y su
 * {@link ItemArmario armario} de equipamiento, que se eliminan en cascada
 * al borrar el usuario.
 */
@Entity
@Table(name = "usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nick;
    private String email;

    private String password;

    /**
     * Mochilas que pertenecen al usuario.
     * {@code orphanRemoval} garantiza que una mochila se elimine de la base de datos
     * en cuanto deje de estar asociada a este usuario.
     * {@code @JsonIgnore} evita referencias circulares al serializar.
     */
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Mochila> mochilas = new ArrayList<>();

    /**
     * Items del armario personal del usuario.
     * {@code orphanRemoval} garantiza que un item se elimine de la base de datos
     * en cuanto deje de estar asociado a este usuario.
     * {@code @JsonIgnore} evita referencias circulares al serializar.
     */
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<ItemArmario> itemsArmario = new ArrayList<>();
}