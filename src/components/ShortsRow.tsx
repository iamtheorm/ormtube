import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { ShortData } from '../data/mockData';
import { useOverlay } from '../utils/OverlayContext';

interface ShortsRowProps {
  shorts: ShortData[];
}

export const ShortsRow = React.memo(({ shorts }: ShortsRowProps) => {
  const { openShortsViewer } = useOverlay();

  const renderItem = ({ item, index }: { item: ShortData, index: number }) => {
    return (
      <Pressable 
        style={styles.shortCard} 
        onPress={() => openShortsViewer(shorts, index)}
      >
        <Image 
          source={{ uri: item.thumbnail }} 
          style={styles.thumbnail}
          contentFit="cover"
          cachePolicy="memory-disk"
        />
        <View style={styles.overlay}>
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.views}>{item.views} views</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MOMENTS</Text>
      </View>
      <FlashList
        data={shorts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        estimatedItemSize={140}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    backgroundColor: '#0A0A0C',
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#CF9FFF', // light purple for header
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  listContent: {
    paddingHorizontal: 12,
  },
  shortCard: {
    width: 140,
    height: 180, // slightly shorter for a more square-ish card look
    marginHorizontal: 8,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#7F00FF',
    shadowColor: '#7F00FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    paddingTop: 30,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)', // Using a simple gradient trick would be better, but standard solid works too
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 18,
  },
  views: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
});
