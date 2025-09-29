//
//  RCTDatazoomManager.m
//  react-native-video
//
//  Created by React Native Video
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RCTDatazoomManager, NSObject)

RCT_EXTERN_METHOD(initDatazoom : (nonnull NSNumber*)reactTag)
RCT_EXTERN_METHOD(startDatazoom : (nonnull NSNumber*)reactTag)
RCT_EXTERN_METHOD(stopDatazoom : (nonnull NSNumber*)reactTag)
RCT_EXTERN_METHOD(setDatazoomConfig : (nonnull NSNumber*)reactTag config : (NSDictionary*)config)
RCT_EXTERN_METHOD(testDatazoomModule : (RCTPromiseResolveBlock)resolve 
                  rejecter : (RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getDatazoomStatus : (nonnull NSNumber*)reactTag 
                  resolver : (RCTPromiseResolveBlock)resolve 
                  rejecter : (RCTPromiseRejectBlock)reject)

@end
