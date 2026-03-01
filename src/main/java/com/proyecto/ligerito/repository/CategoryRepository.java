package com.proyecto.ligerito.repository;

import com.proyecto.ligerito.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    // Al extender JpaRepository, Spring genera automáticamente findAll() y save().
}