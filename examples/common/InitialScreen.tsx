import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  NativeModules,
} from 'react-native';
import {DzSettings, LogLevel} from '../../src/types/datazoom-settings';
import BasicExample from './BasicExample';

const InitialScreen = () => {
  const [showBasicExample, setShowBasicExample] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isDatazoomInitialized, setIsDatazoomInitialized] = useState(false);

  const handleInitializeDatazoom = async () => {
    try {
      setIsInitializing(true);
      console.log('🎯 Initializing Datazoom from button...');
      
      // Check if DatazoomManager is available
      if (!NativeModules.DatazoomManager) {
        throw new Error('DatazoomManager native module not found');
      }

      // Create Datazoom settings
      const dzSettings: DzSettings = {
        configId: 'f4864053-3ed0-4b94-bc19-1d130d624704',
        logLevel: LogLevel.VERBOSE,
        isProduction: true
      };

      console.log('🎯 Datazoom settings:', dzSettings);

      // Call initDatazoom with settings
      await NativeModules.DatazoomManager.initDatazoom(dzSettings);
      
      setIsDatazoomInitialized(true);
      
      Alert.alert(
        'Success!',
        'Datazoom has been initialized successfully with custom settings. You can now proceed to the video examples.',
        [{text: 'OK'}]
      );
      
    } catch (error) {
      console.error('❌ Failed to initialize Datazoom:', error);
      Alert.alert(
        'Error',
        `Failed to initialize Datazoom: ${error.message}`,
        [{text: 'OK'}]
      );
    } finally {
      setIsInitializing(false);
    }
  };

  const handleShowMenu = () => {
    setShowBasicExample(true);
  };

  const handleGoBack = () => {
    console.log('🔙 Going back to Initial Screen');
    setShowBasicExample(false);
  };

  // If user has navigated to BasicExample, show that screen
  if (showBasicExample) {
    return <BasicExample onGoBack={handleGoBack} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>React Native Video</Text>
        <Text style={styles.subtitle}>Datazoom Integration</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          Welcome to the React Native Video example app with Datazoom analytics integration.
        </Text>

        <View style={styles.buttonContainer}>
          {/* Initialize Datazoom Button */}
          <TouchableOpacity
            style={[
              styles.button,
              styles.primaryButton,
              isInitializing && styles.buttonDisabled,
            ]}
            onPress={handleInitializeDatazoom}
            disabled={isInitializing}
          >
            <View style={styles.buttonContent}>
              {isInitializing ? (
                <ActivityIndicator size="small" color="#FFFFFF" style={styles.loader} />
              ) : (
                <Text style={styles.buttonIcon}>🎯</Text>
              )}
              <Text style={styles.primaryButtonText}>
                {isInitializing ? 'Initializing...' : 'Initialize Datazoom'}
              </Text>
            </View>
          </TouchableOpacity>

          {isDatazoomInitialized && (
            <View style={styles.successIndicator}>
              <Text style={styles.successText}>✅ Datazoom Ready!</Text>
            </View>
          )}

          {/* Show Menu Button */}
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleShowMenu}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonIcon}>📱</Text>
              <Text style={styles.secondaryButtonText}>Show Video Examples</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {isDatazoomInitialized 
              ? 'Datazoom is initialized. Video analytics will be automatically tracked.'
              : 'Initialize Datazoom to enable video analytics tracking.'
            }
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: 'center',
  },
  description: {
    fontSize: 16,
    color: '#555555',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 24,
  },
  buttonContainer: {
    alignItems: 'center',
    gap: 20,
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  loader: {
    marginRight: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: '600',
  },
  successIndicator: {
    backgroundColor: '#E8F5E8',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 8,
  },
  successText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    marginTop: 48,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  footerText: {
    fontSize: 14,
    color: '#777777',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default InitialScreen;
