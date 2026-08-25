package com.customer.hub

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.customer.hub.ui.screens.*
import com.customer.hub.ui.theme.CustomerRoomHubTheme
import com.customer.hub.viewmodel.AuthViewModel
import com.customer.hub.viewmodel.CustomerViewModel

class MainActivity : ComponentActivity() {

    private val authViewModel: AuthViewModel by viewModels()
    private val customerViewModel: CustomerViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            CustomerRoomHubTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    val navController = rememberNavController()
                    val authState by authViewModel.uiState.collectAsState()

                    NavHost(
                        navController = navController,
                        startDestination = if (authState.isAuthenticated) "list" else "login"
                    ) {
                        composable("login") {
                            LoginScreen(
                                authViewModel = authViewModel,
                                onLoginSuccess = { navController.navigate("list") { popUpTo("login") { inclusive = true } } }
                            )
                        }
                        composable("list") {
                            CustomerListScreen(
                                viewModel = customerViewModel,
                                onCustomerClick = { customerId -> navController.navigate("detail/$customerId") },
                                onAddCustomerClick = { navController.navigate("register") }
                            )
                        }
                        composable("register") {
                            CustomerRegistrationScreen(
                                viewModel = customerViewModel,
                                onNavigateBack = { navController.popBackStack() }
                            )
                        }
                    }
                }
            }
        }
    }
}
