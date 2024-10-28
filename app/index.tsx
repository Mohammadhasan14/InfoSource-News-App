import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, BackHandler, ActivityIndicator, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { Dialog, Portal, Button as PaperButton } from 'react-native-paper';
import Constants from 'expo-constants';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function Index() {
  const [visible, setVisible] = useState(false);
  const [backPressCount, setBackPressCount] = useState(0);
  const [isConnected, setIsConnected] = useState(true);
  const webViewRef = useRef(null);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const handleExit = () => {
    hideDialog();
    BackHandler.exitApp();
  };

  const handleBackPress = () => {
    if (backPressCount === 0) {
      if (webViewRef.current) {
        webViewRef.current.goBack();
      }
      setBackPressCount(1);
      setTimeout(() => setBackPressCount(0), 1000);
      return true;
    } else {
      showDialog();
      return true;
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
  }, [backPressCount]);


  const hideElements = `
    try {
      jQuery(document).ready(function($) {
        if ($(window).width() <= 768) {
          $('.component-wrap').css('display', 'none');
          $('.site-footer').css('display', 'none');
        }
      });
    } catch (error) {
      console.log('Error hiding element:', error);
    }
    true;
  `;

  const handleReload = () => {
    setIsConnected(true);
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  return (
      <View style={styles.container}>
      <StatusBar style="light" backgroundColor="black" translucent={false} />
        {isConnected ? (
          <WebView
            ref={webViewRef}
            style={styles.flexContainer}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="black" size="large" />
              </View>
            )}
            source={{ uri: 'https://infosourcenews.com/' }}
            injectedJavaScript={hideElements}
            onLoadStart={() => webViewRef?.current?.injectJavaScript(hideElements)}
            onError={() => {
              console.log("error occured");
              setIsConnected(false)
            }}
          />
        ) : (
          <View style={styles.errorContainer}>
            <MaterialIcons name="wifi-off" size={48} color="#206795" />
            <Text style={styles.errorMessage}>Check your internet connection</Text>
            <TouchableOpacity onPress={handleReload} style={styles.retryButton}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog} style={{ backgroundColor: '#fff' }}>
            <Dialog.Title style={{ color: '#004364' }}>Confirm Exit</Dialog.Title>
            <Dialog.Content>
              <Text style={{ color: '#000' }}>Are you sure you want to exit?</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <PaperButton onPress={hideDialog} textColor="#004364" style={styles.button}>
                No, Cancel
              </PaperButton>
              <PaperButton onPress={handleExit} textColor="#004364" style={styles.button}>
                Yes, Exit
              </PaperButton>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  flexContainer: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 340,
  },
  button: {
    marginHorizontal: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  errorMessage: {
    fontSize: 18,
    color: '#206795',
    textAlign: 'center',
    marginVertical: 10,
  },
  retryButton: {
    backgroundColor: '#206795',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 15,
    elevation: 2,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
