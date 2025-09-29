//
//  RCTDatazoomManager.swift
//  react-native-video
//
//  Created by React Native Video
//

import Foundation
import React
import AVFoundation

#if USE_DZ_ADPATERS
import DzAVPlayerAdapter
import DzBase
#endif

@objc(RCTDatazoomManager)
class RCTDatazoomManager: NSObject, RCTBridgeModule {
    
    private var dzAdapter: DzAdapter? = nil

    static func moduleName() -> String! {
        return "DatazoomManager"
    }
    
    static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    func methodQueue() -> DispatchQueue {
        return bridge.uiManager.methodQueue
    }
    
    @objc var bridge: RCTBridge!
    
    // MARK: - Utility Methods
    
    private func performOnVideoView(withReactTag reactTag: NSNumber, callback: @escaping (RCTVideo?) -> Void) {
        DispatchQueue.main.async { [weak self] in
            guard let self = self else {
                callback(nil)
                return
            }

            let view = self.bridge.uiManager.view(forReactTag: reactTag)

            guard let videoView = view as? RCTVideo else {
                print("❌ DatazoomManager: Invalid view returned from registry, expecting RCTVideo, got: \(String(describing: view))")
                callback(nil)
                return
            }

            callback(videoView)
        }
    }
    
    // MARK: - Datazoom Methods
    
#if USE_DZ_ADPATERS
    @objc(initDatazoom:)
    func initDatazoom(_ settings: [String: Any]) {
        let configId = settings["configId"] as? String ?? "default-config-id"
        let isProduction = settings["isProduction"] as? Bool ?? false
        let logLevelString = settings["logLevel"] as? String ?? "info"
        
        // Convert string logLevel to DzAVPlayerAdapter log level
        let logLevel: LogLevel = {
            switch logLevelString.lowercased() {
            case "verbose": return .verbose
            case "debug": return .debug
            case "warning": return .warning
            case "info": return .info
            case "off": return .off
            default: return .info
            }
        }()
        
        print("🎯 Initializing Datazoom with settings:")
        print("   - configId: \(configId)")
        print("   - logLevel: \(logLevelString)")
        print("   - isProduction: \(isProduction)")
        
        let configBuilder = Config.Builder(configurationId: configId)
        configBuilder.logLevel(logLevel: logLevel)
        configBuilder.isProduction(isProduction: isProduction)
    
        Datazoom.shared.doInit(config: configBuilder.build())
        
        Datazoom.shared.sdkEvents.watch { event in
            guard let eventDescription = event?.description as? String else { return }
            if eventDescription.contains("SdkInit") {
                debugPrint("✅ DZ initialized successfully with settings")
            }
        }   
    }
    
    @objc(startDatazoom:)
    func startDatazoom(_ reactTag: NSNumber) {
      
      DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
        debugPrint("DZ Start Called")
        self.performOnVideoView(withReactTag: reactTag) { videoView in
          // Start Datazoom data collection
          
          if let player = videoView?.getAVPlayerInstance() {
            debugPrint("DZ Context Called")
            self.dzAdapter = Datazoom.shared.createContext(player: player)
            print("▶️ Datazoom started for video with tag \(reactTag)")
          } else {
            print("❌ Could not start Datazoom - player not found")
          }
        }
      }
    }
    
    @objc(stopDatazoom:)
    func stopDatazoom(_ reactTag: NSNumber) {
        performOnVideoView(withReactTag: reactTag) { videoView in
            // Stop Datazoom data collection
            // TODO: Find the correct method to stop/destroy DzAdapter
            // self.dzAdapter?.close()  // This method doesn't exist
            self.dzAdapter = nil  // For now, just set to nil to release the adapter
            print("⏹️ Datazoom stopped for video with tag \(reactTag)")
        }
    }
#else
    @objc(initDatazoom:)
    func initDatazoom(_ settings: [String: Any]) {
        print("🎯 Datazoom not available - USE_DZ_ADPATERS not defined")
        print("   Settings received: \(settings)")
    }
    
    @objc(startDatazoom:)
    func startDatazoom(_ reactTag: NSNumber) {
        print("▶️ Datazoom not available - USE_DZ_ADPATERS not defined")
    }
    
    @objc(stopDatazoom:)
    func stopDatazoom(_ reactTag: NSNumber) {
        print("⏹️ Datazoom not available - USE_DZ_ADPATERS not defined")
    }
#endif
}
