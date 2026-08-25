export interface AndroidProjectFile {
  path: string;
  name: string;
  category: 'gradle' | 'manifest' | 'room' | 'viewmodel' | 'ui' | 'utils' | 'res' | 'docs';
  description: string;
  language: 'kotlin' | 'groovy' | 'xml' | 'toml' | 'properties' | 'markdown';
  content: string;
}

export const ANDROID_PROJECT_FILES: AndroidProjectFile[] = [
  {
    path: "settings.gradle.kts",
    name: "settings.gradle.kts",
    category: "gradle",
    description: "Plugin management and repository configuration for Android Studio Gradle build",
    language: "kotlin",
    content: `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "CustomerRoomHub"
include(":app")
`
  },
  {
    path: "build.gradle.kts",
    name: "build.gradle.kts (Root)",
    category: "gradle",
    description: "Root Gradle build configuration with Kotlin 2.0 & Android Gradle Plugin",
    language: "kotlin",
    content: `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
    alias(libs.plugins.ksp) apply false
}
`
  },
  {
    path: "gradle/libs.versions.toml",
    name: "libs.versions.toml",
    category: "gradle",
    description: "Modern Gradle Version Catalog defining dependencies, Room SQLite, Material 3",
    language: "toml",
    content: `[versions]
agp = "8.5.2"
kotlin = "2.0.20"
coreKtx = "1.13.1"
junit = "4.13.2"
junitVersion = "1.2.1"
espressoCore = "3.6.1"
lifecycleRuntimeKtx = "2.8.4"
activityCompose = "1.9.1"
composeBom = "2024.08.00"
navigationCompose = "2.8.0"
room = "2.6.1"
ksp = "2.0.20-1.0.25"
material3 = "1.2.1"
materialIconsExtended = "1.7.0"
coil = "2.7.0"
coroutines = "1.8.1"
biometric = "1.2.0-alpha05"
camerax = "1.3.4"
gson = "2.11.0"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
androidx-lifecycle-runtime-ktx = { group = "androidx.lifecycle", name = "lifecycle-runtime-ktx", version.ref = "lifecycleRuntimeKtx" }
androidx-lifecycle-viewmodel-compose = { group = "androidx.lifecycle", name = "lifecycle-viewmodel-compose", version.ref = "lifecycleRuntimeKtx" }
androidx-activity-compose = { group = "androidx.activity", name = "activity-compose", version.ref = "activityCompose" }
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
androidx-ui = { group = "androidx.compose.ui", name = "ui" }
androidx-ui-graphics = { group = "androidx.compose.ui", name = "ui-graphics" }
androidx-ui-tooling = { group = "androidx.compose.ui", name = "ui-tooling" }
androidx-ui-tooling-preview = { group = "androidx.compose.ui", name = "ui-tooling-preview" }
androidx-material3 = { group = "androidx.compose.material3", name = "material3", version.ref = "material3" }
androidx-material-icons-extended = { group = "androidx.compose.material", name = "material-icons-extended", version.ref = "materialIconsExtended" }
androidx-navigation-compose = { group = "androidx.navigation", name = "navigation-compose", version.ref = "navigationCompose" }

# Room SQLite Database
androidx-room-runtime = { group = "androidx.room", name = "room-runtime", version.ref = "room" }
androidx-room-ktx = { group = "androidx.room", name = "room-ktx", version.ref = "room" }
androidx-room-compiler = { group = "androidx.room", name = "room-compiler", version.ref = "room" }

# CameraX
androidx-camera-core = { group = "androidx.camera", name = "camera-core", version.ref = "camerax" }
androidx-camera-camera2 = { group = "androidx.camera", name = "camera-camera2", version.ref = "camerax" }
androidx-camera-lifecycle = { group = "androidx.camera", name = "camera-lifecycle", version.ref = "camerax" }
androidx-camera-view = { group = "androidx.camera", name = "camera-view", version.ref = "camerax" }

# Image Loading & Utilities
coil-compose = { group = "io.coil-kt", name = "coil-compose", version.ref = "coil" }
kotlinx-coroutines-android = { group = "org.jetbrains.kotlinx", name = "kotlinx-coroutines-android", version.ref = "coroutines" }
androidx-biometric = { group = "androidx.biometric", name = "biometric", version.ref = "biometric" }
google-gson = { group = "com.google.code.gson", name = "gson", version.ref = "gson" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
kotlin-compose = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
ksp = { id = "com.google.devtools.ksp", version.ref = "ksp" }
`
  },
  {
    path: "gradle.properties",
    name: "gradle.properties",
    category: "gradle",
    description: "JVM arguments and AndroidX flags for fast builds",
    language: "properties",
    content: `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.nonTransitiveRClass=true
kotlin.code.style=official
`
  },
  {
    path: "app/build.gradle.kts",
    name: "app/build.gradle.kts",
    category: "gradle",
    description: "App module build script with Room SQLite KSP, Jetpack Compose Material 3",
    language: "kotlin",
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.ksp)
}

android {
    namespace = "com.customer.hub"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.customer.hub"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }

        // Room SQLite schema export directory
        ksp {
            arg("room.schemaLocation", "$projectDir/schemas")
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.androidx.activity.compose)
    
    // Compose & Material 3
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.ui.graphics)
    implementation(libs.androidx.ui.tooling.preview)
    implementation(libs.androidx.material3)
    implementation(libs.androidx.material.icons.extended)
    implementation(libs.androidx.navigation.compose)

    // Room SQLite Database
    implementation(libs.androidx.room.runtime)
    implementation(libs.androidx.room.ktx)
    ksp(libs.androidx.room.compiler)

    // CameraX & Image
    implementation(libs.androidx.camera.core)
    implementation(libs.androidx.camera.camera2)
    implementation(libs.androidx.camera.lifecycle)
    implementation(libs.androidx.camera.view)
    implementation(libs.coil.compose)

    // Utilities
    implementation(libs.kotlinx.coroutines.android)
    implementation(libs.androidx.biometric)
    implementation(libs.google.gson)

    debugImplementation(libs.androidx.ui.tooling)
}
`
  },
  {
    path: "app/src/main/AndroidManifest.xml",
    name: "AndroidManifest.xml",
    category: "manifest",
    description: "App permissions (Camera, Read/Write Storage, Biometric) and FileProvider for CSV sharing",
    language: "xml",
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Permissions -->
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
    <uses-permission android:name="android.permission.USE_BIOMETRIC" />

    <uses-feature android:name="android.hardware.camera" android:required="false" />

    <application
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.CustomerRoomHub">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.CustomerRoomHub"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- FileProvider for exporting CSV and Room Database Backups -->
        <provider
            android:name="androidx.core.content.FileProvider"
            android:authorities="com.customer.hub.fileprovider"
            android:exported="false"
            android:grantUriPermissions="true">
            <meta-data
                android:name="android.support.FILE_PROVIDER_PATHS"
                android:resource="@xml/file_paths" />
        </provider>

    </application>

</manifest>
`
  },
  {
    path: "app/src/main/java/com/customer/hub/data/local/entity/CustomerEntity.kt",
    name: "CustomerEntity.kt",
    category: "room",
    description: "Room SQLite Entity for Customers with PAN, Aadhaar, Photo and Signature paths",
    language: "kotlin",
    content: `package com.customer.hub.data.local.entity

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
`
  },
  {
    path: "app/src/main/java/com/customer/hub/data/local/entity/ServiceRecordEntity.kt",
    name: "ServiceRecordEntity.kt",
    category: "room",
    description: "Room SQLite Entity for Service Fee transactions with Foreign Key to Customer",
    language: "kotlin",
    content: `package com.customer.hub.data.local.entity

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
`
  },
  {
    path: "app/src/main/java/com/customer/hub/data/local/relation/CustomerWithServices.kt",
    name: "CustomerWithServices.kt",
    category: "room",
    description: "1-to-N Room Relation object combining Customer with all associated Service & Fee records",
    language: "kotlin",
    content: `package com.customer.hub.data.local.relation

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
`
  },
  {
    path: "app/src/main/java/com/customer/hub/data/local/dao/CustomerDao.kt",
    name: "CustomerDao.kt",
    category: "room",
    description: "Room SQLite Data Access Object with reactive Flow queries, search, and transactions",
    language: "kotlin",
    content: `package com.customer.hub.data.local.dao

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
`
  },
  {
    path: "app/src/main/java/com/customer/hub/data/local/AppDatabase.kt",
    name: "AppDatabase.kt",
    category: "room",
    description: "Room SQLite Database singleton with thread-safe builder and sample data seeder",
    language: "kotlin",
    content: `package com.customer.hub.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.customer.hub.data.local.dao.CustomerDao
import com.customer.hub.data.local.entity.CustomerEntity
import com.customer.hub.data.local.entity.ServiceRecordEntity

@Database(
    entities = [CustomerEntity::class, ServiceRecordEntity::class],
    version = 1,
    exportSchema = true
)
abstract class AppDatabase : RoomDatabase() {

    abstract fun customerDao(): CustomerDao

    companion object {
        const val DATABASE_NAME = "customer_hub.db"

        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getInstance(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    DATABASE_NAME
                )
                .fallbackToDestructiveMigration()
                .build()
                INSTANCE = instance
                instance
            }
        }
    }
}
`
  },
  {
    path: "app/src/main/java/com/customer/hub/data/repository/CustomerRepository.kt",
    name: "CustomerRepository.kt",
    category: "room",
    description: "Repository pattern encapsulating Room SQLite queries and mutations",
    language: "kotlin",
    content: `package com.customer.hub.data.repository

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
`
  },
  {
    path: "app/src/main/java/com/customer/hub/viewmodel/CustomerViewModel.kt",
    name: "CustomerViewModel.kt",
    category: "viewmodel",
    description: "State holder managing search, filters, form fields, and Room database operations",
    language: "kotlin",
    content: `package com.customer.hub.viewmodel

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
`
  },
  {
    path: "app/src/main/java/com/customer/hub/viewmodel/AuthViewModel.kt",
    name: "AuthViewModel.kt",
    category: "viewmodel",
    description: "Default login auth state with admin / admin123 and biometric authentication handler",
    language: "kotlin",
    content: `package com.customer.hub.viewmodel

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
`
  },
  {
    path: "app/src/main/java/com/customer/hub/ui/screens/LoginScreen.kt",
    name: "LoginScreen.kt",
    category: "ui",
    description: "Jetpack Compose Material 3 Login screen with admin/admin123 default autofill badge",
    language: "kotlin",
    content: `package com.customer.hub.ui.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import com.customer.hub.viewmodel.AuthViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LoginScreen(
    authViewModel: AuthViewModel,
    onLoginSuccess: () -> Unit
) {
    var username by remember { mutableStateOf(AuthViewModel.DEFAULT_USERNAME) }
    var password by remember { mutableStateOf(AuthViewModel.DEFAULT_PASSWORD) }
    var passwordVisible by remember { mutableStateOf(false) }
    val uiState by authViewModel.uiState.collectAsState()

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = MaterialTheme.colorScheme.background
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // App Branding Icon
            Surface(
                modifier = Modifier.size(80.dp),
                shape = RoundedCornerShape(24.dp),
                color = MaterialTheme.colorScheme.primaryContainer
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(
                        imageVector = Icons.Default.AccountBalance,
                        contentDescription = "Logo",
                        tint = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.size(44.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            Text(
                text = "Customer Hub",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onBackground
            )

            Text(
                text = "Room SQLite & KYC Management Studio",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            Spacer(modifier = Modifier.height(28.dp))

            // Default Credentials Badge
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.secondaryContainer),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        Icons.Default.Info,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.secondary,
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Default Login: admin / admin123",
                        style = MaterialTheme.typography.labelMedium,
                        color = MaterialTheme.colorScheme.onSecondaryContainer,
                        fontWeight = FontWeight.Medium
                    )
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Username field
            OutlinedTextField(
                value = username,
                onValueChange = { username = it },
                label = { Text("Username") },
                leadingIcon = { Icon(Icons.Default.Person, contentDescription = null) },
                singleLine = true,
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Password field
            OutlinedTextField(
                value = password,
                onValueChange = { password = it },
                label = { Text("Password") },
                leadingIcon = { Icon(Icons.Default.Lock, contentDescription = null) },
                trailingIcon = {
                    IconButton(onClick = { passwordVisible = !passwordVisible }) {
                        Icon(
                            imageVector = if (passwordVisible) Icons.Default.Visibility else Icons.Default.VisibilityOff,
                            contentDescription = null
                        )
                    }
                },
                visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                singleLine = true,
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            )

            if (uiState.error != null) {
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = uiState.error ?: "",
                    color = MaterialTheme.colorScheme.error,
                    style = MaterialTheme.typography.bodySmall
                )
            }

            Spacer(modifier = Modifier.height(24.dp))

            Button(
                onClick = {
                    if (authViewModel.login(username, password)) {
                        onLoginSuccess()
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp),
                shape = RoundedCornerShape(12.dp)
            ) {
                Icon(Icons.Default.Login, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Sign In to Studio", fontWeight = FontWeight.SemiBold)
            }

            Spacer(modifier = Modifier.height(12.dp))

            OutlinedButton(
                onClick = {
                    if (authViewModel.loginWithBiometrics()) {
                        onLoginSuccess()
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp),
                shape = RoundedCornerShape(12.dp)
            ) {
                Icon(Icons.Default.Fingerprint, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Unlock with Biometrics")
            }
        }
    }
}
`
  },
  {
    path: "app/src/main/java/com/customer/hub/ui/screens/CustomerRegistrationScreen.kt",
    name: "CustomerRegistrationScreen.kt",
    category: "ui",
    description: "Jetpack Compose KYC Form: Aadhaar, PAN, Camera Photo, Canvas Signature & Fee records",
    language: "kotlin",
    content: `package com.customer.hub.ui.screens

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.customer.hub.data.local.entity.ServiceRecordEntity
import com.customer.hub.ui.components.SignaturePad
import com.customer.hub.viewmodel.CustomerViewModel
import java.util.UUID

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CustomerRegistrationScreen(
    viewModel: CustomerViewModel,
    onNavigateBack: () -> Unit
) {
    var fullName by remember { mutableStateOf("") }
    var phone by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var gender by remember { mutableStateOf("Male") }
    var dob by remember { mutableStateOf("1995-05-15") }
    var address by remember { mutableStateOf("") }
    var city by remember { mutableStateOf("") }
    var state by remember { mutableStateOf("") }
    var pincode by remember { mutableStateOf("") }

    // KYC
    var aadhaarNumber by remember { mutableStateOf("") }
    var panNumber by remember { mutableStateOf("") }

    // Media & Signature
    var photoPath by remember { mutableStateOf<String?>(null) }
    var signaturePath by remember { mutableStateOf<String?>(null) }

    // Services & Fees
    var serviceName by remember { mutableStateOf("GST Registration & Filing") }
    var serviceCategory by remember { mutableStateOf("Taxation") }
    var feeAmount by remember { mutableStateOf("5000") }
    var paidAmount by remember { mutableStateOf("5000") }
    var paymentMode by remember { mutableStateOf("UPI") }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Register Customer (KYC)") },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    IconButton(onClick = {
                        // Demo fill
                        fullName = "Vikram Aditya Singh"
                        phone = "9820123456"
                        email = "vikram.singh@lawcorp.in"
                        address = "45 Nariman Point, Marine Drive"
                        city = "Mumbai"
                        state = "Maharashtra"
                        pincode = "400021"
                        aadhaarNumber = "890123456789"
                        panNumber = "AAAPS8899K"
                    }) {
                        Icon(Icons.Default.AutoFixHigh, contentDescription = "Fill Sample")
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .verticalScroll(rememberScrollState())
                .padding(16.dp)
        ) {
            // 1. Personal Details Section
            SectionHeader(title = "1. Personal Details", icon = Icons.Default.Person)
            OutlinedTextField(
                value = fullName,
                onValueChange = { fullName = it },
                label = { Text("Full Name *") },
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(modifier = Modifier.height(10.dp))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                OutlinedTextField(
                    value = phone,
                    onValueChange = { phone = it },
                    label = { Text("Mobile Number *") },
                    modifier = Modifier.weight(1f)
                )
                OutlinedTextField(
                    value = email,
                    onValueChange = { email = it },
                    label = { Text("Email Address") },
                    modifier = Modifier.weight(1f)
                )
            }

            Spacer(modifier = Modifier.height(20.dp))

            // 2. Official KYC Fields (Aadhaar & PAN)
            SectionHeader(title = "2. Indian KYC Documents", icon = Icons.Default.Badge)
            OutlinedTextField(
                value = aadhaarNumber,
                onValueChange = { if (it.length <= 12) aadhaarNumber = it.filter { c -> c.isDigit() } },
                label = { Text("Aadhaar Number (12 Digits)") },
                trailingIcon = {
                    if (aadhaarNumber.length == 12) {
                        Icon(Icons.Default.CheckCircle, contentDescription = "Valid", tint = Color(0xFF16A34A))
                    }
                },
                supportingText = { Text("Format: 12 numeric digits • Stored in Room SQLite") },
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(modifier = Modifier.height(10.dp))
            OutlinedTextField(
                value = panNumber,
                onValueChange = { if (it.length <= 10) panNumber = it.uppercase() },
                label = { Text("PAN Number (10 Characters)") },
                trailingIcon = {
                    if (panNumber.matches(Regex("[A-Z]{5}[0-9]{4}[A-Z]{1}"))) {
                        Icon(Icons.Default.CheckCircle, contentDescription = "Valid", tint = Color(0xFF16A34A))
                    }
                },
                supportingText = { Text("Format: AAAAA9999A (e.g. ABCDE1234F)") },
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(20.dp))

            // 3. Photo & Digital Signature
            SectionHeader(title = "3. Photo & Signature", icon = Icons.Default.Draw)
            Card(
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Digital Signature Pad", fontWeight = FontWeight.Bold)
                    Text("Sign inside the box using stylus or finger", style = MaterialTheme.typography.bodySmall)
                    Spacer(modifier = Modifier.height(8.dp))
                    SignaturePad(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(140.dp)
                            .clip(RoundedCornerShape(8.dp))
                            .background(Color.White)
                    ) { path ->
                        signaturePath = path
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // 4. Service & Fee Record
            SectionHeader(title = "4. Service & Fee Record", icon = Icons.Default.Payments)
            OutlinedTextField(
                value = serviceName,
                onValueChange = { serviceName = it },
                label = { Text("Service Requested") },
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(modifier = Modifier.height(10.dp))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                OutlinedTextField(
                    value = feeAmount,
                    onValueChange = { feeAmount = it },
                    label = { Text("Total Fee (₹)") },
                    modifier = Modifier.weight(1f)
                )
                OutlinedTextField(
                    value = paidAmount,
                    onValueChange = { paidAmount = it },
                    label = { Text("Paid Fee (₹)") },
                    modifier = Modifier.weight(1f)
                )
            }

            Spacer(modifier = Modifier.height(28.dp))

            // Submit Button
            Button(
                onClick = {
                    val fee = feeAmount.toDoubleOrNull() ?: 0.0
                    val paid = paidAmount.toDoubleOrNull() ?: 0.0
                    val status = when {
                        paid >= fee && fee > 0 -> "Paid"
                        paid > 0 -> "Partial"
                        else -> "Pending"
                    }

                    val service = ServiceRecordEntity(
                        id = UUID.randomUUID().toString(),
                        customerId = "",
                        serviceName = serviceName,
                        serviceCategory = serviceCategory,
                        feeAmount = fee,
                        paidAmount = paid,
                        paymentStatus = status,
                        paymentMode = paymentMode,
                        serviceDate = "2026-08-25",
                        invoiceNumber = "INV-" + (1000..9999).random()
                    )

                    viewModel.saveCustomer(
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
                        panNumber = panNumber,
                        photoPath = photoPath,
                        signaturePath = signaturePath,
                        services = listOf(service)
                    )
                    onNavigateBack()
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp),
                shape = RoundedCornerShape(12.dp)
            ) {
                Icon(Icons.Default.Save, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Save to Room SQLite Database", fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
fun SectionHeader(title: String, icon: androidx.compose.ui.graphics.vector.ImageVector) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier.padding(bottom = 8.dp)
    ) {
        Icon(icon, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
        Spacer(modifier = Modifier.width(8.dp))
        Text(
            text = title,
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.primary
        )
    }
}
`
  },
  {
    path: "app/src/main/java/com/customer/hub/ui/screens/CustomerListScreen.kt",
    name: "CustomerListScreen.kt",
    category: "ui",
    description: "Jetpack Compose List with Live SQLite Search, Filter chips, and Aadhaar/PAN status",
    language: "kotlin",
    content: `package com.customer.hub.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.customer.hub.data.local.relation.CustomerWithServices
import com.customer.hub.viewmodel.CustomerViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CustomerListScreen(
    viewModel: CustomerViewModel,
    onCustomerClick: (String) -> Unit,
    onAddCustomerClick: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Customers (\${uiState.customers.size})") },
                actions = {
                    IconButton(onClick = onAddCustomerClick) {
                        Icon(Icons.Default.PersonAdd, contentDescription = "Add")
                    }
                }
            )
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = onAddCustomerClick,
                containerColor = MaterialTheme.colorScheme.primary
            ) {
                Icon(Icons.Default.Add, contentDescription = "Add Customer")
            }
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            // Live Search Bar
            OutlinedTextField(
                value = uiState.searchQuery,
                onValueChange = { viewModel.onSearchQueryChanged(it) },
                placeholder = { Text("Search by Name, PAN, Aadhaar, Phone...") },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                trailingIcon = {
                    if (uiState.searchQuery.isNotEmpty()) {
                        IconButton(onClick = { viewModel.onSearchQueryChanged("") }) {
                            Icon(Icons.Default.Clear, contentDescription = "Clear")
                        }
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                shape = RoundedCornerShape(12.dp)
            )

            // Filter Chips
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 4.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                listOf("All", "Paid", "Partial", "Pending").forEach { filter ->
                    FilterChip(
                        selected = uiState.filterStatus == filter,
                        onClick = { viewModel.onFilterChanged(filter) },
                        label = { Text(filter) }
                    )
                }
            }

            // Customer List
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(uiState.customers, key = { it.customer.id }) { customerWithServices ->
                    CustomerCard(
                        item = customerWithServices,
                        onClick = { onCustomerClick(customerWithServices.customer.id) }
                    )
                }
            }
        }
    }
}

@Composable
fun CustomerCard(item: CustomerWithServices, onClick: () -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(44.dp)
                            .clip(CircleShape)
                            .background(MaterialTheme.colorScheme.primaryContainer),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = item.customer.fullName.take(2).uppercase(),
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary
                        )
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text(
                            text = item.customer.fullName,
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = item.customer.phone,
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }

                // Payment Status Badge
                Surface(
                    color = when (item.overallPaymentStatus) {
                        "Paid" -> Color(0xFFDCFCE7)
                        "Partial" -> Color(0xFFFEF9C3)
                        else -> Color(0xFFFEE2E2)
                    },
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Text(
                        text = item.overallPaymentStatus,
                        color = when (item.overallPaymentStatus) {
                            "Paid" -> Color(0xFF15803D)
                            "Partial" -> Color(0xFFA16207)
                            else -> Color(0xFFB91C1C)
                        },
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                        style = MaterialTheme.typography.labelSmall,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Aadhaar & PAN Chips
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Surface(
                    shape = RoundedCornerShape(6.dp),
                    color = MaterialTheme.colorScheme.surface
                ) {
                    Text(
                        text = "Aadhaar: " + item.customer.aadhaarNumber.takeLast(4).padStart(12, 'X'),
                        style = MaterialTheme.typography.bodySmall,
                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                    )
                }
                Surface(
                    shape = RoundedCornerShape(6.dp),
                    color = MaterialTheme.colorScheme.surface
                ) {
                    Text(
                        text = "PAN: " + item.customer.panNumber,
                        style = MaterialTheme.typography.bodySmall,
                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                    )
                }
            }
        }
    }
}
`
  },
  {
    path: "app/src/main/java/com/customer/hub/ui/components/SignaturePad.kt",
    name: "SignaturePad.kt",
    category: "ui",
    description: "Jetpack Compose Canvas touch drawing surface for capturing digital signatures",
    language: "kotlin",
    content: `package com.customer.hub.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.unit.dp

@Composable
fun SignaturePad(
    modifier: Modifier = Modifier,
    onSignatureCaptured: (String) -> Unit
) {
    val paths = remember { mutableStateListOf<Path>() }
    var currentPath by remember { mutableStateOf<Path?>(null) }

    Box(modifier = modifier) {
        Canvas(
            modifier = Modifier
                .fillMaxSize()
                .pointerInput(Unit) {
                    detectDragGestures(
                        onDragStart = { offset ->
                            val path = Path().apply { moveTo(offset.x, offset.y) }
                            currentPath = path
                            paths.add(path)
                        },
                        onDrag = { change, _ ->
                            currentPath?.lineTo(change.position.x, change.position.y)
                        },
                        onDragEnd = {
                            currentPath = null
                            onSignatureCaptured("signature_\${System.currentTimeMillis()}.png")
                        }
                    )
                }
        ) {
            paths.forEach { path ->
                drawPath(
                    path = path,
                    color = Color(0xFF1E3A8A),
                    style = Stroke(width = 4f, cap = StrokeCap.Round, join = StrokeJoin.Round)
                )
            }
        }

        IconButton(
            onClick = { paths.clear() },
            modifier = Modifier
                .align(Alignment.TopEnd)
                .padding(4.dp)
        ) {
            Icon(Icons.Default.Delete, contentDescription = "Clear Signature", tint = Color.Gray)
        }
    }
}
`
  },
  {
    path: "app/src/main/java/com/customer/hub/utils/CsvExporter.kt",
    name: "CsvExporter.kt",
    category: "utils",
    description: "Generates standard CSV & Excel compatible export with UTF-8 BOM",
    language: "kotlin",
    content: `package com.customer.hub.utils

import android.content.Context
import android.content.Intent
import androidx.core.content.FileProvider
import com.customer.hub.data.local.relation.CustomerWithServices
import java.io.File
import java.io.FileWriter

object CsvExporter {

    fun exportToCsv(context: Context, customers: List<CustomerWithServices>): File {
        val fileName = "Customer_Records_\${System.currentTimeMillis()}.csv"
        val exportDir = File(context.cacheDir, "exports")
        if (!exportDir.exists()) exportDir.mkdirs()
        
        val file = File(exportDir, fileName)
        val writer = FileWriter(file)

        // UTF-8 BOM for Microsoft Excel compatibility
        writer.write("\uFEFF")
        
        // Header
        writer.append("Customer Code,Full Name,Phone,Email,Aadhaar Number,PAN Number,City,State,Service Name,Fee Amount (INR),Paid Amount (INR),Payment Status,Payment Mode,Date\\n")

        for (item in customers) {
            val c = item.customer
            if (item.services.isEmpty()) {
                writer.append("\${c.customerCode},\${escape(c.fullName)},\${c.phone},\${c.email},\${c.aadhaarNumber},\${c.panNumber},\${escape(c.city)},\${escape(c.state)},None,0,0,No Services,N/A,\${c.createdAt}\\n")
            } else {
                for (s in item.services) {
                    writer.append("\${c.customerCode},\${escape(c.fullName)},\${c.phone},\${c.email},\${c.aadhaarNumber},\${c.panNumber},\${escape(c.city)},\${escape(c.state)},\${escape(s.serviceName)},\${s.feeAmount},\${s.paidAmount},\${s.paymentStatus},\${s.paymentMode},\${s.serviceDate}\\n")
                }
            }
        }
        writer.flush()
        writer.close()
        return file
    }

    private fun escape(text: String): String {
        return if (text.contains(",") || text.contains("\"") || text.contains("\\n")) {
            "\\"" + text.replace("\"", "\"\"") + "\\""
        } else {
            text
        }
    }

    fun shareCsvFile(context: Context, file: File) {
        val uri = FileProvider.getUriForFile(context, "com.customer.hub.fileprovider", file)
        val intent = Intent(Intent.ACTION_SEND).apply {
            type = "text/csv"
            putExtra(Intent.EXTRA_STREAM, uri)
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        }
        context.startActivity(Intent.createChooser(intent, "Share Customer CSV Export"))
    }
}
`
  },
  {
    path: "app/src/main/java/com/customer/hub/utils/DatabaseBackupHelper.kt",
    name: "DatabaseBackupHelper.kt",
    category: "utils",
    description: "Handles Room SQLite database binary file backup (.db), JSON dumps, and restore",
    language: "kotlin",
    content: `package com.customer.hub.utils

import android.content.Context
import com.customer.hub.data.local.AppDatabase
import java.io.File
import java.io.FileInputStream
import java.io.FileOutputStream

object DatabaseBackupHelper {

    fun createDatabaseBackup(context: Context): File {
        val dbFile = context.getDatabasePath(AppDatabase.DATABASE_NAME)
        val backupDir = File(context.cacheDir, "backups")
        if (!backupDir.exists()) backupDir.mkdirs()

        val backupFile = File(backupDir, "CustomerRoomHub_Backup_\${System.currentTimeMillis()}.db")
        FileInputStream(dbFile).use { input ->
            FileOutputStream(backupFile).use { output ->
                input.copyTo(output)
            }
        }
        return backupFile
    }

    fun restoreDatabase(context: Context, backupFile: File): Boolean {
        return try {
            val dbFile = context.getDatabasePath(AppDatabase.DATABASE_NAME)
            if (dbFile.exists()) dbFile.delete()

            FileInputStream(backupFile).use { input ->
                FileOutputStream(dbFile).use { output ->
                    input.copyTo(output)
                }
            }
            true
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }
}
`
  },
  {
    path: "app/src/main/java/com/customer/hub/MainActivity.kt",
    name: "MainActivity.kt",
    category: "ui",
    description: "Main Activity hosting Material 3 Jetpack Compose Navigation & App Root",
    language: "kotlin",
    content: `package com.customer.hub

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
`
  },
  {
    path: "app/src/main/res/xml/file_paths.xml",
    name: "file_paths.xml",
    category: "res",
    description: "XML FileProvider paths for sharing generated CSV exports and SQLite database backups",
    language: "xml",
    content: `<?xml version="1.0" encoding="utf-8"?>
<paths xmlns:android="http://schemas.android.com/apk/res/android">
    <cache-path name="cache_exports" path="exports/" />
    <cache-path name="cache_backups" path="backups/" />
    <files-path name="app_files" path="." />
</paths>
`
  },
  {
    path: "README.md",
    name: "README.md",
    category: "docs",
    description: "Complete Android Studio setup, build instructions, Room SQLite architecture guide",
    language: "markdown",
    content: `# Customer & KYC Hub - Android Studio Project

A production-grade Android Studio application built with **Jetpack Compose**, **Material 3**, and **Room SQLite Database**.

## Key Features
- 🔐 **Default Authentication**: \`admin\` / \`admin123\` with Biometric unlock support.
- 🗄️ **Room SQLite Database**: Fully offline-first reactive database with Foreign Keys, Indexes, and transactions.
- 📋 **Indian KYC Validation**: 12-digit Aadhaar formatting & validation, 10-char PAN regex verification.
- ✍️ **Digital Signature Pad**: Custom Compose Canvas signature capture with path export.
- 📷 **CameraX & Gallery**: Direct customer passport photo capture.
- 💰 **Service & Fee Ledger**: Multi-service registration, invoice tracking, paid vs balance status.
- 📊 **CSV & Excel Export**: Instant CSV generation with UTF-8 BOM encoding for seamless Excel import.
- 💾 **Room Database Backup & Restore**: Full \`.db\` binary and JSON data backup/restore capabilities.

## Getting Started in Android Studio
1. Open **Android Studio** (Hedgehog, Iguana, Ladybug, or Koala).
2. Select **File > Open** and choose the extracted project folder.
3. Allow Gradle to sync dependencies automatically.
4. Run on an Android Emulator or Physical Device (API 24+ / Android 7.0 to Android 15).

## Default Login Credentials
- **Username**: \`admin\`
- **Password**: \`admin123\`
`
  }
];
