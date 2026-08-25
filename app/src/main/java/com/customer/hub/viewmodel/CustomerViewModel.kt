package com.customer.hub.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.customer.hub.data.local.AppDatabase
import com.customer.hub.data.local.entity.CustomerEntity
import com.customer.hub.data.local.entity.ServiceRecordEntity
import com.customer.hub.data.local.relation.CustomerWithServices
import com.customer.hub.data.repository.CustomerRepository
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.util.UUID

data class CustomerUiState(
    val customers: List<CustomerWithServices> = emptyList(),
    val searchQuery: String = "",
    val filterStatus: String = "All",
    val selectedCustomer: CustomerWithServices? = null,
    val isLoading: Boolean = false,
    val message: String? = null
)

class CustomerViewModel(application: Application) : AndroidViewModel(application) {

    private val repository: CustomerRepository
    private val _searchQuery = MutableStateFlow("")
    private val _filterStatus = MutableStateFlow("All")
    private val _uiState = MutableStateFlow(CustomerUiState())
    val uiState: StateFlow<CustomerUiState> = _uiState.asStateFlow()

    init {
        val database = AppDatabase.getInstance(application)
        repository = CustomerRepository(database.customerDao())
        observeCustomers()
    }

    private fun observeCustomers() {
        viewModelScope.launch {
            _searchQuery
                .flatMapLatest { query ->
                    if (query.isBlank()) repository.getAllCustomers()
                    else repository.searchCustomers(query)
                }
                .combine(_filterStatus) { list, status ->
                    if (status == "All") list
                    else list.filter { it.overallPaymentStatus == status }
                }
                .collect { filteredList ->
                    _uiState.update { it.copy(customers = filteredList, isLoading = false) }
                }
        }
    }

    fun onSearchQueryChanged(query: String) {
        _searchQuery.value = query
        _uiState.update { it.copy(searchQuery = query) }
    }

    fun onFilterChanged(status: String) {
        _filterStatus.value = status
        _uiState.update { it.copy(filterStatus = status) }
    }

    fun saveCustomer(
        fullName: String,
        phone: String,
        email: String,
        gender: String,
        dob: String,
        address: String,
        city: String,
        state: String,
        pincode: String,
        aadhaarNumber: String,
        panNumber: String,
        photoPath: String?,
        signaturePath: String?,
        services: List<ServiceRecordEntity>,
        existingId: String? = null
    ) {
        viewModelScope.launch {
            val customerId = existingId ?: UUID.randomUUID().toString()
            val customerCode = "CUST-" + (1000..9999).random()

            val customer = CustomerEntity(
                id = customerId,
                customerCode = customerCode,
                fullName = fullName,
                phone = phone,
                email = email,
                gender = gender,
                dob = dob,
                address = address,
                city = city,
                state = state,
                pincode = pincode,
                aadhaarNumber = aadhaarNumber,
                panNumber = panNumber.uppercase(),
                isAadhaarVerified = aadhaarNumber.length == 12,
                isPanVerified = panNumber.matches(Regex("[A-Z]{5}[0-9]{4}[A-Z]{1}")),
                photoPath = photoPath,
                signaturePath = signaturePath,
                updatedAt = System.currentTimeMillis()
            )

            val updatedServices = services.map { it.copy(customerId = customerId) }
            repository.saveCustomerWithServices(customer, updatedServices)
            _uiState.update { it.copy(message = "Customer saved successfully to SQLite Room DB!") }
        }
    }

    fun deleteCustomer(customer: CustomerEntity) {
        viewModelScope.launch {
            repository.deleteCustomer(customer)
            _uiState.update { it.copy(message = "Customer record deleted") }
        }
    }
}
