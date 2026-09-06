import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Modal, SafeAreaView, RefreshControl } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { mockVideos, VideoData } from '../data/mockData';
import { VideoCard } from '../components/VideoCard';
import { ShortsRow } from '../components/ShortsRow';
import { CategoryRow } from '../components/CategoryRow';

export const HomeScreen = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const renderItem = useCallback(({ item }: { item: VideoData }) => {
    if (item.type === 'shortsRow' && item.shorts) {
      return <ShortsRow shorts={item.shorts} />;
    }
    return <VideoCard video={item} />;
  }, []);

  const ListHeader = useCallback(() => (
    <View>
      <View style={styles.header}>
        <View style={styles.headerPurpleLine} />
        {isSearching ? (
          <View style={styles.searchContainer}>
            <TouchableOpacity onPress={() => setIsSearching(false)} style={styles.iconButton}>
              <Feather name="arrow-left" size={20} color="#FFF" />
            </TouchableOpacity>
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              placeholderTextColor="#A0A0A0"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
          </View>
        ) : (
          <>
            <View style={styles.headerLeft}>
              <Text style={styles.brandText}>OrmTube</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.iconButton} onPress={() => setIsSearching(true)}>
                <Feather name="search" size={20} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} onPress={() => setShowNotifications(true)}>
                <Feather name="bell" size={20} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowProfile(true)}>
                <Image 
                  source={{ uri: 'https://picsum.photos/seed/profile/100/100' }} 
                  style={styles.profileAvatar} 
                  cachePolicy="memory-disk"
                />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
      <CategoryRow />
    </View>
  ), [isSearching, searchQuery]);

  return (
    <View style={styles.container}>
      <FlashList
        data={mockVideos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        estimatedItemSize={300}
        ListHeaderComponent={ListHeader}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#7F00FF"
            colors={['#7F00FF']}
          />
        }
      />

      {/* Notifications Modal */}
      <Modal visible={showNotifications} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notifications</Text>
              <TouchableOpacity onPress={() => setShowNotifications(false)}>
                <Feather name="x" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.modalText}>No new notifications right now.</Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Profile Modal */}
      <Modal visible={showProfile} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Account</Text>
              <TouchableOpacity onPress={() => setShowProfile(false)}>
                <Feather name="x" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Image 
                source={{ uri: 'https://picsum.photos/seed/profile/100/100' }} 
                style={styles.largeProfileAvatar} 
              />
              <Text style={styles.modalText}>OrmTube User</Text>
              <Text style={styles.modalSubtext}>user@ormtube.com</Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0C',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(10,10,12,0.6)', // fallback
    height: 60,
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(127, 0, 255, 0.3)',
    position: 'relative',
  },
  headerPurpleLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#7F00FF',
    opacity: 0.5,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandText: {
    fontSize: 26,
    fontFamily: 'serif',
    fontWeight: 'bold',
    color: '#CF9FFF', // Soft purple
    textShadowColor: '#FFB800', // Gold shadow/glow
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  profileAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginLeft: 12,
    backgroundColor: '#1F1F23',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
    marginLeft: 12,
    backgroundColor: '#1F1F23',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1F1F23',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    minHeight: 300,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: -0.5,
  },
  modalBody: {
    alignItems: 'center',
  },
  modalText: {
    color: '#FFF',
    fontSize: 16,
    marginTop: 12,
  },
  modalSubtext: {
    color: '#A0A0A0',
    fontSize: 14,
    marginTop: 4,
  },
  largeProfileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0A0A0C',
  },
});
