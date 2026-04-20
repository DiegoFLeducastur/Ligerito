package com.proyecto.ligerito;

import java.util.ArrayList;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.proyecto.ligerito.model.ItemArmario;
import com.proyecto.ligerito.model.Usuario;
import com.proyecto.ligerito.repository.ItemArmarioRepository;
import com.proyecto.ligerito.repository.UsuarioRepository;

@SpringBootApplication
public class LigeritoApplication {

    private static final Logger log = LoggerFactory.getLogger(LigeritoApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(LigeritoApplication.class, args);
    }

    @Bean
    CommandLineRunner cargarDatosIniciales(
            UsuarioRepository usuarioRepository,
            ItemArmarioRepository itemArmarioRepository) {
        return args -> {
            log.info(">>> Entrando en DatosIniciales");

            Usuario usuario;

            if (usuarioRepository.count() == 0) {
                Usuario nuevoUsuario = new Usuario(
                        null,
                        "diego",
                        "diego@email.com",
                        "1234",
                        new ArrayList<>(),
                        new ArrayList<>());

                usuario = usuarioRepository.save(nuevoUsuario);
                log.info(">>> Usuario creado con id: {}", usuario.getId());
            } else {
                usuario = usuarioRepository.findAll().get(0);
                log.info(">>> Usuario ya existente con id: {}", usuario.getId());
            }

            if (itemArmarioRepository.count() == 0) {
                ItemArmario item1 = new ItemArmario(
                        null,
                        "camiseta",
                        146,
                        "de lana merina",
                        "www.google.es/lana",
                        usuario
                );

                ItemArmario item2 = new ItemArmario(
                        null,
                        "linterna",
                        46,
                        "sin bateria",
                        "www.google.es/led",
                        usuario
                );

                ItemArmario item3 = new ItemArmario(
                        null,
                        "bateria externa",
                        224,
                        "15000mah",
                        "www.google.es/bateria",
                        usuario
                );

                itemArmarioRepository.save(item1);
                itemArmarioRepository.save(item2);
                itemArmarioRepository.save(item3);

                log.info(">>> Items de armario creados correctamente");
            }
        };
    }
}