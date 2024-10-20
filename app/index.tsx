import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, BackHandler, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { Dialog, Portal, Button as PaperButton } from 'react-native-paper';
import Constants from 'expo-constants';

export default function Index() {
  const [visible, setVisible] = useState(false);
  const [backPressCount, setBackPressCount] = useState(0);
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

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        style={styles.flexContainer}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              color='black'
              size='large'
            />
          </View>

        )}
        source={{ uri: 'https://infosourcenews.com/' }}
      />
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog} style={{ backgroundColor: '#fff' }}>
          <Dialog.Title style={{ color: '#004364' }}>Confirm Exit</Dialog.Title>
          <Dialog.Content>
            <Text style={{ color: '#000' }}>Are you sure you want to exit?</Text>
          </Dialog.Content>
          <Dialog.Actions >
            <PaperButton onPress={hideDialog} textColor='#004364' style={styles.button}>No, Cancel</PaperButton>
            <PaperButton onPress={handleExit} textColor='#004364' style={styles.button}>Yes, Exit</PaperButton>
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
    flex: 1
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
});
