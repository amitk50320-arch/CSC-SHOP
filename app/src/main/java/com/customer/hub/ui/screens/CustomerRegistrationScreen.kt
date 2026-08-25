package com.customer.hub.ui.screens

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
