export interface ShortData {
  id: string;
  thumbnail: string;
  videoUrl: string;
  title: string;
  views: string;
}

export interface VideoData {
  id: string;
  type: 'video' | 'shortsRow';
  thumbnail?: string;
  videoUrl?: string;
  duration?: string;
  avatar?: string;
  title?: string;
  channelName?: string;
  views?: string;
  uploadTime?: string;
  shorts?: ShortData[];
}

export const SAMPLE_VIDEOS = [
  'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4',
  'https://raw.githubusercontent.com/mdn/learning-area/master/html/multimedia-and-embedding/video-and-audio-content/rabbit320.mp4',
  'https://test-videos.co.uk/vids/jellyfish/mp4/h264/720/Jellyfish_720_10s_1MB.mp4',
  'https://test-videos.co.uk/vids/sintel/mp4/h264/720/Sintel_720_10s_1MB.mp4'
];

const SAMPLE_VIDEO_URL = SAMPLE_VIDEOS[0];
const SAMPLE_SHORT_URL = SAMPLE_VIDEOS[1];

export const mockVideos: VideoData[] = [
  {
    id: '1',
    type: 'video',
    thumbnail: 'https://picsum.photos/seed/vid1/800/450',
    videoUrl: SAMPLE_VIDEOS[0],
    duration: '10:05',
    avatar: 'https://picsum.photos/seed/ava1/100/100',
    title: 'Building a High-Performance React Native App from Scratch',
    channelName: 'Tech Code',
    views: '1.2M views',
    uploadTime: '2 hours ago',
  },
  {
    id: '2',
    type: 'video',
    thumbnail: 'https://picsum.photos/seed/vid2/800/450',
    videoUrl: SAMPLE_VIDEOS[1],
    duration: '14:20',
    avatar: 'https://picsum.photos/seed/ava2/100/100',
    title: 'The Future of Mobile Development in 2026',
    channelName: 'Mobile Dev Daily',
    views: '850K views',
    uploadTime: '5 hours ago',
  },
  {
    id: '3',
    type: 'video',
    thumbnail: 'https://picsum.photos/seed/vid3/800/450',
    videoUrl: SAMPLE_VIDEOS[2],
    duration: '8:45',
    avatar: 'https://picsum.photos/seed/ava3/100/100',
    title: 'Top 10 VS Code Extensions for TypeScript',
    channelName: 'Coder Life',
    views: '200K views',
    uploadTime: '1 day ago',
  },
  {
    id: '4',
    type: 'shortsRow',
    shorts: Array.from({ length: 6 }).map((_, i) => ({
      id: `short_${i}`,
      thumbnail: `https://picsum.photos/seed/short${i}/400/700`,
      videoUrl: SAMPLE_VIDEOS[i % SAMPLE_VIDEOS.length],
      title: `Amazing UI Trick #${i + 1}`,
      views: `${Math.floor(Math.random() * 900 + 100)}K`,
    })),
  },
  {
    id: '5',
    type: 'video',
    thumbnail: 'https://picsum.photos/seed/vid5/800/450',
    videoUrl: SAMPLE_VIDEOS[3],
    duration: '22:15',
    avatar: 'https://picsum.photos/seed/ava5/100/100',
    title: 'Understanding React Native Reanimated Shared Values',
    channelName: 'UI Engineering',
    views: '54K views',
    uploadTime: '2 days ago',
  },
  {
    id: '6',
    type: 'video',
    thumbnail: 'https://picsum.photos/seed/vid6/800/450',
    videoUrl: SAMPLE_VIDEOS[0],
    duration: '5:30',
    avatar: 'https://picsum.photos/seed/ava6/100/100',
    title: 'Why I Switched to Expo SDK 52',
    channelName: 'Expo Fan',
    views: '120K views',
    uploadTime: '3 days ago',
  },
  {
    id: '7',
    type: 'video',
    thumbnail: 'https://picsum.photos/seed/vid7/800/450',
    videoUrl: SAMPLE_VIDEOS[1],
    duration: '18:10',
    avatar: 'https://picsum.photos/seed/ava7/100/100',
    title: 'Mastering FlashList for Smooth Scrolling',
    channelName: 'Shopify Devs',
    views: '300K views',
    uploadTime: '4 days ago',
  },
  {
    id: '8',
    type: 'video',
    thumbnail: 'https://picsum.photos/seed/vid8/800/450',
    videoUrl: SAMPLE_VIDEOS[2],
    duration: '12:00',
    avatar: 'https://picsum.photos/seed/ava8/100/100',
    title: 'Deep Dive into Gesture Handler v2',
    channelName: 'Native Ninjas',
    views: '80K views',
    uploadTime: '5 days ago',
  },
  {
    id: '9',
    type: 'video',
    thumbnail: 'https://picsum.photos/seed/vid9/800/450',
    videoUrl: SAMPLE_VIDEOS[3],
    duration: '11:45',
    avatar: 'https://picsum.photos/seed/ava9/100/100',
    title: 'Designing a Minimalist Video App Interface',
    channelName: 'Design Trends',
    views: '450K views',
    uploadTime: '1 week ago',
  },
  {
    id: '10',
    type: 'video',
    thumbnail: 'https://picsum.photos/seed/vid10/800/450',
    videoUrl: SAMPLE_VIDEOS[0],
    duration: '30:00',
    avatar: 'https://picsum.photos/seed/ava10/100/100',
    title: 'Full Course: Advanced React Native Architecture',
    channelName: 'Code Masterclass',
    views: '2.5M views',
    uploadTime: '2 weeks ago',
  },
  {
    id: '11',
    type: 'shortsRow',
    shorts: Array.from({ length: 6 }).map((_, i) => ({
      id: `short_b_${i}`,
      thumbnail: `https://picsum.photos/seed/shortb${i}/400/700`,
      videoUrl: SAMPLE_VIDEOS[(i + 1) % SAMPLE_VIDEOS.length],
      title: `Quick Tip: React Native #${i + 1}`,
      views: `${Math.floor(Math.random() * 900 + 100)}K`,
    })),
  },
  {
    id: '12',
    type: 'video',
    thumbnail: 'https://picsum.photos/seed/vid12/800/450',
    videoUrl: SAMPLE_VIDEOS[1],
    duration: '9:25',
    avatar: 'https://picsum.photos/seed/ava12/100/100',
    title: '10 Things You Did Not Know About TypeScript',
    channelName: 'TS Tips',
    views: '600K views',
    uploadTime: '3 weeks ago',
  },
  {
    id: '13',
    type: 'video',
    thumbnail: 'https://picsum.photos/seed/vid13/800/450',
    videoUrl: SAMPLE_VIDEOS[2],
    duration: '15:50',
    avatar: 'https://picsum.photos/seed/ava13/100/100',
    title: 'Building a Shared Element Transition from Scratch',
    channelName: 'Animation Guru',
    views: '150K views',
    uploadTime: '1 month ago',
  },
  {
    id: '14',
    type: 'video',
    thumbnail: 'https://picsum.photos/seed/vid14/800/450',
    videoUrl: SAMPLE_VIDEOS[3],
    duration: '7:15',
    avatar: 'https://picsum.photos/seed/ava14/100/100',
    title: 'Why Performance Matters in Mobile Apps',
    channelName: 'Tech Insights',
    views: '90K views',
    uploadTime: '1 month ago',
  },
  {
    id: '15',
    type: 'video',
    thumbnail: 'https://picsum.photos/seed/vid15/800/450',
    videoUrl: SAMPLE_VIDEOS[0],
    duration: '13:40',
    avatar: 'https://picsum.photos/seed/ava15/100/100',
    title: 'Reviewing the New iPhone Developer Tools',
    channelName: 'Gadget Review',
    views: '3.1M views',
    uploadTime: '2 months ago',
  },
  {
    id: '16',
    type: 'video',
    thumbnail: 'https://picsum.photos/seed/vid16/800/450',
    videoUrl: SAMPLE_VIDEOS[1],
    duration: '21:05',
    avatar: 'https://picsum.photos/seed/ava16/100/100',
    title: 'Advanced Animations in React Native',
    channelName: 'Motion UI',
    views: '240K views',
    uploadTime: '2 months ago',
  },
  {
    id: '17',
    type: 'video',
    thumbnail: 'https://picsum.photos/seed/vid17/800/450',
    videoUrl: SAMPLE_VIDEOS[2],
    duration: '16:30',
    avatar: 'https://picsum.photos/seed/ava17/100/100',
    title: 'Exploring Expo Router v3 Features',
    channelName: 'Expo Fan',
    views: '180K views',
    uploadTime: '3 months ago',
  },
  {
    id: '18',
    type: 'shortsRow',
    shorts: Array.from({ length: 6 }).map((_, i) => ({
      id: `short_c_${i}`,
      thumbnail: `https://picsum.photos/seed/shortc${i}/400/700`,
      videoUrl: SAMPLE_VIDEOS[(i + 2) % SAMPLE_VIDEOS.length],
      title: `Secret Dev Tool #${i + 1}`,
      views: `${Math.floor(Math.random() * 900 + 100)}K`,
    })),
  },
  {
    id: '19',
    type: 'video',
    thumbnail: 'https://picsum.photos/seed/vid19/800/450',
    videoUrl: SAMPLE_VIDEOS[3],
    duration: '8:55',
    avatar: 'https://picsum.photos/seed/ava19/100/100',
    title: 'Quick Guide to Memory Leaks in Mobile',
    channelName: 'Debug Master',
    views: '55K views',
    uploadTime: '3 months ago',
  },
  {
    id: '20',
    type: 'video',
    thumbnail: 'https://picsum.photos/seed/vid20/800/450',
    videoUrl: SAMPLE_VIDEOS[0],
    duration: '24:10',
    avatar: 'https://picsum.photos/seed/ava20/100/100',
    title: 'Complete Roadmap for React Native in 2026',
    channelName: 'Code Masterclass',
    views: '1.5M views',
    uploadTime: '4 months ago',
  }
];

export const mockCategories = [
  'All',
  'Gaming',
  'Music',
  'React Native',
  'Live',
  'Podcasts',
  'Coding',
  'Design',
  'News',
  'Sports',
];

export const shortsData: ShortData[] = [
  { id: 'sh1', thumbnail: 'https://picsum.photos/seed/short1/400/700', videoUrl: SAMPLE_VIDEOS[0], title: 'Cityscapes in Slow Motion', views: '4.5K' },
  { id: 'sh2', thumbnail: 'https://picsum.photos/seed/short2/400/700', videoUrl: SAMPLE_VIDEOS[1], title: 'Quantum Olimpes — Deep Dive', views: '12K' },
  { id: 'sh3', thumbnail: 'https://picsum.photos/seed/short3/400/700', videoUrl: SAMPLE_VIDEOS[2], title: 'Mars Surface Pulse', views: '8.3K' },
  { id: 'sh4', thumbnail: 'https://picsum.photos/seed/short4/400/700', videoUrl: SAMPLE_VIDEOS[3], title: 'Deep Space Photography Burst', views: '22K' },
  { id: 'sh5', thumbnail: 'https://picsum.photos/seed/short5/400/700', videoUrl: SAMPLE_VIDEOS[0], title: 'Neural Networks Explained in 60s', views: '45K' },
  { id: 'sh6', thumbnail: 'https://picsum.photos/seed/short6/400/700', videoUrl: SAMPLE_VIDEOS[1], title: 'Morning Routines of Top Devs', views: '9.1K' },
  { id: 'sh7', thumbnail: 'https://picsum.photos/seed/short7/400/700', videoUrl: SAMPLE_VIDEOS[2], title: 'Galaxy Formation Time-lapse', views: '31K' },
  { id: 'sh8', thumbnail: 'https://picsum.photos/seed/short8/400/700', videoUrl: SAMPLE_VIDEOS[3], title: 'React Native 0.76 — What\'s New', views: '17K' },
];
