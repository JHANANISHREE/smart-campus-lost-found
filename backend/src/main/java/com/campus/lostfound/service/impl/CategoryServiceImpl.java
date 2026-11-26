package com.campus.lostfound.service.impl;

import com.campus.lostfound.entity.Category;
import com.campus.lostfound.exception.BadRequestException;
import com.campus.lostfound.exception.ResourceNotFoundException;
import com.campus.lostfound.repository.CategoryRepository;
import com.campus.lostfound.service.CategoryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));
    }

    @Override
    @Transactional
    public Category createCategory(String name, String description, String icon) {
        if (categoryRepository.existsByCategoryName(name)) {
            throw new BadRequestException("Category with name '" + name + "' already exists.");
        }
        Category category = new Category(name, description, icon != null ? icon : "Package");
        return categoryRepository.save(category);
    }

    @Override
    @Transactional
    public Category updateCategory(Long id, String name, String description, String icon) {
        Category category = getCategoryById(id);
        category.setCategoryName(name);
        category.setDescription(description);
        if (icon != null) {
            category.setIcon(icon);
        }
        return categoryRepository.save(category);
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        Category category = getCategoryById(id);
        categoryRepository.delete(category);
    }
}

