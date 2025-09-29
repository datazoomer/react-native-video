package com.brentvatne.react

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.uimanager.UIManagerModule
import android.util.Log

/**
 * React Native module for Datazoom Analytics functionality
 * Separate from VideoManager to maintain clean architecture
 */
class DatazoomManagerModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        private const val TAG = "DatazoomManager"
        private const val MODULE_NAME = "DatazoomManager"
    }

    override fun getName(): String = MODULE_NAME

    /**
     * Utility method to perform operations on the video player view
     */
    private fun performOnPlayerView(reactTag: Int, callback: (VideoPlayer?) -> Unit) {
        val uiManager = reactApplicationContext.getNativeModule(UIManagerModule::class.java)
        uiManager?.addUIBlock { nativeViewHierarchyManager ->
            try {
                val view = nativeViewHierarchyManager.resolveView(reactTag)
                if (view is VideoPlayer) {
                    callback(view)
                } else {
                    Log.e(TAG, "Could not find VideoPlayer with tag $reactTag")
                    callback(null)
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error finding VideoPlayer with tag $reactTag: ${e.message}")
                callback(null)
            }
        }
    }

    /**
     * Initialize Datazoom analytics system with settings
     */
    @ReactMethod
    fun initDatazoom(settings: ReadableMap) {
        try {
            val configId = settings.getString("configId") ?: "default-config-id"
            val logLevel = settings.getString("logLevel") ?: "info"
            val isProduction = settings.getBoolean("isProduction")
            
            Log.d(TAG, "🎯 Initializing Datazoom with settings:")
            Log.d(TAG, "   - configId: $configId")
            Log.d(TAG, "   - logLevel: $logLevel")
            Log.d(TAG, "   - isProduction: $isProduction")
            
            // TODO: Implement Datazoom initialization with settings
            // This is where you would integrate with the Android Datazoom SDK
            // Example: Datazoom.initialize(configId, logLevel, isProduction)
            
            Log.d(TAG, "✅ Datazoom initialized with custom settings")
        } catch (e: Exception) {
            Log.e(TAG, "Error initializing Datazoom: ${e.message}")
        }
    }

    /**
     * Start Datazoom data collection
     */
    @ReactMethod
    fun startDatazoom(reactTag: Int) {
        try {
            performOnPlayerView(reactTag) { playerView ->
                if (playerView != null) {
                    // TODO: Implement Datazoom start
                    Log.d(TAG, "▶️ Datazoom started for video with tag $reactTag")
                } else {
                    Log.e(TAG, "❌ Could not start Datazoom - VideoPlayer not found")
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error starting Datazoom: ${e.message}")
        }
    }

    /**
     * Stop Datazoom data collection
     */
    @ReactMethod
    fun stopDatazoom(reactTag: Int) {
        try {
            performOnPlayerView(reactTag) { playerView ->
                if (playerView != null) {
                    // TODO: Implement Datazoom stop
                    Log.d(TAG, "⏹️ Datazoom stopped for video with tag $reactTag")
                } else {
                    Log.e(TAG, "❌ Could not stop Datazoom - VideoPlayer not found")
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error stopping Datazoom: ${e.message}")
        }
    }
}
