package com.proyecto.ligerito.controller;

import com.proyecto.ligerito.model.Category;
import com.proyecto.ligerito.repository.CategoryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // Le dice a Spring que esto es una API web
@RequestMapping("/api/categories") // Define la URL de entrada
@CrossOrigin(origins = "*") // Permite que React se conecte luego sin problemas
public class CategoryController {

    private final CategoryRepository repository;

    // Inyectamos el repositorio para poder leer la base de datos
    public CategoryController(CategoryRepository repository) {
        this.repository = repository;
    }

    // Este método responde al GET del navegador
    @GetMapping
    public List<Category> getAll() {
        return repository.findAll();
    }

    // Este método servirá para crear categorías nuevas
    @PostMapping
    public Category create(@RequestBody Category category) {
        return repository.save(category);
    }
}