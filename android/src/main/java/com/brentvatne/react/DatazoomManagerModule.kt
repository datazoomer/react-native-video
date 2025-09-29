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
     * Initialize Datazoom analytics system
     */
    @ReactMethod
    fun initDatazoom(reactTag: Int) {
        try {
            performOnPlayerView(reactTag) { playerView ->
                if (playerView != null) {
                    // TODO: Implement Datazoom initialization
                    // This is where you would integrate with the Android Datazoom SDK
                    Log.d(TAG, "🎯 Datazoom initialized for video with tag $reactTag")
                } else {
                    Log.e(TAG, "❌ Could not initialize Datazoom - VideoPlayer not found")
                }
            }
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

    /**
     * Set custom Datazoom configuration
     */
    @ReactMethod
    fun setDatazoomConfig(reactTag: Int, config: ReadableMap) {
        try {
            performOnPlayerView(reactTag) { playerView ->
                if (playerView != null) {
                    // TODO: Implement Datazoom configuration
                    Log.d(TAG, "⚙️ Datazoom config set for video with tag $reactTag: $config")
                } else {
                    Log.e(TAG, "❌ Could not set Datazoom config - VideoPlayer not found")
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error setting Datazoom config: ${e.message}")
        }
    }

    /**
     * Test method to verify DatazoomManager module is working
     */
    @ReactMethod
    fun testDatazoomModule(promise: Promise) {
        try {
            val result: WritableMap = WritableNativeMap()
            result.putBoolean("success", true)
            result.putString("message", "DatazoomManager module is working!")
            promise.resolve(result)
            Log.d(TAG, "✅ DatazoomManager test successful")
        } catch (e: Exception) {
            Log.e(TAG, "❌ DatazoomManager test failed: ${e.message}")
            promise.reject("TEST_ERROR", "DatazoomManager test failed: ${e.message}")
        }
    }

    /**
     * Get current Datazoom status
     */
    @ReactMethod
    fun getDatazoomStatus(reactTag: Int, promise: Promise) {
        try {
            performOnPlayerView(reactTag) { playerView ->
                if (playerView != null) {
                    // TODO: Implement actual status retrieval from Datazoom SDK
                    val status: WritableMap = WritableNativeMap().apply {
                        putBoolean("isActive", true) // This should come from actual Datazoom status
                        putString("sessionId", "sample-android-session-id") // This should come from Datazoom
                    }
                    promise.resolve(status)
                } else {
                    val errorStatus: WritableMap = WritableNativeMap().apply {
                        putBoolean("isActive", false)
                        putString("error", "VideoPlayer not found")
                    }
                    promise.resolve(errorStatus)
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error getting Datazoom status: ${e.message}")
            promise.reject("DATAZOOM_ERROR", "Failed to get Datazoom status: ${e.message}")
        }
    }
}
