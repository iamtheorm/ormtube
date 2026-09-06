import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export const LibraryScreen = () => {
  const collections = [
    { id: 1, name: 'History', icon: 'clock', count: 124 },
    { id: 2, name: 'Your videos', icon: 'play-circle', count: 4 },
    { id: 3, name: 'Downloads', icon: 'download', count: 12 },
    { id: 4, name: 'Your movies', icon: 'film', count: 0 },
  ];

  const playlists = [
    { id: 1, name: 'Watch Later', icon: 'clock', count: 24, isPrivate: true },
    { id: 2, name: 'Liked Videos', icon: 'thumbs-up', count: 142, isPrivate: true },
    { id: 3, name: 'React Native Tutorials', icon: 'list', count: 8, isPrivate: false },
    { id: 4, name: 'Music to Code By', icon: 'music', count: 56, isPrivate: false },
  ];

  const renderListItem = (item: any, isPlaylist = false) => (
    <TouchableOpacity 
      style={styles.listItem}
      onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
    >
      <Feather name={item.icon as any} size={24} color="#C3B1E1" style={styles.listIcon} />
      <View style={styles.listTextContainer}>
        <Text style={styles.listTitle}>{item.name}</Text>
        <Text style={styles.listSubtitle}>
          {item.count} videos {isPlaylist && item.isPrivate ? '• Private' : ''}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Library</Text>
      
      <View style={styles.section}>
        {collections.map(c => <React.Fragment key={c.id}>{renderListItem(c)}</React.Fragment>)}
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Playlists</Text>
        <TouchableOpacity style={styles.newPlaylistBtn}>
          <Feather name="plus" size={24} color="#FFB800" />
          <Text style={styles.newPlaylistText}>New playlist</Text>
        </TouchableOpacity>
        {playlists.map(p => <React.Fragment key={p.id}>{renderListItem(p, true)}</React.Fragment>)}
      </View>
    </ScrollView>
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
  section: {
    paddingVertical: 8,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  listIcon: {
    marginRight: 16,
  },
  listTextContainer: {
    flex: 1,
  },
  listTitle: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 4,
  },
  listSubtitle: {
    color: '#A0A0A0',
    fontSize: 13,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#1F1F23',
    marginVertical: 8,
  },
  newPlaylistBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 4,
  },
  newPlaylistText: {
    color: '#FFB800',
    fontSize: 16,
    marginLeft: 16,
    fontWeight: '500',
  }
});
