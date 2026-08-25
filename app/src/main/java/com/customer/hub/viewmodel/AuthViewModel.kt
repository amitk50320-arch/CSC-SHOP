package com.customer.hub.viewmodel

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

data class AuthUiState(
    val isAuthenticated: Boolean = false,
    val username: String = "",
    val error: String? = null
)

class AuthViewModel : ViewModel() {

    private val _uiState = MutableStateFlow(AuthUiState())
    val uiState: StateFlow<AuthUiState> = _uiState.asStateFlow()

    // Default credentials as specified in requirement
    companion object {
        const val DEFAULT_USERNAME = "admin"
        const val DEFAULT_PASSWORD = "admin123"
    }

    fun login(user: String, pass: String): Boolean {
        return if (user.trim() == DEFAULT_USERNAME && pass == DEFAULT_PASSWORD) {
            _uiState.update { it.copy(isAuthenticated = true, username = user, error = null) }
            true
        } else {
            _uiState.update { it.copy(error = "Invalid credentials. Use admin / admin123") }
            false
        }
    }

    fun loginWithBiometrics(): Boolean {
        _uiState.update { it.copy(isAuthenticated = true, username = "admin (Biometric)", error = null) }
        return true
    }

    fun logout() {
        _uiState.update { AuthUiState() }
    }
}
