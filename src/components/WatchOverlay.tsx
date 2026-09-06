import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Dimensions, Text, TouchableOpacity, BackHandler, Alert } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
  runOnJS,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { Gesture, GestureDetector, ScrollView } from 'react-native-gesture-handler';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useOverlay } from '../utils/OverlayContext';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const PLAYER_HEIGHT = SCREEN_WIDTH * (9 / 16);
const MINI_PLAYER_HEIGHT = 60;
const MINI_PLAYER_WIDTH = 120;
const MINI_PLAYER_MARGIN_BOTTOM = 60; // Space for bottom tabs if any

const SPRING_CONFIG = {
  damping: 24,
  stiffness: 120,
  mass: 1.5,
};

const Skeleton = ({ style }: { style: any }) => {
  const opacity = useSharedValue(0.3);
  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 1000 }),
        withTiming(0.3, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);
  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return <Animated.View style={[style, animStyle]} />;
};

export const WatchOverlay = () => {
  const { selectedVideo, videoLayout, closeWatchScreen } = useOverlay();
  
  const player = useVideoPlayer(selectedVideo?.videoUrl || null, p => {
    p.loop = true;
    p.play();
  });

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  // Reset states when a new video is selected
  useEffect(() => {
    setIsSubscribed(false);
    setIsLiked(false);
    setIsDisliked(false);
  }, [selectedVideo]);

  // 0 = full screen, 1 = minimized
  const progress = useSharedValue(0);
  const translateY = useSharedValue(0);
  const isMinimized = useSharedValue(false);
  const isAnimating = useSharedValue(false);

  useEffect(() => {
    if (selectedVideo && videoLayout) {
      // Start from the exact layout
      // For a true shared element, we'd animate from videoLayout to 0
      // To simplify the math for the gesture, we just pop it open and animate from bottom or center.
      // But requirement says: "thumbnail seamlessly expands into the functional watch player"
      // Let's do a smooth spring into full screen.
      progress.value = 0;
      translateY.value = withSpring(0, SPRING_CONFIG);
      isMinimized.value = false;
    }
  }, [selectedVideo, videoLayout]);

  const handleClose = () => {
    closeWatchScreen();
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (isMinimized.value) return; // Handle mini-player drag separately or ignore
      // Only allow drag down if at the top of the scroll (simplified: any drag down)
      if (event.translationY > 0) {
        translateY.value = event.translationY;
        progress.value = Math.min(event.translationY / (SCREEN_HEIGHT - 300), 1);
      }
    })
    .onEnd((event) => {
      if (isMinimized.value) {
        // If swiped down/away when minimized
        if (event.translationX > 50 || event.translationX < -50 || event.translationY > 50) {
          runOnJS(handleClose)();
        } else if (event.translationY < -50) {
          // Swipe up to restore
          isMinimized.value = false;
          progress.value = withSpring(0, SPRING_CONFIG);
          translateY.value = withSpring(0, SPRING_CONFIG);
        }
      } else {
        if (event.velocityY > 500 || event.translationY > 200) {
          // Minimize
          runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
          isMinimized.value = true;
          progress.value = withSpring(1, SPRING_CONFIG);
          translateY.value = withSpring(SCREEN_HEIGHT - MINI_PLAYER_HEIGHT - MINI_PLAYER_MARGIN_BOTTOM, SPRING_CONFIG);
        } else {
          // Restore full
          progress.value = withSpring(0, SPRING_CONFIG);
          translateY.value = withSpring(0, SPRING_CONFIG);
        }
      }
    });

  const nativeScrollGesture = Gesture.Native();
  const simultaneousGesture = Gesture.Simultaneous(panGesture, nativeScrollGesture);

  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: interpolate(progress.value, [0.9, 1], [1, 0.95], Extrapolation.CLAMP), // Slight fade if needed
    };
  });

  const playerStyle = useAnimatedStyle(() => {
    const width = interpolate(progress.value, [0, 1], [SCREEN_WIDTH, MINI_PLAYER_WIDTH], Extrapolation.CLAMP);
    const height = interpolate(progress.value, [0, 1], [PLAYER_HEIGHT, MINI_PLAYER_HEIGHT], Extrapolation.CLAMP);
    return {
      width,
      height,
    };
  });

  const contentStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(progress.value, [0, 0.5], [1, 0], Extrapolation.CLAMP),
    };
  });

  const miniPlayerInfoStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(progress.value, [0.5, 1], [0, 1], Extrapolation.CLAMP),
    };
  });

  if (!selectedVideo) return null;

  return (
    <GestureDetector gesture={simultaneousGesture}>
      <Animated.View style={[styles.container, containerStyle]}>
        
        {/* Ambient Glow from Thumbnail */}
        <Animated.View style={[styles.ambientGlow, contentStyle]} pointerEvents="none">
          <LinearGradient
            colors={['rgba(127, 0, 255, 0.4)', 'rgba(10, 10, 12, 0)']}
            style={styles.ambientGlowImage}
          />
        </Animated.View>

        <View style={styles.playerContainer}>
          <Animated.View style={[styles.videoWrapper, playerStyle]}>
            <VideoView
              player={player}
              style={styles.fullScreen}
              contentFit="cover"
              nativeControls={false}
            />
            {/* If the video takes time to load, show thumbnail */}
            {/* Using expo-av, it handles buffering, but we can overlay thumbnail if needed */}
          </Animated.View>

          {/* Top Back Button that fades out when minimized */}
          <Animated.View style={[styles.topBackButton, contentStyle]} pointerEvents="box-none">
            <TouchableOpacity onPress={handleClose} style={styles.topBackHitBox}>
              <Feather name="chevron-down" size={32} color="#FFF" style={styles.topBackIcon} />
            </TouchableOpacity>
          </Animated.View>
          
          {/* Mini-player info that fades in when minimized */}
          <Animated.View style={[styles.miniPlayerInfo, miniPlayerInfoStyle]} pointerEvents="box-none">
            <View style={styles.miniTextContainer}>
              <Text style={styles.miniTitle} numberOfLines={1}>{selectedVideo.title}</Text>
              <View style={styles.miniChannelInline}>
                <Feather name="star" size={10} color="#CF9FFF" />
                <Text style={styles.miniChannel} numberOfLines={1}>{selectedVideo.channelName}</Text>
              </View>
            </View>
            
            <View style={styles.miniActionButtons}>
              <TouchableOpacity style={styles.miniActionBtn} onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setIsLiked(!isLiked);
                if (!isLiked) setIsDisliked(false);
              }}>
                <Feather name="thumbs-up" size={16} color={isLiked ? "#FFB800" : "#FFF"} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.miniActionBtn} onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Alert.alert("Share", "Share dialog opened!");
              }}>
                <Feather name="share-2" size={16} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.miniActionBtn} onPress={handleClose}>
                <Feather name="x" size={18} color="#FFF" />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Invisible tap target over the mini-player thumbnail to restore */}
          <TouchableOpacity 
            style={styles.miniPlayerTapArea} 
            onPress={() => {
              if (isMinimized.value) {
                isMinimized.value = false;
                progress.value = withSpring(0, SPRING_CONFIG);
                translateY.value = withSpring(0, SPRING_CONFIG);
              }
            }}
          />

          {/* Mini Player Progress Bar Placeholder (Simulated) */}
          <Animated.View style={[styles.miniProgressBarContainer, miniPlayerInfoStyle]}>
             <View style={styles.miniProgressBarFill} />
          </Animated.View>
        </View>

        {/* Scrollable details below the player */}
        <Animated.View style={[styles.detailsContainer, contentStyle]}>
          <ScrollView 
            bounces={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.titleArea}>
              <Text style={styles.title}>{selectedVideo.title}</Text>
              <Text style={styles.viewsText}>
                {selectedVideo.views} • {selectedVideo.uploadTime}
              </Text>
            </View>
            <View style={styles.actionBar}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setIsLiked(!isLiked);
                  if (!isLiked) setIsDisliked(false);
                }}
              >
                <Feather name="thumbs-up" size={20} color={isLiked ? "#FFB800" : "#FFF"} />
                <Text style={[styles.actionText, isLiked && { color: '#FFB800' }]}>Like</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setIsDisliked(!isDisliked);
                  if (!isDisliked) setIsLiked(false);
                }}
              >
                <Feather name="thumbs-down" size={20} color={isDisliked ? "#FFB800" : "#FFF"} />
                <Text style={[styles.actionText, isDisliked && { color: '#FFB800' }]}>Dislike</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => Alert.alert("Share", "Share dialog opened!")}
              >
                <Feather name="share-2" size={20} color="#FFF" />
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  Alert.alert("Saved", "Added to Watch Later");
                }}
              >
                <Feather name="bookmark" size={20} color="#FFF" />
                <Text style={styles.actionText}>Save</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.channelArea}>
              <Image source={{ uri: selectedVideo.avatar }} style={styles.channelAvatar} cachePolicy="memory-disk" />
              <View style={styles.channelText}>
                <Text style={styles.channelName}>{selectedVideo.channelName}</Text>
                <Text style={styles.subsText}>1.2M subscribers</Text>
              </View>
              <TouchableOpacity 
                style={[styles.subscribeButton, isSubscribed && styles.subscribedButton]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  if (!isSubscribed) {
                    // Subscribe
                  }
                  setIsSubscribed(!isSubscribed);
                }}
              >
                <Text style={[styles.subscribeText, isSubscribed && styles.subscribedText]}>
                  {isSubscribed ? 'Subscribed' : 'Subscribe'}
                </Text>
              </TouchableOpacity>
            </View>
            
            {/* Placeholder comments/recommendations to show scrolling coordination */}
            <TouchableOpacity 
              style={styles.commentsPreview}
              onPress={() => Alert.alert("Comments", "Opening comments section...")}
            >
              <Text style={styles.sectionTitle}>Comments 2.4K</Text>
              <Text style={styles.commentText}>This is exactly what I was looking for. Perfect explanation!</Text>
            </TouchableOpacity>
            <View style={styles.recommendations}>
              {Array.from({length: 10}).map((_, i) => (
                <View key={i} style={styles.recItem}>
                  <Skeleton style={styles.recThumb} />
                  <View style={styles.recInfo}>
                    <Skeleton style={styles.recLine1} />
                    <Skeleton style={styles.recLine2} />
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT,
    zIndex: 100,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0A0A0C',
  },
  ambientGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.6,
    opacity: 0.18, // 15-20% opacity glow
    zIndex: 0,
  },
  ambientGlowImage: {
    width: '100%',
    height: '100%',
  },
  playerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121215', // Matches new video card color
    overflow: 'hidden',
    borderRadius: 0, // Gets animated or updated via style if needed, but for simplicity, let's keep it square when full, and style it dynamically if we can. Actually we'll just add border radius when minimized.
    borderTopWidth: 1,
    borderTopColor: '#2A2A35',
  },
  videoWrapper: {
    overflow: 'hidden',
  },
  fullScreen: {
    width: '100%',
    height: '100%',
  },
  miniPlayerInfo: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  miniTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  miniChannel: {
    color: '#aaa',
    fontSize: 12,
  },
  topBackButton: {
    position: 'absolute',
    top: 40, // Account for status bar
    left: 16,
    zIndex: 20,
  },
  topBackHitBox: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBackIcon: {
    lineHeight: 32,
  },
  miniPlayerTapArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  miniCloseButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingRight: 16,
    zIndex: 11,
  },
  closeHitBox: {
    padding: 10,
  },
  closeIcon: {
    color: '#fff',
    fontSize: 20,
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: '#0A0A0C',
    zIndex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  titleArea: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#1F1F23',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  viewsText: {
    fontSize: 13,
    color: '#A0A0A0',
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#1F1F23',
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    color: '#FFF',
    fontSize: 12,
    marginTop: 4,
  },
  channelArea: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#1F1F23',
  },
  channelAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  channelText: {
    flex: 1,
  },
  channelName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    letterSpacing: -0.2,
  },
  subsText: {
    fontSize: 12,
    color: '#A0A0A0',
  },
  subscribeButton: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  subscribedButton: {
    backgroundColor: '#1F1F23',
  },
  subscribeText: {
    color: '#0A0A0C',
    fontWeight: '600',
    fontSize: 14,
  },
  subscribedText: {
    color: '#FFF',
  },
  commentsPreview: {
    padding: 16,
    backgroundColor: '#1F1F23',
    margin: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#FFF',
  },
  commentText: {
    fontSize: 13,
    color: '#E0E0E0',
  },
  recommendations: {
    padding: 16,
  },
  recItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  recThumb: {
    width: 160,
    height: 90,
    backgroundColor: '#1F1F23',
    borderRadius: 4,
    marginRight: 12,
  },
  recInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  recLine1: {
    height: 16,
    backgroundColor: '#1F1F23',
    borderRadius: 4,
    marginBottom: 8,
    width: '90%',
  },
  recLine2: {
    height: 14,
    backgroundColor: '#1F1F23',
    borderRadius: 4,
    width: '60%',
  },
  miniProgressBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  miniProgressBarFill: {
    height: '100%',
    width: '45%', // Simulated progress
    backgroundColor: '#FFB800',
  },
  miniTextContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 8,
  },
  miniChannelInline: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  miniActionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniActionBtn: {
    padding: 8,
    marginLeft: 4,
  }
});
