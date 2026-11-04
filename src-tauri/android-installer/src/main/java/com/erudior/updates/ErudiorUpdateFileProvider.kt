package com.erudior.updates

import androidx.core.content.FileProvider

/** Separate Android component identity from Tauri's general-purpose FileProvider. */
class ErudiorUpdateFileProvider : FileProvider()
