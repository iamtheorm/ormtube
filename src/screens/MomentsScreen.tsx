import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  PanResponder,
  Alert,
} from 'react-native';
import { FlashList, ViewToken } from '@shopify/flash-list';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { shortsData, ShortData } from '../data/mockData';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const TAB_BAR_HEIGHT = 85; // matches BottomTabBar paddingBottom + icon height

const formatTime = (seconds: number): string => {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const remaining = s % 60;
  return `${m}:${remaining.toString().padStart(2, '0')}`;
};

interface MomentPlayerProps {
  item: ShortData;
  isActive: boolean;
  itemHeight: number;
}

const MomentPlayer = React.memo(({ item, isActive, itemHeight }: MomentPlayerProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekProgress, setSeekProgress] = useState(0);

  const progressBarRef = useRef<View>(null);
  const progressBarX = useRef(0);
  const progressBarWidth = useRef(SCREEN_WIDTH - 32);
  const tickerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const player = useVideoPlayer(item.videoUrl, p => {
    p.loop = true;
  });

  const onProgressBarLayout = useCallback(() => {
    progressBarRef.current?.measure((x, y, w, h, pageX) => {
      progressBarX.current = pageX;
      progressBarWidth.current = w || (SCREEN_WIDTH - 32);
    });
  }, []);

  useEffect(() => {
    if (isActive && !isPaused) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, isPaused, player]);

  // Reset when becoming inactive
  useEffect(() => {
    if (!isActive) {
      setCurrentTime(0);
      setDuration(0);
      setIsPaused(false);
    }
  }, [isActive]);

  useEffect(() => {
    if (isActive) {
      tickerRef.current = setInterval(() => {
        if (!isSeeking) {
          const t = player.currentTime ?? 0;
          const d = player.duration ?? 0;
          setCurrentTime(t);
          if (d > 0 && isFinite(d)) setDuration(d);
        }
      }, 200);
    }
    return () => {
      if (tickerRef.current) clearInterval(tickerRef.current);
    };
  }, [isActive, isSeeking, player]);

  const progress = duration > 0 ? Math.min(1, currentTime / duration) : 0;

  const handleSeekToPosition = useCallback((pageX: number) => {
    const relativeX = pageX - progressBarX.current;
    const ratio = Math.max(0, Math.min(1, relativeX / progressBarWidth.current));
    setSeekProgress(ratio);
    player.currentTime = ratio * duration;
    setCurrentTime(ratio * duration);
  }, [duration, player]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        setIsSeeking(true);
        handleSeekToPosition(evt.nativeEvent.pageX);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      },
      onPanResponderMove: (evt) => handleSeekToPosition(evt.nativeEvent.pageX),
      onPanResponderRelease: (evt) => {
        handleSeekToPosition(evt.nativeEvent.pageX);
        setIsSeeking(false);
      },
    })
  ).current;

  const displayProgress = isSeeking ? seekProgress : progress;

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={[styles.momentContainer, { height: itemHeight }]}
      onPress={() => setIsPaused(p => !p)}
    >
      {/* Video / Thumbnail */}
      {isActive ? (
        <VideoView
          player={player}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          nativeControls={false}
        />
      ) : (
        <Image
          source={{ uri: item.thumbnail }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          cachePolicy="memory-disk"
        />
      )}

      {/* Gradient */}
      <LinearGradient
        colors={['rgba(0,0,0,0.15)', 'transparent', 'rgba(10,0,30,0.5)', 'rgba(5,0,20,0.92)']}
        locations={[0, 0.3, 0.65, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* Pause indicator */}
      {isPaused && (
        <View style={styles.pauseOverlay} pointerEvents="none">
          <View style={styles.pauseIconBg}>
            <Feather name="pause" size={36} color="#FFF" />
          </View>
        </View>
      )}

      {/* Right side glassmorphic actions */}
      <View style={styles.sideActions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setIsLiked(v => !v);
          }}
        >
          <View style={[styles.actionIconBg, isLiked && styles.actionIconBgActive]}>
            <Feather name="heart" size={24} color={isLiked ? '#FFB800' : '#FFF'} />
          </View>
          <Text style={[styles.actionCount, isLiked && { color: '#FFB800' }]}>20k</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            Alert.alert('Share', 'Share dialog opened!');
          }}
        >
          <View style={styles.actionIconBg}>
            <Feather name="share-2" size={22} color="#FFF" />
          </View>
          <Text style={styles.actionCount}>5k</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        >
          <View style={styles.actionIconBg}>
            <Feather name="message-circle" size={22} color="#FFF" />
          </View>
          <Text style={styles.actionCount}>500</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setIsBookmarked(v => !v);
          }}
        >
          <View style={[styles.actionIconBg, isBookmarked && styles.actionIconBgPurple]}>
            <Feather name="bookmark" size={22} color={isBookmarked ? '#CF9FFF' : '#FFF'} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Bottom solid panel */}
      <View style={styles.bottomPanel}>
        {/* Purple accent line */}
        <View style={styles.purpleAccent} />

        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.videoViews}>{item.views} views</Text>
        </View>

        {/* Time row */}
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
          <Text style={styles.timeSep}>/</Text>
          <Text style={styles.timeDuration}>{duration > 0 ? formatTime(duration) : '--:--'}</Text>
        </View>

        {/* Scrubable Progress Bar */}
        <View
          ref={progressBarRef}
          onLayout={onProgressBarLayout}
          style={styles.progressTrack}
          {...panResponder.panHandlers}
          hitSlop={{ top: 16, bottom: 16 }}
        >
          {/* Background glow */}
          <View style={styles.progressGlow} />
          <View style={[styles.progressFill, { width: `${displayProgress * 100}%` }]} />
          <View
            style={[styles.progressThumb, { left: `${displayProgress * 100}%` }]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
});

export const MomentsScreen = () => {
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(0);

  // Exact available height: total screen minus top safe area minus tab bar
  const itemHeight = SCREEN_HEIGHT - insets.top - TAB_BAR_HEIGHT;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60,
  }).current;

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  return (
    <View style={styles.container}>
      <FlashList
        data={shortsData}
        renderItem={({ item, index }) => (
          <MomentPlayer
            item={item}
            isActive={index === activeIndex}
            itemHeight={itemHeight}
          />
        )}
        keyExtractor={item => item.id}
        estimatedItemSize={itemHeight}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        decelerationRate="fast"
        snapToInterval={itemHeight}
        snapToAlignment="start"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  momentContainer: {
    width: SCREEN_WIDTH,
    overflow: 'hidden',
    backgroundColor: '#0A0A0C',
  },
  pauseOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sideActions: {
    position: 'absolute',
    right: 12,
    bottom: 160,
    alignItems: 'center',
  },
  actionBtn: {
    alignItems: 'center',
    marginBottom: 16,
  },
  actionIconBg: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  actionIconBgActive: {
    borderColor: 'rgba(255, 184, 0, 0.5)',
    backgroundColor: 'rgba(255, 184, 0, 0.1)',
  },
  actionIconBgPurple: {
    borderColor: 'rgba(207, 159, 255, 0.5)',
    backgroundColor: 'rgba(127, 0, 255, 0.15)',
  },
  actionCount: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    marginTop: 5,
    fontWeight: '600',
  },
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(5, 0, 20, 0.85)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(127, 0, 255, 0.3)',
  },
  purpleAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#7F00FF',
    opacity: 0.7,
  },
  videoInfo: {
    marginBottom: 10,
    paddingRight: 70, // don't overlap side actions
  },
  videoTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  videoViews: {
    color: 'rgba(207, 159, 255, 0.8)',
    fontSize: 13,
    fontWeight: '500',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  timeText: {
    color: '#FFB800',
    fontSize: 13,
    fontWeight: '700',
  },
  timeSep: {
    color: 'rgba(255,255,255,0.3)',
    marginHorizontal: 5,
    fontSize: 13,
  },
  timeDuration: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
  },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 2,
    position: 'relative',
    justifyContent: 'center',
  },
  progressGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 2,
    backgroundColor: 'rgba(127, 0, 255, 0.2)',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFB800',
    borderRadius: 2,
    shadowColor: '#FFB800',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  progressThumb: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFF',
    top: -6,
    marginLeft: -8,
    borderWidth: 2,
    borderColor: '#FFB800',
    shadowColor: '#FFB800',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
});
