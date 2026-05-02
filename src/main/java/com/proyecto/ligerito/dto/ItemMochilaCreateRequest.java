package com.proyecto.ligerito.dto;

import jakarta.validation.constraints.NotNull;

/**
 * DTO para la creación de un ítem en la mochila.
 * Contiene los identificadores necesarios para asociar un ítem del armario
 * a una mochila dentro de una categoría específica.
 */
public class ItemMochilaCreateRequest {

    @NotNull(message = "La mochila es obligatoria")
    private Long mochilaId;

    @NotNull(message = "La categoría es obligatoria")
    private Long categoriaId;

    @NotNull(message = "El item del armario es obligatorio")
    private Long itemArmarioId;

    public ItemMochilaCreateRequest() {
    }

    /**
     * Crea un nuevo {@code ItemMochilaCreateRequest} con todos los campos requeridos.
     *
     * @param mochilaId     identificador de la mochila a la que se añade el ítem; no puede ser {@code null}
     * @param categoriaId   identificador de la categoría dentro de la mochila; no puede ser {@code null}
     * @param itemArmarioId identificador del ítem del armario que se incluirá; no puede ser {@code null}
     */
    public ItemMochilaCreateRequest(@NotNull(message = "La mochila es obligatoria") Long mochilaId,
            @NotNull(message = "La categoría es obligatoria") Long categoriaId,
            @NotNull(message = "El item del armario es obligatorio") Long itemArmarioId) {
        this.mochilaId = mochilaId;
        this.categoriaId = categoriaId;
        this.itemArmarioId = itemArmarioId;
    }

    public Long getMochilaId() {
        return mochilaId;
    }

    public void setMochilaId(Long mochilaId) {
        this.mochilaId = mochilaId;
    }

    public Long getCategoriaId() {
        return categoriaId;
    }

    public void setCategoriaId(Long categoriaId) {
        this.categoriaId = categoriaId;
    }

    public Long getItemArmarioId() {
        return itemArmarioId;
    }

    public void setItemArmarioId(Long itemArmarioId) {
        this.itemArmarioId = itemArmarioId;
    }

}
