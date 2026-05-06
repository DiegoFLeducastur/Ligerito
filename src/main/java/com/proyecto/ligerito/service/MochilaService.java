package com.proyecto.ligerito.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.proyecto.ligerito.dto.ItemPublicoResponse;
import com.proyecto.ligerito.dto.MochilaCreateRequest;
import com.proyecto.ligerito.dto.MochilaResponse;
import com.proyecto.ligerito.model.Categoria;
import com.proyecto.ligerito.model.Mochila;
import com.proyecto.ligerito.model.Usuario;
import com.proyecto.ligerito.repository.MochilaRepository;
import com.proyecto.ligerito.repository.UsuarioRepository;
import com.proyecto.ligerito.dto.MochilaPatchRequest;
import com.proyecto.ligerito.dto.MochilaPublicaDetalleResponse;
import com.proyecto.ligerito.dto.MochilaPublicaResponse;

/**
 * Servicio que gestiona la lógica de negocio de las mochilas.
 * Permite listar las mochilas de un usuario, crear nuevas, actualizarlas
 * parcialmente y eliminarlas, asegurando que cada mochila quede vinculada a un
 * {@link com.proyecto.ligerito.model.Usuario} válido.
 */
@Service
public class MochilaService {

        private final MochilaRepository mochilaRepository;
        private final UsuarioRepository usuarioRepository;

        public MochilaService(MochilaRepository mochilaRepository, UsuarioRepository usuarioRepository) {
                this.mochilaRepository = mochilaRepository;
                this.usuarioRepository = usuarioRepository;
        }

        /**
         * Devuelve todas las mochilas asociadas a un usuario.
         *
         * @param usuarioId ID del usuario propietario de las mochilas
         * @return lista de {@link MochilaResponse} con los datos de cada mochila
         */
        public List<MochilaResponse> listarPorUsuario(Long usuarioId) {
                List<Mochila> mochilas = mochilaRepository.findByUsuarioId(usuarioId);

                return mochilas.stream()
                                .map(m -> new MochilaResponse(
                                                m.getId(),
                                                m.getNombre(),
                                                m.isEsPublica()))
                                .toList();
        }

        /**
         * Crea una nueva mochila y la asocia al usuario indicado en el request.
         *
         * @param request datos de la mochila a crear (nombre, visibilidad e ID de
         *                usuario)
         * @return {@link MochilaResponse} con los datos de la mochila recién creada
         * @throws ResponseStatusException 404 si el usuario no existe
         */
        public MochilaResponse crearMochila(MochilaCreateRequest request) {
                Usuario usuario = usuarioRepository.findById(request.getUsuarioId())
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "Usuario no encontrado"));

                Mochila nuevaMochila = new Mochila();
                nuevaMochila.setNombre(request.getNombre());
                nuevaMochila.setEsPublica(request.getEsPublica());
                nuevaMochila.setUsuario(usuario);

                Mochila guardada = mochilaRepository.save(nuevaMochila);

                return new MochilaResponse(
                                guardada.getId(),
                                guardada.getNombre(),
                                guardada.isEsPublica());
        }

        /**
         * Elimina la mochila con el ID indicado.
         *
         * @param id ID de la mochila a eliminar
         * @throws ResponseStatusException 404 si la mochila no existe
         */
        public void eliminarPorId(Long id) {
                Mochila mochila = mochilaRepository.findById(id)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "Mochila no encontrada"));

                mochilaRepository.delete(mochila);
        }

        /**
         * Actualiza parcialmente una mochila existente.
         * Solo se modifican los campos no nulos del request; el nombre además se ignora
         * si está en blanco.
         *
         * @param id      ID de la mochila a actualizar
         * @param request campos opcionales a actualizar (nombre y/o visibilidad)
         * @return {@link MochilaResponse} con los datos actualizados de la mochila
         * @throws ResponseStatusException 404 si la mochila no existe
         */
        public MochilaResponse actualizarParcial(Long id, MochilaPatchRequest request) {
                Mochila mochila = mochilaRepository.findById(id)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "Mochila no encontrada"));

                if (request.getNombre() != null && !request.getNombre().isBlank()) {
                        mochila.setNombre(request.getNombre());
                }

                if (request.getEsPublica() != null) {
                        mochila.setEsPublica(request.getEsPublica());
                }

                Mochila guardada = mochilaRepository.save(mochila);

                return new MochilaResponse(
                                guardada.getId(),
                                guardada.getNombre(),
                                guardada.isEsPublica());
        }

        public List<MochilaPublicaResponse> listarPublicas() {
                List<Mochila> mochilasPublicas = mochilaRepository.findByEsPublicaTrue();

                return mochilasPublicas.stream()
                                .map(mochila -> {
                                        int pesoTotal = mochila.getItemsMochila().stream()
                                                        .mapToInt(item -> item.getItemArmario().getPeso()
                                                                        * item.getCantidad())
                                                        .sum();

                                        return new MochilaPublicaResponse(
                                                        mochila.getId(),
                                                        mochila.getNombre(),
                                                        mochila.getUsuario().getNick(),
                                                        pesoTotal);
                                })
                                .toList();
        }

        public MochilaPublicaDetalleResponse obtenerDetallePublic(Long id) {
                Mochila mochila = mochilaRepository.findById(id)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "Mochila no encontrada"));
                if (!mochila.isEsPublica()) {
                        throw new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "La mochila no es pública");
                }

                int pesoTotal = mochila.getItemsMochila().stream()
                                .mapToInt(item -> item.getItemArmario().getPeso() * item.getCantidad())
                                .sum();

                List<String> categorias = mochila.getCategorias().stream()
                                .map(Categoria::getNombre)
                                .toList();

                List<ItemPublicoResponse> items = mochila.getItemsMochila().stream()
                                .map(item -> new ItemPublicoResponse(
                                                item.getId(),
                                                item.getItemArmario().getNombre(),
                                                item.getItemArmario().getPeso(),
                                                item.getCantidad(),
                                                item.getCategoria().getNombre(),
                                                item.getItemArmario().getDescripcion(),
                                                item.getItemArmario().getEnlace()))
                                .toList();

                return new MochilaPublicaDetalleResponse(
                                mochila.getId(),
                                mochila.getNombre(),
                                mochila.getUsuario().getNick(),
                                pesoTotal,
                                categorias,
                                items);
        }
}
