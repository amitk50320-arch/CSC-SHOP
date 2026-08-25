package com.customer.hub.utils

import android.content.Context
import android.content.Intent
import androidx.core.content.FileProvider
import com.customer.hub.data.local.relation.CustomerWithServices
import java.io.File
import java.io.FileWriter

object CsvExporter {

    fun exportToCsv(context: Context, customers: List<CustomerWithServices>): File {
        val fileName = "Customer_Records_${System.currentTimeMillis()}.csv"
        val exportDir = File(context.cacheDir, "exports")
        if (!exportDir.exists()) exportDir.mkdirs()

        val file = File(exportDir, fileName)
        val writer = FileWriter(file)

        // UTF-8 BOM for Microsoft Excel compatibility
        writer.write("\uFEFF")

        // Header
        writer.append("Customer Code,Full Name,Phone,Email,Aadhaar Number,PAN Number,City,State,Service Name,Fee Amount (INR),Paid Amount (INR),Payment Status,Payment Mode,Date\n")

        for (item in customers) {
            val c = item.customer
            if (item.services.isEmpty()) {
                writer.append("${c.customerCode},${escape(c.fullName)},${c.phone},${c.email},${c.aadhaarNumber},${c.panNumber},${escape(c.city)},${escape(c.state)},None,0,0,No Services,N/A,${c.createdAt}\n")
            } else {
                for (s in item.services) {
                    writer.append("${c.customerCode},${escape(c.fullName)},${c.phone},${c.email},${c.aadhaarNumber},${c.panNumber},${escape(c.city)},${escape(c.state)},${escape(s.serviceName)},${s.feeAmount},${s.paidAmount},${s.paymentStatus},${s.paymentMode},${s.serviceDate}\n")
                }
            }
        }
        writer.flush()
        writer.close()
        return file
    }

    private fun escape(text: String): String {
        return if (text.contains(",") || text.contains("\"") || text.contains("\n")) {
            "\"" + text.replace("\"", "\"\"") + "\""
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
