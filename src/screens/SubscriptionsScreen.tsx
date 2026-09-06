import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { mockVideos } from '../data/mockData';

export const SubscriptionsScreen = () => {
  // Extract unique channels — filter out items with no channelName (e.g. shortsRow entries)
  const subscriptions = Array.from(
    new Set(
      mockVideos
        .filter(v => v.channelName)
        .map(v => v.channelName as string)
    )
  ).map((name, index) => {
    const video = mockVideos.find(v => v.channelName === name);
    return {
      id: `sub-${index}-${name}`, // guaranteed unique, non-undefined key
      name,
      avatar: video?.avatar,
      isLive: index % 3 === 0, // deterministic — avoids re-render flicker from Math.random
    };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Subscriptions</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subsRow}
        contentContainerStyle={styles.subsRowContent}>
        {subscriptions.map((sub) => (
          <View key={sub.id} style={styles.subItem}>
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: sub.avatar }} style={styles.avatar} />
              {sub.isLive ? <View style={styles.liveIndicator} /> : null}
            </View>
            <Text style={styles.subName} numberOfLines={1}>{sub.name}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.content}>
        <Text style={styles.emptyText}>You have {subscriptions.length} subscriptions.</Text>
        <Text style={styles.emptySubText}>New videos will appear here.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0C',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    padding: 16,
    letterSpacing: -0.5,
  },
  subsRow: {
    flexGrow: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#1F1F23',
  },
  subsRowContent: {
    paddingHorizontal: 8,
    paddingVertical: 16,
    flexDirection: 'row',
  },
  subItem: {
    alignItems: 'center',
    marginHorizontal: 12,
    width: 64,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 8,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#2A2A35',
  },
  liveIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FF3B30',
    borderWidth: 2,
    borderColor: '#0A0A0C',
  },
  subName: {
    color: '#A0A0A0',
    fontSize: 11,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubText: {
    color: '#A0A0A0',
    fontSize: 14,
  }
});
