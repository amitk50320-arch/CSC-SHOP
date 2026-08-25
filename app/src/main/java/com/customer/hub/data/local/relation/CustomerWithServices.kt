package com.customer.hub.data.local.relation

import androidx.room.Embedded
import androidx.room.Relation
import com.customer.hub.data.local.entity.CustomerEntity
import com.customer.hub.data.local.entity.ServiceRecordEntity

data class CustomerWithServices(
    @Embedded val customer: CustomerEntity,
    @Relation(
        parentColumn = "id",
        entityColumn = "customerId"
    )
    val services: List<ServiceRecordEntity>
) {
    val totalFees: Double
        get() = services.sumOf { it.feeAmount }

    val totalPaid: Double
        get() = services.sumOf { it.paidAmount }

    val balanceDue: Double
        get() = totalFees - totalPaid

    val overallPaymentStatus: String
        get() = when {
            services.isEmpty() -> "No Services"
            balanceDue <= 0 -> "Paid"
            totalPaid > 0 -> "Partial"
            else -> "Pending"
        }
}
