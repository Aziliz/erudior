package com.erudior.files

import android.app.Activity
import android.content.Intent
import androidx.activity.result.ActivityResult
import app.tauri.annotation.ActivityCallback
import app.tauri.annotation.Command
import app.tauri.annotation.InvokeArg
import app.tauri.annotation.TauriPlugin
import app.tauri.plugin.Invoke
import app.tauri.plugin.JSObject
import app.tauri.plugin.Plugin
import java.io.ByteArrayOutputStream
import java.io.InputStream
import java.nio.ByteBuffer
import java.nio.charset.CodingErrorAction
import java.util.concurrent.atomic.AtomicBoolean

@InvokeArg
class ExportCourseArgs {
    lateinit var content: String
    lateinit var name: String
}

/** SAF grants access only to the document chosen in this operation. No URI IPC,
 * persistent grants, filesystem permissions, network downloads, or private data. */
@TauriPlugin
class PortableFilesPlugin(private val activity: Activity) : Plugin(activity) {
    private val busy = AtomicBoolean(false)
    private val maxBytes = 24 * 1024 * 1024
    private var pendingBytes: ByteArray? = null

    // InputStream.readNBytes requires Android API 33; retain the app's older-device support.
    private fun readBounded(input: InputStream): ByteArray {
        val output = ByteArrayOutputStream()
        val buffer = ByteArray(8192)
        while (output.size() <= maxBytes) {
            val count = input.read(buffer, 0, minOf(buffer.size, maxBytes + 1 - output.size()))
            if (count < 0) break
            if (count == 0) {
                val byte = input.read()
                if (byte < 0) break
                output.write(byte)
            } else output.write(buffer, 0, count)
        }
        return output.toByteArray()
    }

    private fun begin(invoke: Invoke): Boolean {
        if (!busy.compareAndSet(false, true)) {
            invoke.reject("A course file transfer is already open")
            return false
        }
        return true
    }
    private fun fail(invoke: Invoke, message: String) {
        pendingBytes = null
        busy.set(false)
        invoke.reject(message)
    }
    private fun finish(invoke: Invoke, result: JSObject) {
        pendingBytes = null
        busy.set(false)
        invoke.resolve(result)
    }
    @Command
    fun pickCourse(invoke: Invoke) {
        if (!begin(invoke)) return
        try {
            val intent = Intent(Intent.ACTION_OPEN_DOCUMENT).apply {
                addCategory(Intent.CATEGORY_OPENABLE)
                type = "*/*"
                putExtra(Intent.EXTRA_MIME_TYPES, arrayOf("application/json", "text/plain", "application/octet-stream"))
                putExtra(Intent.EXTRA_ALLOW_MULTIPLE, false)
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            }
            startActivityForResult(invoke, intent, "pickedCourse")
        } catch (_: Exception) { fail(invoke, "Cannot open course file picker") }
    }
    @ActivityCallback
    fun pickedCourse(invoke: Invoke, result: ActivityResult) {
        if (result.resultCode == Activity.RESULT_CANCELED) {
            finish(invoke, JSObject().apply { put("cancelled", true) }); return
        }
        val uri = result.data?.data
        if (result.resultCode != Activity.RESULT_OK || uri?.scheme != "content") {
            fail(invoke, "No readable course document selected"); return
        }
        Thread {
            try {
                // The bound applies to actual bytes read, never provider metadata.
                val bytes = activity.contentResolver.openInputStream(uri)?.use { readBounded(it) }
                    ?: throw IllegalArgumentException("Cannot open course document")
                require(bytes.isNotEmpty()) { "Course file is empty" }
                require(bytes.size <= maxBytes) { "Course file exceeds 24 MiB" }
                val text = Charsets.UTF_8.newDecoder().onMalformedInput(CodingErrorAction.REPORT)
                    .onUnmappableCharacter(CodingErrorAction.REPORT).decode(ByteBuffer.wrap(bytes)).toString()
                finish(invoke, JSObject().apply { put("content", text) })
            } catch (_: java.nio.charset.CharacterCodingException) {
                fail(invoke, "Course file must be UTF-8")
            } catch (error: Exception) {
                fail(invoke, error.message ?: "Cannot read selected course file")
            }
        }.start()
    }
    @Command
    fun exportCourse(invoke: Invoke) {
        if (!begin(invoke)) return
        try {
            val args = invoke.parseArgs(ExportCourseArgs::class.java)
            val bytes = args.content.toByteArray(Charsets.UTF_8)
            require(bytes.isNotEmpty()) { "Course file is empty" }
            require(bytes.size <= maxBytes) { "Course file exceeds 24 MiB" }
            // Default name only, never a location; the system picker chooses destination.
            val name = args.name.removeSuffix(".json").filter { it.isLetterOrDigit() && it.code < 128 || it == '-' || it == '_' }.take(80).ifEmpty { "course" } + ".json"
            pendingBytes = bytes
            val intent = Intent(Intent.ACTION_CREATE_DOCUMENT).apply {
                addCategory(Intent.CATEGORY_OPENABLE)
                type = "application/json"
                putExtra(Intent.EXTRA_TITLE, name)
                addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION)
            }
            startActivityForResult(invoke, intent, "exportedCourse")
        } catch (error: Exception) { fail(invoke, error.message ?: "Cannot open course export picker") }
    }
    @ActivityCallback
    fun exportedCourse(invoke: Invoke, result: ActivityResult) {
        if (result.resultCode == Activity.RESULT_CANCELED) {
            finish(invoke, JSObject().apply { put("cancelled", true) }); return
        }
        val uri = result.data?.data
        val bytes = pendingBytes
        if (result.resultCode != Activity.RESULT_OK || uri?.scheme != "content" || bytes == null) {
            fail(invoke, "No writable course document selected"); return
        }
        Thread {
            try {
                activity.contentResolver.openOutputStream(uri, "wt")?.use { it.write(bytes); it.flush() }
                    ?: throw IllegalArgumentException("Cannot open export document")
                finish(invoke, JSObject().apply { put("saved", true) })
            } catch (_: Exception) {
                // A failing provider may leave a partial document. Never report success.
                fail(invoke, "Could not finish export; remove any incomplete file and retry")
            }
        }.start()
    }
}
