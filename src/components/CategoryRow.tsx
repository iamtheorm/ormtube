import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { mockCategories } from '../data/mockData';

export const CategoryRow = () => {
  const [selected, setSelected] = useState('All');

  const renderItem = ({ item }: { item: string }) => {
    const isSelected = item === selected;
    return (
      <TouchableOpacity 
        style={[styles.pill, isSelected && styles.pillSelected]} 
        onPress={() => setSelected(item)}
        activeOpacity={0.7}
      >
        <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlashList
        data={mockCategories}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        estimatedItemSize={80}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#1F1F23',
    backgroundColor: '#0A0A0C',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pill: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillSelected: {
    backgroundColor: '#FFFFFF',
  },
  pillText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  pillTextSelected: {
    color: '#0A0A0C',
  },
});
