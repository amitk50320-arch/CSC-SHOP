package com.customer.hub.data.repository

import com.customer.hub.data.local.dao.CustomerDao
import com.customer.hub.data.local.entity.CustomerEntity
import com.customer.hub.data.local.entity.ServiceRecordEntity
import com.customer.hub.data.local.relation.CustomerWithServices
import kotlinx.coroutines.flow.Flow

class CustomerRepository(private val customerDao: CustomerDao) {

    fun getAllCustomers(): Flow<List<CustomerWithServices>> =
        customerDao.getAllCustomersWithServices()

    fun searchCustomers(query: String): Flow<List<CustomerWithServices>> =
        customerDao.searchCustomers(query)

    suspend fun getCustomerById(id: String): CustomerWithServices? =
        customerDao.getCustomerById(id)

    suspend fun saveCustomerWithServices(
        customer: CustomerEntity,
        services: List<ServiceRecordEntity>
    ) = customerDao.insertCustomerWithServices(customer, services)

    suspend fun updateCustomer(customer: CustomerEntity) =
        customerDao.updateCustomer(customer)

    suspend fun deleteCustomer(customer: CustomerEntity) =
        customerDao.deleteCustomer(customer)

    suspend fun addServiceRecord(service: ServiceRecordEntity) =
        customerDao.insertService(service)

    suspend fun updateServiceRecord(service: ServiceRecordEntity) =
        customerDao.updateService(service)

    suspend fun deleteServiceRecord(service: ServiceRecordEntity) =
        customerDao.deleteService(service)
}
