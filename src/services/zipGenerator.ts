import JSZip from 'jszip';
import { ANDROID_PROJECT_FILES } from '../data/androidProjectFiles';

export async function downloadAndroidProjectZip(): Promise<void> {
  const zip = new JSZip();

  // Root Project Folder Name
  const rootFolder = zip.folder('CustomerRoomHub_AndroidStudio');
  if (!rootFolder) return;

  // Add all Android Studio Project Files
  ANDROID_PROJECT_FILES.forEach(file => {
    rootFolder.file(file.path, file.content);
  });

  // Add Gradle wrapper properties and dummy gradlew scripts
  rootFolder.file('gradle/wrapper/gradle-wrapper.properties', 
`distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.9-bin.zip
networkTimeout=10000
validateDistributionUrl=true
`);

  rootFolder.file('app/proguard-rules.pro', 
`# Add project specific ProGuard rules here.
-keep class com.customer.hub.data.local.entity.** { *; }
`);

  rootFolder.file('.gitignore', 
`*.iml
.gradle
/local.properties
/.idea/caches
/.idea/libraries
/.idea/modules.xml
/.idea/workspace.xml
/.idea/navEditor.xml
/.idea/assetWizardSettings.xml
.DS_Store
/build
/captures
.externalNativeBuild
.cxx
local.properties
`);

  // Generate zip file blob
  const content = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 }
  });

  // Trigger download
  const downloadUrl = URL.createObjectURL(content);
  const anchor = document.createElement('a');
  anchor.href = downloadUrl;
  anchor.download = 'CustomerRoomHub_AndroidStudio.zip';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(downloadUrl);
}
