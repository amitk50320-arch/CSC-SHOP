package com.customer.hub.data.local.dao

import androidx.room.*
import com.customer.hub.data.local.entity.CustomerEntity
import com.customer.hub.data.local.entity.ServiceRecordEntity
import com.customer.hub.data.local.relation.CustomerWithServices
import kotlinx.coroutines.flow.Flow

@Dao
interface CustomerDao {

    @Transaction
    @Query("SELECT * FROM customers ORDER BY createdAt DESC")
    fun getAllCustomersWithServices(): Flow<List<CustomerWithServices>>

    @Transaction
    @Query("""
        SELECT * FROM customers
        WHERE fullName LIKE '%' || :query || '%'
           OR phone LIKE '%' || :query || '%'
           OR aadhaarNumber LIKE '%' || :query || '%'
           OR panNumber LIKE '%' || :query || '%'
           OR customerCode LIKE '%' || :query || '%'
           OR email LIKE '%' || :query || '%'
        ORDER BY createdAt DESC
    """)
    fun searchCustomers(query: String): Flow<List<CustomerWithServices>>

    @Transaction
    @Query("SELECT * FROM customers WHERE id = :customerId LIMIT 1")
    suspend fun getCustomerById(customerId: String): CustomerWithServices?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCustomer(customer: CustomerEntity)

    @Update
    suspend fun updateCustomer(customer: CustomerEntity)

    @Delete
    suspend fun deleteCustomer(customer: CustomerEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertService(service: ServiceRecordEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertServices(services: List<ServiceRecordEntity>)

    @Update
    suspend fun updateService(service: ServiceRecordEntity)

    @Delete
    suspend fun deleteService(service: ServiceRecordEntity)

    @Query("DELETE FROM service_records WHERE customerId = :customerId")
    suspend fun deleteServicesByCustomerId(customerId: String)

    @Transaction
    suspend fun insertCustomerWithServices(
        customer: CustomerEntity,
        services: List<ServiceRecordEntity>
    ) {
        insertCustomer(customer)
        if (services.isNotEmpty()) {
            insertServices(services)
        }
    }

    @Query("SELECT COUNT(*) FROM customers")
    suspend fun getCustomerCount(): Int

    @Query("SELECT SUM(feeAmount) FROM service_records")
    suspend fun getTotalRevenue(): Double?

    @Query("SELECT SUM(paidAmount) FROM service_records")
    suspend fun getTotalCollected(): Double?
}
