import React, { useState, useRef, useCallback, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Text, TouchableOpacity, Alert } from 'react-native';
import { FlashList, ViewToken } from '@shopify/flash-list';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useOverlay } from '../utils/OverlayContext';
import { ShortData } from '../data/mockData';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ShortPlayerProps {
  item: ShortData;
  isActive: boolean;
  shouldMountVideo: boolean;
}

const ShortPlayer = React.memo(({ item, isActive, shouldMountVideo }: ShortPlayerProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const player = useVideoPlayer(item.videoUrl, p => {
    p.loop = true;
  });

  useEffect(() => {
    if (isActive) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, player]);

  return (
    <View style={styles.shortContainer}>
      {!shouldMountVideo ? (
        <Image 
          source={{ uri: item.thumbnail }} 
          style={styles.fullScreen} 
          contentFit="cover"
          cachePolicy="memory-disk"
        />
      ) : (
        <VideoView
          player={player}
          style={styles.fullScreen}
          contentFit="cover"
          nativeControls={false}
        />
      )}
      <View style={styles.overlay}>
        <View style={styles.textOverlay}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.views}>{item.views} views</Text>
        </View>
        <View style={styles.sideIcons}>
          <TouchableOpacity style={styles.iconButton} onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setIsLiked(!isLiked);
          }}>
            <Feather name="heart" size={32} color={isLiked ? "#C3B1E1" : "rgba(255,255,255,0.9)"} style={styles.iconShadow} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            Alert.alert("Comments", "Opening comments...");
          }}>
            <Feather name="message-circle" size={32} color="rgba(255,255,255,0.9)" style={styles.iconShadow} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            Alert.alert("Share", "Share dialog opened!");
          }}>
            <Feather name="share-2" size={32} color="rgba(255,255,255,0.9)" style={styles.iconShadow} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            if (!isSaved) Alert.alert("Saved", "Reel added to saved list!");
            setIsSaved(!isSaved);
          }}>
            <Feather name="bookmark" size={32} color={isSaved ? "#C3B1E1" : "rgba(255,255,255,0.9)"} style={styles.iconShadow} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

export const ShortsViewer = () => {
  const { shortsData, selectedShortIndex, closeShortsViewer } = useOverlay();
  const [activeItemIndex, setActiveItemIndex] = useState<number>(selectedShortIndex || 0);

  // Sync active item when opened
  useEffect(() => {
    if (selectedShortIndex !== null) {
      setActiveItemIndex(selectedShortIndex);
    }
  }, [selectedShortIndex]);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 70,
  }).current;

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken<ShortData>[] }) => {
    if (viewableItems.length > 0) {
      const active = viewableItems[0].index;
      if (active !== null && active !== undefined) {
        setActiveItemIndex(active);
      }
    }
  }, []);

  if (!shortsData || selectedShortIndex === null) return null;

  const renderItem = ({ item, index }: { item: ShortData, index: number }) => {
    const isActive = activeItemIndex === index;
    // Strict memory management: only mount video if within 1 index
    const shouldMountVideo = Math.abs(activeItemIndex - index) <= 1;

    return (
      <ShortPlayer 
        item={item} 
        isActive={isActive} 
        shouldMountVideo={shouldMountVideo} 
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlashList
        data={shortsData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        estimatedItemSize={SCREEN_HEIGHT}
        initialScrollIndex={selectedShortIndex}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        overrideItemLayout={(layout: any, item, index, max, getLayout) => {
          layout.size = SCREEN_HEIGHT;
        }}
      />
      <TouchableOpacity style={styles.backButton} onPress={closeShortsViewer}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    zIndex: 999, // Ensure it's above everything
  },
  shortContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#000',
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  textOverlay: {
    flex: 1,
    paddingRight: 16,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  views: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
  },
  sideIcons: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  iconButton: {
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 28,
    color: '#fff',
    opacity: 0.9,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 24,
    lineHeight: 24,
    fontWeight: 'bold',
  },
  iconShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  }
});
