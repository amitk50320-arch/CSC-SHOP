package com.customer.hub.data.local.entity

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey

@Entity(
    tableName = "service_records",
    foreignKeys = [
        ForeignKey(
            entity = CustomerEntity::class,
            parentColumns = ["id"],
            childColumns = ["customerId"],
            onDelete = ForeignKey.CASCADE
        )
    ],
    indices = [
        Index(value = ["customerId"]),
        Index(value = ["invoiceNumber"], unique = true)
    ]
)
data class ServiceRecordEntity(
    @PrimaryKey
    val id: String,
    val customerId: String,
    val serviceName: String,
    val serviceCategory: String, // Legal, Taxation, Registration, Documentation, Licensing
    val feeAmount: Double,
    val paidAmount: Double,
    val paymentStatus: String, // Paid, Partial, Pending
    val paymentMode: String, // UPI, Cash, Bank Transfer, Cheque, Card
    val serviceDate: String,
    val invoiceNumber: String,
    val notes: String? = null,
    val createdAt: Long = System.currentTimeMillis()
)
