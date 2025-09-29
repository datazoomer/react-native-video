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
    func initDatazoom(_ reactTag: NSNumber) {
        performOnVideoView(withReactTag: reactTag, callback: { [weak self] videoView in
        debugPrint("set Datazoom called!")
        guard let self = self else { return }
        debugPrint("set Datazoom guarded!")
        if let player = videoView?.getAVPlayerInstance() {
          self.initializeDatazoomIfNeeded(player: player)
            //debugPrint("Datazoom setDatazoom called successfully!")
         }
        })
    }
  
    private func initializeDatazoomIfNeeded(player: AVPlayer) {
     let configBuilder = Config.Builder(configurationId: "f4864053-3ed0-4b94-bc19-1d130d624704")
     configBuilder.logLevel(logLevel: .off)
     configBuilder.isProduction(isProduction: true)
    
     Datazoom.shared.doInit(config: configBuilder.build())
    
     Datazoom.shared.sdkEvents.watch {  event in
       guard let eventDescription = event?.description as? String else { return }
      //debugPrint(eventDescription)
        if eventDescription.contains("SdkInit") {
         self.dzAdapter = Datazoom.shared.createContext(player: player)

          debugPrint("DZ initalized successfully")
        }
      }
     }

    @objc(startDatazoom:)
    func startDatazoom(_ reactTag: NSNumber) {
        performOnVideoView(withReactTag: reactTag) { videoView in
            // Start Datazoom data collection
            // Implementation depends on DzAVPlayerAdapter API
            print("▶️ Datazoom started for video with tag \(reactTag)")
        }
    }
    
    @objc(stopDatazoom:)
    func stopDatazoom(_ reactTag: NSNumber) {
        performOnVideoView(withReactTag: reactTag) { videoView in
            // Stop Datazoom data collection
            // Implementation depends on DzAVPlayerAdapter API
            print("⏹️ Datazoom stopped for video with tag \(reactTag)")
        }
    }
    
    @objc func setDatazoomConfig(_ reactTag: NSNumber, _ config: [String: Any], resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
      
      performOnVideoView(withReactTag: reactTag, callback: { videoView in
        // TODO: Implement set configuration when Android SDK supports it
        #if USE_DZ_ADPATERS
             //videoView.player?.dzConfig = config
            resolve(["success": true])
        #else
            resolve(["success": false, "error": "DzAVPlayerAdapter not available"])
        #endif
      })
    }
    
    @objc func testDatazoomModule(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        resolver(["success": true, "message": "DatazoomManager module is working!"])
    }
    
    
  @objc(getDatazoomStatus:resolver:rejecter:)
  func getDatazoomStatus(_ reactTag: NSNumber, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    performOnVideoView(withReactTag: reactTag) { videoView in
      // Get Datazoom status
      // Implementation depends on DzAVPlayerAdapter API
      let status = [
        "isActive": true,
        "sessionId": "sample-session-id"
      ]
      resolver(status)
    }
  }
#else
    @objc(initDatazoom:)
    func initDatazoom(_ reactTag: NSNumber) {
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
    
    @objc(setDatazoomConfig:config:)
    func setDatazoomConfig(_ reactTag: NSNumber, config: NSDictionary) {
        print("⚙️ Datazoom not available - USE_DZ_ADPATERS not defined")
    }
    
    @objc(getDatazoomStatus:resolver:rejecter:)
    func getDatazoomStatus(_ reactTag: NSNumber, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        let status = [
            "isActive": false,
            "error": "Datazoom not available - USE_DZ_ADPATERS not defined"
        ]
        resolver(status)
    }
#endif
}
