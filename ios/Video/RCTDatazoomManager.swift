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
    @objc(initDatazoom)
    func initDatazoom() {
        let configBuilder = Config.Builder(configurationId: "f4864053-3ed0-4b94-bc19-1d130d624704")
        configBuilder.logLevel(logLevel: .verbose)
        configBuilder.isProduction(isProduction: true)
    
        Datazoom.shared.doInit(config: configBuilder.build())
        debugPrint("DZ initalized Called")
         Datazoom.shared.sdkEvents.watch {  event in
          guard let eventDescription = event?.description as? String else { return }
          if eventDescription.contains("SdkInit") {
            debugPrint("DZ initalized successfully")
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
    @objc(initDatazoom)
    func initDatazoom() {
        print("🎯 Datazoom not available - USE_DZ_ADPATERS not defined")
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
