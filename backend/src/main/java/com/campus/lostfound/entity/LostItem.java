package com.campus.lostfound.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

/**
 * OOP Inheritance:
 * LostItem extends the abstract BaseItem class, inheriting core attributes
 * and adding domain fields specific to missing belongings.
 */
@Entity
@Table(name = "lost_items")
public class LostItem extends BaseItem {

    @Column(name = "date_lost", nullable = false)
    private LocalDate dateLost;

    @Column(name = "time_lost", length = 50)
    private String timeLost;

    @Column(name = "contact_preference", length = 50)
    private String contactPreference = "EMAIL";

    public LostItem() {
        super();
    }

    public LostItem(String itemCode, String itemName, Category category, String description,
                    String location, String imageUrl, String identifyingDetails,
                    User reportedBy, LocalDate dateLost, String timeLost, String contactPreference) {
        super(itemCode, itemName, category, description, location, imageUrl, identifyingDetails, reportedBy, ItemStatus.LOST);
        this.dateLost = dateLost;
        this.timeLost = timeLost;
        this.contactPreference = contactPreference != null ? contactPreference : "EMAIL";
    }

    /**
     * Polymorphic implementation of getItemType()
     */
    @Override
    public String getItemType() {
        return "LOST";
    }

    /**
     * Polymorphic implementation of isPendingAction()
     */
    @Override
    public boolean isPendingAction() {
        return getStatus() == ItemStatus.LOST || getStatus() == ItemStatus.FOUND_MATCH;
    }

    public LocalDate getDateLost() {
        return dateLost;
    }

    public void setDateLost(LocalDate dateLost) {
        this.dateLost = dateLost;
    }

    public String getTimeLost() {
        return timeLost;
    }

    public void setTimeLost(String timeLost) {
        this.timeLost = timeLost;
    }

    public String getContactPreference() {
        return contactPreference;
    }

    public void setContactPreference(String contactPreference) {
        this.contactPreference = contactPreference;
    }
}

