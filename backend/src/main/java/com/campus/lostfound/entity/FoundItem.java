package com.campus.lostfound.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

/**
 * OOP Inheritance:
 * FoundItem extends the abstract BaseItem class, adding properties
 * specific to retrieved campus items available for ownership verification.
 */
@Entity
@Table(name = "found_items")
public class FoundItem extends BaseItem {

    @Column(name = "date_found", nullable = false)
    private LocalDate dateFound;

    @Column(name = "time_found", length = 50)
    private String timeFound;

    public FoundItem() {
        super();
    }

    public FoundItem(String itemCode, String itemName, Category category, String description,
                     String location, String imageUrl, String identifyingDetails,
                     User reportedBy, LocalDate dateFound, String timeFound) {
        super(itemCode, itemName, category, description, location, imageUrl, identifyingDetails, reportedBy, ItemStatus.AVAILABLE);
        this.dateFound = dateFound;
        this.timeFound = timeFound;
    }

    /**
     * Polymorphic implementation of getItemType()
     */
    @Override
    public String getItemType() {
        return "FOUND";
    }

    /**
     * Polymorphic implementation of isPendingAction()
     */
    @Override
    public boolean isPendingAction() {
        return getStatus() == ItemStatus.AVAILABLE || getStatus() == ItemStatus.CLAIMED;
    }

    public LocalDate getDateFound() {
        return dateFound;
    }

    public void setDateFound(LocalDate dateFound) {
        this.dateFound = dateFound;
    }

    public String getTimeFound() {
        return timeFound;
    }

    public void setTimeFound(String timeFound) {
        this.timeFound = timeFound;
    }
}

