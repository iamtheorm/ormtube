import React, { createContext, useContext, useState } from 'react';
import { VideoData, ShortData } from '../data/mockData';

export type VideoLayout = {
  x: number;
  y: number;
  width: number;
  height: number;
};

interface OverlayContextData {
  selectedVideo: VideoData | null;
  videoLayout: VideoLayout | null;
  openWatchScreen: (video: VideoData, layout: VideoLayout) => void;
  closeWatchScreen: () => void;
  
  shortsData: ShortData[] | null;
  selectedShortIndex: number | null;
  openShortsViewer: (shorts: ShortData[], startIndex: number) => void;
  closeShortsViewer: () => void;
}

const OverlayContext = createContext<OverlayContextData | null>(null);

export const OverlayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [videoLayout, setVideoLayout] = useState<VideoLayout | null>(null);
  
  const [shortsData, setShortsData] = useState<ShortData[] | null>(null);
  const [selectedShortIndex, setSelectedShortIndex] = useState<number | null>(null);

  const openWatchScreen = (video: VideoData, layout: VideoLayout) => {
    setSelectedVideo(video);
    setVideoLayout(layout);
  };

  const closeWatchScreen = () => {
    setSelectedVideo(null);
    setVideoLayout(null);
  };

  const openShortsViewer = (shorts: ShortData[], startIndex: number) => {
    setShortsData(shorts);
    setSelectedShortIndex(startIndex);
  };

  const closeShortsViewer = () => {
    setShortsData(null);
    setSelectedShortIndex(null);
  };

  return (
    <OverlayContext.Provider value={{
      selectedVideo,
      videoLayout,
      openWatchScreen,
      closeWatchScreen,
      shortsData,
      selectedShortIndex,
      openShortsViewer,
      closeShortsViewer,
    }}>
      {children}
    </OverlayContext.Provider>
  );
};

export const useOverlay = () => {
  const context = useContext(OverlayContext);
  if (!context) throw new Error('useOverlay must be used within an OverlayProvider');
  return context;
};
