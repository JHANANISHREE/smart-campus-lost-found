package com.campus.lostfound.service;

import com.campus.lostfound.entity.Category;
import java.util.List;

public interface CategoryService {
    List<Category> getAllCategories();
    Category getCategoryById(Long id);
    Category createCategory(String name, String description, String icon);
    Category updateCategory(Long id, String name, String description, String icon);
    void deleteCategory(Long id);
}

