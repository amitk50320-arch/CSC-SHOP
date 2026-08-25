package com.customer.hub.data.local.entity

import androidx.room.Entity
import androidx.room.Index
import androidx.room.PrimaryKey

@Entity(
    tableName = "customers",
    indices = [
        Index(value = ["customerCode"], unique = true),
        Index(value = ["aadhaarNumber"]),
        Index(value = ["panNumber"]),
        Index(value = ["phone"])
    ]
)
data class CustomerEntity(
    @PrimaryKey
    val id: String,
    val customerCode: String,
    val fullName: String,
    val phone: String,
    val email: String,
    val gender: String,
    val dob: String,
    val address: String,
    val city: String,
    val state: String,
    val pincode: String,
    val aadhaarNumber: String,
    val panNumber: String,
    val isAadhaarVerified: Boolean = false,
    val isPanVerified: Boolean = false,
    val photoPath: String? = null,
    val signaturePath: String? = null,
    val notes: String? = null,
    val status: String = "Active",
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis()
)
