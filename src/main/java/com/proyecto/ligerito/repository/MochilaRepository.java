package com.proyecto.ligerito.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.proyecto.ligerito.model.Mochila;

/**
 * Repositorio JPA para la entidad {@link com.proyecto.ligerito.model.Mochila}.
 * Hereda las operaciones CRUD estándar de {@link JpaRepository} y expone
 * consultas derivadas específicas del dominio.
 */
public interface MochilaRepository extends JpaRepository<Mochila, Long> {

    /**
     * Devuelve todas las mochilas asociadas a un usuario concreto.
     *
     * @param usuarioId ID del usuario propietario de las mochilas
     * @return lista de {@link com.proyecto.ligerito.model.Mochila} del usuario;
     *         lista vacía si el usuario no tiene ninguna
     */
    List<Mochila> findByUsuarioId(Long usuarioId);

    List<Mochila> findByEsPublicaTrue();
}
