/**
 * Test script to verify DatazoomManager module registration
 * Run this in your React Native app to debug module loading
 */

import {NativeModules} from 'react-native';

console.log('=== Module Registration Test ===');
console.log('Available NativeModules:', Object.keys(NativeModules));

console.log('VideoManager available:', !!NativeModules.VideoManager);
console.log('DatazoomManager available:', !!NativeModules.DatazoomManager);

if (NativeModules.VideoManager) {
  console.log('VideoManager methods:', Object.getOwnPropertyNames(NativeModules.VideoManager));
}

if (NativeModules.DatazoomManager) {
  console.log('DatazoomManager methods:', Object.getOwnPropertyNames(NativeModules.DatazoomManager));
} else {
  console.error('❌ DatazoomManager not found! Check module registration.');
}

// Test if DatazoomManager can be called
if (NativeModules.DatazoomManager && NativeModules.DatazoomManager.initDatazoom) {
  console.log('✅ DatazoomManager.initDatazoom method found');
} else {
  console.error('❌ DatazoomManager.initDatazoom method not found');
}
