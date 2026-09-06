import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useState } from 'react';
import { HomeScreen } from './src/screens/HomeScreen';
import { MomentsScreen } from './src/screens/MomentsScreen';
import { SubscriptionsScreen } from './src/screens/SubscriptionsScreen';
import { LibraryScreen } from './src/screens/LibraryScreen';
import { WatchOverlay } from './src/components/WatchOverlay';
import { OverlayProvider } from './src/utils/OverlayContext';
import { ShortsViewer } from './src/screens/ShortsViewer';
import { BottomTabBar } from './src/components/BottomTabBar';

export default function App() {
  const [activeTab, setActiveTab] = useState('HOME');

  const renderScreen = () => {
    switch (activeTab) {
      case 'HOME':
        return <HomeScreen />;
      case 'MOMENTS':
        return <MomentsScreen />;
      case 'SUBS':
        return <SubscriptionsScreen />;
      case 'LIBRARY':
        return <LibraryScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.container}>
        <OverlayProvider>
          <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            {renderScreen()}
          </SafeAreaView>
          <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
          <WatchOverlay />
          <ShortsViewer />
          <StatusBar style="light" />
        </OverlayProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0C',
  },
  safeArea: {
    flex: 1,
  },
});
