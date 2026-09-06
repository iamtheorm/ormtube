import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface BottomTabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomTabBar = ({ activeTab, onTabChange }: BottomTabBarProps) => {
  const handleTabPress = (tab: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onTabChange(tab);
  };

  const getTabColor = (tab: string) => activeTab === tab ? '#FFB800' : '#A0A0A0';

  return (
    <View style={styles.container}>
      <View style={styles.purpleBorder} />
      <TouchableOpacity style={styles.tab} onPress={() => handleTabPress('HOME')}>
        <Feather name="home" size={22} color={getTabColor('HOME')} />
        <Text style={[styles.tabText, activeTab === 'HOME' && styles.activeText]}>HOME</Text>
        {activeTab === 'HOME' && <View style={styles.indicator} />}
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab} onPress={() => handleTabPress('MOMENTS')}>
        <Feather name="film" size={22} color={getTabColor('MOMENTS')} />
        <Text style={[styles.tabText, activeTab === 'MOMENTS' && styles.activeText]}>MOMENTS</Text>
        {activeTab === 'MOMENTS' && <View style={styles.indicator} />}
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab} onPress={() => handleTabPress('SUBS')}>
        <Feather name="youtube" size={22} color={getTabColor('SUBS')} />
        <Text style={[styles.tabText, activeTab === 'SUBS' && styles.activeText]}>SUBS</Text>
        {activeTab === 'SUBS' && <View style={styles.indicator} />}
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab} onPress={() => handleTabPress('LIBRARY')}>
        <Feather name="folder" size={22} color={getTabColor('LIBRARY')} />
        <Text style={[styles.tabText, activeTab === 'LIBRARY' && styles.activeText]}>LIBRARY</Text>
        {activeTab === 'LIBRARY' && <View style={styles.indicator} />}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingBottom: 25,
    backgroundColor: '#0A0A0C',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#1F1F23',
    position: 'relative',
  },
  purpleBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#7F00FF',
    opacity: 0.6,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    position: 'relative',
  },
  tabText: {
    color: '#A0A0A0',
    fontSize: 9,
    marginTop: 6,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  activeText: {
    color: '#FFB800',
    fontWeight: '700',
  },
  indicator: {
    position: 'absolute',
    bottom: -10,
    width: 24,
    height: 3,
    backgroundColor: '#FFB800',
    borderRadius: 2,
    shadowColor: '#FFB800',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  }
});
