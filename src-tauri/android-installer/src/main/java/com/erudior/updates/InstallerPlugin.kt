package com.erudior.updates

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import androidx.core.content.FileProvider
import app.tauri.annotation.Command
import app.tauri.annotation.InvokeArg
import app.tauri.annotation.TauriPlugin
import app.tauri.plugin.Invoke
import app.tauri.plugin.JSObject
import app.tauri.plugin.Plugin
import java.io.File
import java.security.MessageDigest
import java.net.HttpURLConnection
import java.net.URL

/**
 * An Android-only installer entry point. The Rust updater owns download, hash
 * verification and staging. This plugin accepts no remote URL or arbitrary path.
 */
@InvokeArg
internal class VerifiedApkArgs {
    lateinit var expectedSha256: String
}

@TauriPlugin
class InstallerPlugin(private val activity: Activity) : Plugin(activity) {
    @Command
    fun fetchReleaseManifest(invoke: Invoke) {
        Thread {
            try {
                val url = URL("https://github.com/Aziliz/erudior/releases/download/android-preview/android-update.json")
                val conn = url.openConnection() as HttpURLConnection
                conn.connectTimeout = 10000
                conn.readTimeout = 15000
                conn.instanceFollowRedirects = true
                val body = conn.inputStream.use { it.readNBytes(16385) }
                if (conn.url.protocol != "https") throw IllegalStateException("Manifest redirect is not HTTPS")
                if (body.size > 16384 || conn.responseCode != 200) throw IllegalStateException("Invalid release metadata")
                val result = JSObject()
                result.put("json", String(body, Charsets.UTF_8))
                invoke.resolve(result)
            } catch (error: Exception) {
                invoke.reject("Android update metadata request failed: " + error.message)
            }
        }.start()
    }

    @InvokeArg
    class DownloadArgs {
        lateinit var expectedSha256: String
        var bytes: Long = 0
    }

    @Command
    fun downloadVerifiedApk(invoke: Invoke) {
        Thread {
            val target = File(activity.cacheDir, "updates/verified-update.apk")
            val temporary = File(activity.cacheDir, "updates/verified-update.part")
            try {
                val args = invoke.parseArgs(DownloadArgs::class.java)
                if (!Regex("^[a-fA-F0-9]{64}$").matches(args.expectedSha256) ||
                    args.bytes <= 0L || args.bytes > 41943040L) {
                    throw IllegalArgumentException("Invalid Android update parameters")
                }
                target.parentFile?.mkdirs()
                val url = URL("https://github.com/Aziliz/erudior/releases/download/android-preview/Erudior-Android-arm64.apk")
                val conn = url.openConnection() as HttpURLConnection
                conn.connectTimeout = 15000
                conn.readTimeout = 90000
                val hash = MessageDigest.getInstance("SHA-256")
                var received = 0L
                conn.inputStream.use { input ->
                    temporary.outputStream().use { output ->
                        val buf = ByteArray(64 * 1024)
                        while (true) {
                            val count = input.read(buf)
                            if (count < 0) break
                            received += count
                            if (received > args.bytes) throw IllegalStateException("APK exceeds manifest size")
                            hash.update(buf, 0, count)
                            output.write(buf, 0, count)
                        }
                    }
                }
                if (conn.responseCode != 200 || received != args.bytes) throw IllegalStateException("APK download incomplete")
                val actual = hash.digest().joinToString("") { "%02x".format(it) }
                if (!actual.equals(args.expectedSha256, ignoreCase = true)) throw IllegalStateException("APK checksum mismatch")
                // GitHub may redirect to its CDN, but never allow a downgrade to HTTP.
                if (conn.url.protocol != "https") throw IllegalStateException("APK redirect is not HTTPS")
                temporary.inputStream().use { stream ->
                    val magic = ByteArray(4)
                    if (stream.read(magic) != 4 || !magic.contentEquals(byteArrayOf(0x50, 0x4b, 0x03, 0x04))) {
                        throw IllegalStateException("Downloaded APK is not a ZIP archive")
                    }
                }
                if (target.exists() && !target.delete()) throw IllegalStateException("Cannot replace previous staged APK")
                if (!temporary.renameTo(target)) throw IllegalStateException("Cannot stage verified APK")
                val result = JSObject()
                result.put("sha256", actual)
                invoke.resolve(result)
            } catch (error: Exception) {
                temporary.delete()
                invoke.reject("Android APK download failed: " + error.message)
            }
        }.start()
    }

    @Command
    fun installVerifiedApk(invoke: Invoke) {
        val staged = File(activity.cacheDir, "updates/verified-update.apk")
        val cacheRoot = activity.cacheDir.canonicalFile
        val canonical = staged.canonicalFile
        if (!canonical.path.startsWith(cacheRoot.path + File.separator) ||
            !canonical.isFile || canonical.length() <= 0L) {
            invoke.reject("Verified APK was not staged in the private cache")
            return
        }

        // Recheck the bytes at the final handoff, not just at Rust staging time.
        // The expected digest is recomputed from the staged file by the Rust command.
        val expected = invoke.parseArgs(VerifiedApkArgs::class.java).expectedSha256
        if (!Regex("^[a-fA-F0-9]{64}$").matches(expected)) {
            invoke.reject("Invalid staged APK checksum")
            return
        }
        val digest = MessageDigest.getInstance("SHA-256")
        canonical.inputStream().use { stream ->
            val buffer = ByteArray(64 * 1024)
            while (true) {
                val count = stream.read(buffer)
                if (count < 0) break
                digest.update(buffer, 0, count)
            }
        }
        val actual = digest.digest().joinToString("") { "%02x".format(it) }
        if (!actual.equals(expected, ignoreCase = true)) {
            invoke.reject("Staged APK changed since verification")
            return
        }

        // Android enforces matching signatures on upgrade; reject mismatches
        // ourselves before showing an installer prompt.
        @Suppress("DEPRECATION")
        val archive = activity.packageManager.getPackageArchiveInfo(
            canonical.absolutePath,
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P)
                android.content.pm.PackageManager.GET_SIGNING_CERTIFICATES
            else android.content.pm.PackageManager.GET_SIGNATURES
        )
        if (archive == null || archive.packageName != activity.packageName) {
            invoke.reject("Update APK package identity does not match Erudior")
            return
        }
        @Suppress("DEPRECATION")
        val installed = activity.packageManager.getPackageInfo(
            activity.packageName,
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P)
                android.content.pm.PackageManager.GET_SIGNING_CERTIFICATES
            else android.content.pm.PackageManager.GET_SIGNATURES
        )
        @Suppress("DEPRECATION")
        val archiveSignatures = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P)
            archive.signingInfo?.apkContentsSigners?.map { it.toCharsString() }?.toSet()
            else archive.signatures?.map { it.toCharsString() }?.toSet()
        @Suppress("DEPRECATION")
        val installedSignatures = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P)
            installed.signingInfo?.apkContentsSigners?.map { it.toCharsString() }?.toSet()
            else installed.signatures?.map { it.toCharsString() }?.toSet()
        // Android rejects versionCode downgrades; fail before prompting the user.
        @Suppress("DEPRECATION")
        val incomingCode = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P)
            archive.longVersionCode else archive.versionCode.toLong()
        @Suppress("DEPRECATION")
        val currentCode = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P)
            installed.longVersionCode else installed.versionCode.toLong()
        if (incomingCode < currentCode) {
            invoke.reject("Update APK is older than the installed version")
            return
        }
        if (archiveSignatures.isNullOrEmpty() || archiveSignatures != installedSignatures) {
            invoke.reject("Update APK signing certificate does not match installed Erudior")
            return
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O &&
            !activity.packageManager.canRequestPackageInstalls()) {
            val settingsIntent = Intent(
                Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                Uri.parse("package:" + activity.packageName)
            )
            activity.startActivity(settingsIntent)
            invoke.reject("Allow installation from Erudior in Android Settings, then retry")
            return
        }

        try {
            val uri = FileProvider.getUriForFile(
                activity,
                activity.packageName + ".erudior-updates",
                canonical
            )
            val intent = Intent(Intent.ACTION_VIEW).apply {
                setDataAndType(uri, "application/vnd.android.package-archive")
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            }
            activity.startActivity(intent)
            val response = JSObject()
            response.put("installerLaunched", true)
            invoke.resolve(response)
        } catch (error: Exception) {
            invoke.reject("Could not open Android system installer: " + error.message)
        }
    }
}
