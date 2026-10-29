package com.erudior.updates

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import androidx.core.content.FileProvider
import app.tauri.annotation.Command
import app.tauri.annotation.TauriPlugin
import app.tauri.plugin.Invoke
import app.tauri.plugin.JSObject
import app.tauri.plugin.Plugin
import java.io.File

/**
 * An Android-only installer entry point. The Rust updater owns download, hash
 * verification and staging. This plugin accepts no remote URL or arbitrary path.
 */
@TauriPlugin
class InstallerPlugin(private val activity: Activity) : Plugin(activity) {
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
