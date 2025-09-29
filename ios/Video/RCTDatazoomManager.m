//
//  RCTDatazoomManager.m
//  react-native-video
//
//  Created by React Native Video
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RCTDatazoomManager, NSObject)

RCT_EXTERN_METHOD(initDatazoom : (NSDictionary*)settings)
RCT_EXTERN_METHOD(startDatazoom : (nonnull NSNumber*)reactTag)
RCT_EXTERN_METHOD(stopDatazoom : (nonnull NSNumber*)reactTag)

@end
