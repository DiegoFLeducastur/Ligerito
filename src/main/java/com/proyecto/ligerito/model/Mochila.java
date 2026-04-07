package com.proyecto.ligerito.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "mochilas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Mochila {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private boolean esPublica;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    //orphanRemoval = true hace que si una categoría deja de pertenecer a esta mochila,
    //se elimine también de la base de datos.
    @OneToMany(mappedBy = "mochila", cascade = CascadeType.ALL, orphanRemoval = true)
    // Evita problemas al convertir a JSON, como bucles infinitos entre Mochila y Categoria.
    @JsonIgnore
    private List<Categoria> categorias = new ArrayList<>();

    //orphanRemoval borra los items si dejan de pertenecer a esta mochila
    @OneToMany(mappedBy = "mochila", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<ItemMochila> itemsMochila = new ArrayList<>();
}