# Customer & KYC Hub - Android Studio Project

A production-grade Android Studio application built with **Jetpack Compose**, **Material 3**, and **Room SQLite Database**.

## Key Features
- 🔐 **Default Authentication**: `admin` / `admin123` with Biometric unlock support.
- 🗄️ **Room SQLite Database**: Fully offline-first reactive database with Foreign Keys, Indexes, and transactions.
- 📋 **Indian KYC Validation**: 12-digit Aadhaar formatting & validation, 10-char PAN regex verification.
- ✍️ **Digital Signature Pad**: Custom Compose Canvas signature capture with path export.
- 📷 **CameraX & Gallery**: Direct customer passport photo capture.
- 💰 **Service & Fee Ledger**: Multi-service registration, invoice tracking, paid vs balance status.
- 📊 **CSV & Excel Export**: Instant CSV generation with UTF-8 BOM encoding for seamless Excel import.
- 💾 **Room Database Backup & Restore**: Full `.db` binary and JSON data backup/restore capabilities.

## Getting Started in Android Studio
1. Open **Android Studio** (Hedgehog, Iguana, Ladybug, or Koala).
2. Select **File > Open** and choose the extracted project folder.
3. Allow Gradle to sync dependencies automatically.
4. Run on an Android Emulator or Physical Device (API 24+ / Android 7.0 to Android 15).

## Default Login Credentials
- **Username**: `admin`
- **Password**: `admin123`
