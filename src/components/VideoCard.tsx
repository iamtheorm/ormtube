import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, Pressable, TouchableOpacity, Alert } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { VideoData } from '../data/mockData';
import { useOverlay } from '../utils/OverlayContext';

interface VideoCardProps {
  video: VideoData;
}

export const VideoCard = React.memo(({ video }: VideoCardProps) => {
  const { openWatchScreen } = useOverlay();
  const imageRef = useRef<View>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const handlePress = () => {
    if (imageRef.current) {
      imageRef.current.measure((x, y, width, height, pageX, pageY) => {
        openWatchScreen(video, { x: pageX, y: pageY, width, height });
      });
    }
  };

  const handleLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Share', 'Share dialog opened!');
  };

  const handleMute = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsMuted(!isMuted);
  };

  return (
    <View style={styles.cardContainer}>
      <Pressable style={styles.contentContainer} onPress={handlePress}>
        <View ref={imageRef} style={styles.thumbnailContainer} collapsable={false}>
          <Image 
            source={{ uri: video.thumbnail }} 
            style={styles.thumbnail} 
            contentFit="cover"
            cachePolicy="memory-disk"
          />
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{video.duration}</Text>
          </View>
        </View>
        
        <View style={styles.infoContainer}>
          <Image 
            source={{ uri: video.avatar }} 
            style={styles.avatar} 
            cachePolicy="memory-disk"
          />
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={2}>{video.title}</Text>
            <Text style={styles.metadata}>
              {video.channelName} • {video.views} • {video.uploadTime}
            </Text>
          </View>
          <View style={styles.optionsButton}>
            <Text style={styles.optionsIcon}>⋮</Text>
          </View>
        </View>
      </Pressable>

      <View style={styles.actionBar}>
        <View style={styles.channelInline}>
          <Feather name="star" size={14} color="#7F00FF" />
          <Text style={styles.channelInlineText}>{video.channelName}</Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleLike}>
            <Feather name="thumbs-up" size={18} color={isLiked ? "#FFB800" : "#A0A0A0"} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
            <Feather name="share-2" size={18} color="#A0A0A0" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={handleMute}>
            <Feather name={isMuted ? "volume-x" : "volume-2"} size={18} color="#A0A0A0" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 20,
    marginHorizontal: 12,
    backgroundColor: 'rgba(18, 18, 21, 0.8)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(127, 0, 255, 0.25)',
    overflow: 'hidden',
    shadowColor: '#7F00FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  contentContainer: {
    width: '100%',
  },
  thumbnailContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    position: 'relative',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  infoContainer: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'flex-start',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 4,
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  metadata: {
    fontSize: 12,
    color: '#A0A0A0',
  },
  optionsButton: {
    padding: 4,
  },
  optionsIcon: {
    fontSize: 20,
    color: '#A0A0A0',
    fontWeight: 'bold',
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#2A2A35',
    backgroundColor: '#0A0A0C',
  },
  channelInline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  channelInlineText: {
    color: '#A0A0A0',
    fontSize: 13,
    marginLeft: 6,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    marginLeft: 20,
    padding: 4,
  }
});
