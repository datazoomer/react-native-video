import React, {useCallback, useRef, useState, useEffect} from 'react';

import {Platform, TouchableOpacity, View, StatusBar, Button, NativeModules, BackHandler, AppState} from 'react-native';

import Video, {
  SelectedVideoTrackType,
  BufferingStrategyType,
  SelectedTrackType,
  ResizeMode,
  type VideoRef,
  type AudioTrack,
  type OnAudioTracksData,
  type OnLoadData,
  type OnProgressData,
  type OnTextTracksData,
  type OnVideoAspectRatioData,
  type TextTrack,
  type OnBufferData,
  type OnAudioFocusChangedData,
  type OnVideoErrorData,
  type OnTextTrackDataChangedData,
  type OnSeekData,
  type OnPlaybackStateChangedData,
  type OnPlaybackRateChangeData,
  type OnVideoTracksData,
  type VideoTrack,
  type SelectedTrack,
  type SelectedVideoTrack,
  type EnumValues,
  type OnBandwidthUpdateData,
  type ControlsStyles,
} from 'react-native-video';
import styles from './styles';
import {type AdditionalSourceInfo} from './types';
import {
  bufferConfig,
  srcList,
  textTracksSelectionBy,
  audioTracksSelectionBy,
} from './constants';
import {Overlay, toast, VideoLoader} from './components';

interface BasicExampleProps {
  onGoBack?: () => void;
}

const BasicExample = ({onGoBack}: BasicExampleProps) => {
  const [rate, setRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [resizeMode, setResizeMode] = useState<EnumValues<ResizeMode>>(
    ResizeMode.CONTAIN,
  );
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [_, setVideoSize] = useState({videoWidth: 0, videoHeight: 0});
  const [paused, setPaused] = useState(false);
  const [fullscreen, setFullscreen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([]);
  const [textTracks, setTextTracks] = useState<TextTrack[]>([]);
  const [videoTracks, setVideoTracks] = useState<VideoTrack[]>([]);
  const [selectedAudioTrack, setSelectedAudioTrack] = useState<
    SelectedTrack | undefined
  >(undefined);
  const [selectedTextTrack, setSelectedTextTrack] = useState<
    SelectedTrack | undefined
  >(undefined);
  const [selectedVideoTrack, setSelectedVideoTrack] =
    useState<SelectedVideoTrack>({
      type: SelectedVideoTrackType.AUTO,
    });
  const [srcListId, setSrcListId] = useState(0);
  const [repeat, setRepeat] = useState(false);

  // Debug: Check module registration
  useEffect(() => {
    console.log('🔍 Checking DatazoomManager registration...');
    console.log('DatazoomManager available:', !!NativeModules.DatazoomManager);
    if (NativeModules.DatazoomManager) {
      console.log('✅ DatazoomManager found:', Object.getOwnPropertyNames(NativeModules.DatazoomManager));
    } else {
      console.error('❌ DatazoomManager not found!');
      console.log('Available modules:', Object.keys(NativeModules));
    }
  }, []);
  const [controls, setControls] = useState(false);
  const [useCache, setUseCache] = useState(false);
  const [showPoster, setShowPoster] = useState<boolean>(false);
  const [showNotificationControls, setShowNotificationControls] =
    useState(false);
  const [isSeeking, setIsSeeking] = useState(false);

  // Add refs to store previous track data for comparison
  const previousAudioTracksRef = useRef<AudioTrack[]>([]);
  const previousTextTracksRef = useRef<TextTrack[]>([]);

  const videoRef = useRef<VideoRef>(null);
  const viewStyle = fullscreen ? styles.fullScreen : styles.halfScreen;
  const currentSrc = srcList[srcListId];
  const additional = currentSrc as AdditionalSourceInfo;

  // Handle back button press
  const handleBackPress = useCallback(() => {
    console.log('🔙 [BasicExample] Back button pressed, stopping Datazoom...');
    
    // Stop Datazoom tracking for the current video
    if (videoRef.current) {
      try {
        videoRef.current.stopDatazoom();
        console.log('✅ [BasicExample] Datazoom stopped successfully via handleBackPress');
      } catch (error) {
        console.error('❌ [BasicExample] Error stopping Datazoom:', error);
      }
    }

    // Navigate back to Initial Screen
    if (onGoBack) {
      onGoBack();
      return true; // Prevent default back action
    }
    
    return false; // Allow default back action if no onGoBack provided
  }, [onGoBack]);

  // Add hardware back button listener for Android
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    
    // Add AppState listener to catch navigation changes
    const handleAppStateChange = (nextAppState: string) => {
      console.log(`🔄 [BasicExample] App state changed to: ${nextAppState}`);
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        console.log('📱 [BasicExample] App going to background, stopping Datazoom...');
        if (videoRef.current) {
          try {
            videoRef.current.stopDatazoom();
            console.log('✅ [BasicExample] Datazoom stopped due to app state change');
          } catch (error) {
            console.error('❌ [BasicExample] Error stopping Datazoom on app state change:', error);
          }
        }
      }
    };
    
    const appStateListener = AppState.addEventListener('change', handleAppStateChange);
    
    // Add cleanup logging
    return () => {
      console.log('🧹 [BasicExample] Component unmounting...');
      
      // Check if videoRef exists
      if (!videoRef.current) {
        console.warn('⚠️ [BasicExample] videoRef.current is null during cleanup');
        return;
      }
      
      // Check if stopDatazoom method exists
      if (!videoRef.current.stopDatazoom) {
        console.warn('⚠️ [BasicExample] stopDatazoom method not found on videoRef');
        return;
      }
      
      // Call stopDatazoom on component unmount
      try {
        console.log('🛑 [BasicExample] Calling stopDatazoom from component cleanup...');
        const result = videoRef.current.stopDatazoom();
        console.log('🛑 [BasicExample] stopDatazoom returned:', result);
        console.log('✅ [BasicExample] Datazoom stopped successfully from cleanup');
      } catch (error) {
        console.error('❌ [BasicExample] Error stopping Datazoom on unmount:', error);
        console.error('❌ [BasicExample] Error details:', JSON.stringify(error));
      }
      
      backHandler.remove();
      appStateListener?.remove();
    };
  }, [handleBackPress]);

  const goToChannel = useCallback((channel: number) => {
    setSrcListId(channel);
    setDuration(0);
    setCurrentTime(0);
    setVideoSize({videoWidth: 0, videoHeight: 0});
    setIsLoading(false);
    setAudioTracks([]);
    setTextTracks([]);
    setSelectedAudioTrack(undefined);
    setSelectedTextTrack(undefined);
    setSelectedVideoTrack({
      type: SelectedVideoTrackType.AUTO,
    });
  }, []);

  const channelUp = useCallback(() => {
    console.log('channel up');
    goToChannel((srcListId + 1) % srcList.length);
  }, [goToChannel, srcListId]);

  const channelDown = useCallback(() => {
    console.log('channel down');
    goToChannel((srcListId + srcList.length - 1) % srcList.length);
  }, [goToChannel, srcListId]);

  const onAudioTracks = (data: OnAudioTracksData) => {
    console.log('onAudioTracks', data);

    // Check if audio tracks have actually changed
    const currentTracks = data.audioTracks || [];
    const previousTracks = previousAudioTracksRef.current;

    // Simple comparison - check if tracks array length or selected track changed
    const tracksChanged =
      currentTracks.length !== previousTracks.length ||
      JSON.stringify(
        currentTracks.map((t) => ({
          index: t.index,
          selected: t.selected,
          language: t.language,
        })),
      ) !==
        JSON.stringify(
          previousTracks.map((t) => ({
            index: t.index,
            selected: t.selected,
            language: t.language,
          })),
        );

    if (!tracksChanged) {
      return; // Skip if tracks haven't changed
    }

    previousAudioTracksRef.current = currentTracks;

    const selectedTrack = currentTracks.find((x: AudioTrack) => {
      return x.selected;
    });
    let value;
    if (audioTracksSelectionBy === SelectedTrackType.INDEX) {
      value = selectedTrack?.index;
    } else if (audioTracksSelectionBy === SelectedTrackType.LANGUAGE) {
      value = selectedTrack?.language;
    } else if (audioTracksSelectionBy === SelectedTrackType.TITLE) {
      value = selectedTrack?.title;
    }
    setAudioTracks(currentTracks);
    setSelectedAudioTrack({
      type: audioTracksSelectionBy,
      value: value,
    });
  };

  const onVideoTracks = (data: OnVideoTracksData) => {
    console.log('onVideoTracks', data.videoTracks);
    setVideoTracks(data.videoTracks);
  };

  const onTextTracks = (data: OnTextTracksData) => {
    // Check if text tracks have actually changed
    const currentTracks = data.textTracks || [];
    const previousTracks = previousTextTracksRef.current;

    // Simple comparison - check if tracks array length or selected track changed
    const tracksChanged =
      currentTracks.length !== previousTracks.length ||
      JSON.stringify(
        currentTracks.map((t) => ({
          index: t.index,
          selected: t.selected,
          language: t.language,
        })),
      ) !==
        JSON.stringify(
          previousTracks.map((t) => ({
            index: t.index,
            selected: t.selected,
            language: t.language,
          })),
        );

    if (!tracksChanged) {
      return; // Skip if tracks haven't changed
    }

    previousTextTracksRef.current = currentTracks;

    const selectedTrack = currentTracks.find((x: TextTrack) => {
      return x?.selected;
    });

    setTextTracks(currentTracks);
    let value;
    if (textTracksSelectionBy === SelectedTrackType.INDEX) {
      value = selectedTrack?.index;
    } else if (textTracksSelectionBy === SelectedTrackType.LANGUAGE) {
      value = selectedTrack?.language;
    } else if (textTracksSelectionBy === SelectedTrackType.TITLE) {
      value = selectedTrack?.title;
    }
    setSelectedTextTrack({
      type: textTracksSelectionBy,
      value: value,
    });
  };

  const onLoad = (data: OnLoadData) => {
    console.log('Video loaded, duration:', data.duration);
    setDuration(data.duration);
    onAudioTracks(data);
    onTextTracks(data);
    onVideoTracks(data);
  };

  const onProgress = (data: OnProgressData) => {
    setCurrentTime(data.currentTime);
  };

  const onSeek = (data: OnSeekData) => {
    setCurrentTime(data.currentTime);
    setIsSeeking(false);
  };

  const onVideoLoadStart = () => {
    console.log('onVideoLoadStart');
    setIsLoading(true);
  };

  const onTextTrackDataChanged = (data: OnTextTrackDataChangedData) => {
    console.log(`Subtitles: ${JSON.stringify(data, null, 2)}`);
  };

  const onAspectRatio = (data: OnVideoAspectRatioData) => {
    console.log('onAspectRadio called ' + JSON.stringify(data));
    setVideoSize({videoWidth: data.width, videoHeight: data.height});
  };

  const onVideoBuffer = (param: OnBufferData) => {
    console.log('onVideoBuffer');
    setIsLoading(param.isBuffering);
  };

  const onReadyForDisplay = () => {
    console.log('onReadyForDisplay');
    setIsLoading(false);
  };

  const onAudioBecomingNoisy = () => {
    setPaused(true);
  };

  const onAudioFocusChanged = (event: OnAudioFocusChangedData) => {
    setPaused(!event.hasAudioFocus);
  };

  const onError = (err: OnVideoErrorData) => {
    console.log(JSON.stringify(err));
    toast(true, 'error: ' + JSON.stringify(err));
  };

  const onEnd = () => {
    if (!repeat) {
      channelUp();
    }
  };

  const onPlaybackRateChange = (data: OnPlaybackRateChangeData) => {
    console.log('onPlaybackRateChange', data);
  };

  const onPlaybackStateChanged = (data: OnPlaybackStateChangedData) => {
    console.log('onPlaybackStateChanged', data);
  };

  const onVideoBandwidthUpdate = (data: OnBandwidthUpdateData) => {
    console.log('onVideoBandwidthUpdate', data);
  };

  const _renderLoader = showPoster ? () => <VideoLoader /> : undefined;

  const _subtitleStyle = {subtitlesFollowVideo: true};
  const _controlsStyles: ControlsStyles = {
    hideNavigationBarOnFullScreenMode: true,
    hideNotificationBarOnFullScreenMode: true,
    liveLabel: 'LIVE',
  };
  const _bufferConfig = {
    ...bufferConfig,
    cacheSizeMB: useCache ? 200 : 0,
  };

  useEffect(() => {
    videoRef.current?.setSource({...currentSrc, bufferConfig: _bufferConfig});
  }, [currentSrc]);

  const testDatazoom = useCallback(() => {
    console.log('🧪 Manual test button pressed - calling initDatazoom');
    videoRef.current?.initDatazoom();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar animated={true} backgroundColor="black" hidden={false} />

      {(srcList[srcListId] as AdditionalSourceInfo)?.noView ? null : (
        <TouchableOpacity style={viewStyle}>
          <Video
            showNotificationControls={showNotificationControls}
            ref={videoRef}
            //            source={currentSrc as ReactVideoSource}
            drm={additional?.drm}
            style={viewStyle}
            rate={rate}
            paused={paused}
            volume={volume}
            muted={muted}
            controls={controls}
            resizeMode={resizeMode}
            onLoad={onLoad}
            onAudioTracks={onAudioTracks}
            onTextTracks={onTextTracks}
            onVideoTracks={onVideoTracks}
            onTextTrackDataChanged={onTextTrackDataChanged}
            onProgress={onProgress}
            onEnd={onEnd}
            progressUpdateInterval={1000}
            onError={onError}
            onAudioBecomingNoisy={onAudioBecomingNoisy}
            onAudioFocusChanged={onAudioFocusChanged}
            onLoadStart={onVideoLoadStart}
            onAspectRatio={onAspectRatio}
            onReadyForDisplay={onReadyForDisplay}
            onBuffer={onVideoBuffer}
            onBandwidthUpdate={onVideoBandwidthUpdate}
            onSeek={onSeek}
            repeat={repeat}
            selectedTextTrack={selectedTextTrack}
            selectedAudioTrack={selectedAudioTrack}
            selectedVideoTrack={selectedVideoTrack}
            playInBackground={false}
            preventsDisplaySleepDuringVideoPlayback={true}
            renderLoader={_renderLoader}
            onPlaybackRateChange={onPlaybackRateChange}
            onPlaybackStateChanged={onPlaybackStateChanged}
            bufferingStrategy={BufferingStrategyType.DEFAULT}
            debug={{enable: true, thread: true}}
            subtitleStyle={_subtitleStyle}
            controlsStyles={_controlsStyles}
          />
        </TouchableOpacity>
      )}
      
      {/* Test Button for Datazoom */}
      <View style={{position: 'absolute', top: 100, right: 20, zIndex: 999}}>
        <Button title="Test Datazoom" onPress={testDatazoom} />
      </View>
      
      {/* Manual Back Button for Testing */}
      <View style={{position: 'absolute', top: 50, left: 20, zIndex: 999}}>
        <Button 
          title="Manual Back" 
          onPress={() => {
            console.log('🔄 [BasicExample] Manual back button pressed');
            handleBackPress();
          }} 
          color="#FF6B6B" 
        />
      </View>
      
      <Overlay
        channelDown={channelDown}
        channelUp={channelUp}
        ref={videoRef}
        videoTracks={videoTracks}
        selectedVideoTrack={selectedVideoTrack}
        setSelectedTextTrack={setSelectedTextTrack}
        audioTracks={audioTracks}
        controls={controls}
        resizeMode={resizeMode}
        textTracks={textTracks}
        selectedTextTrack={selectedTextTrack}
        selectedAudioTrack={selectedAudioTrack}
        setSelectedAudioTrack={setSelectedAudioTrack}
        setSelectedVideoTrack={setSelectedVideoTrack}
        currentTime={currentTime}
        setMuted={setMuted}
        muted={muted}
        duration={duration}
        paused={paused}
        volume={volume}
        setControls={setControls}
        showPoster={showPoster}
        rate={rate}
        setFullscreen={setFullscreen}
        setPaused={setPaused}
        isLoading={isLoading}
        isSeeking={isSeeking}
        setIsSeeking={setIsSeeking}
        repeat={repeat}
        setRepeat={setRepeat}
        setShowPoster={setShowPoster}
        setRate={setRate}
        setResizeMode={setResizeMode}
        setShowNotificationControls={setShowNotificationControls}
        showNotificationControls={showNotificationControls}
        setUseCache={setUseCache}
        setVolume={setVolume}
        useCache={useCache}
        srcListId={srcListId}
      />
    </View>
  );
};
export default BasicExample;
