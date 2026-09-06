# OrmTube

A **video-first React Native application** built with Expo, featuring a custom Overlay Architecture that keeps video playback alive across all navigation transitions. Designed around a "Magical Darkroom" aesthetic with deep matte black backgrounds, purple accents, and gold highlights.

---

## 📱 Screenshots

| Home | Moments | Subscriptions | Library |
|------|---------|---------------|---------|
| Video feed with inline actions | Vertical short-form video player | Subscribed channels | Playlists & collections |

---

## ✨ Features

### 🎬 Custom Overlay Architecture
- A global `OverlayProvider` manages the `WatchOverlay` and `ShortsViewer` outside the navigation stack — **videos never unmount on tab switch**.
- The `WatchOverlay` floats and docks above the `BottomTabBar` as a persistent mini-player.

### 🏠 Home Screen
- Performant vertical feed using `FlashList` with pull-to-refresh (`RefreshControl`).
- Horizontal **MOMENTS** (Shorts) row embedded directly in the feed.
- Category filter row (All, Gaming, Music, React Native, etc.).
- Each video card features an **inline action bar** with dynamic Like, Share, and Volume buttons.
- Glassmorphic header with the OrmTube logo (purple + gold typography).

### ▶️ Watch Screen (Overlay)
- Gesture-driven player: **drag down** to minimize, **drag up** to expand.
- Smooth spring-physics animation powered by `react-native-reanimated`.
- Ambient purple gradient glow behind the player.
- Animated **skeleton loaders** for recommendations (built with `withRepeat`/`withSequence`).
- Full action bar: Like (gold), Dislike, Share, Save, Subscribe (toggles).
- Haptic feedback on all interactions via `expo-haptics`.

### ⚡ Moments (Shorts)
- Full-screen vertical paging feed powered by `FlashList`.
- Precise item height calculated using `useSafeAreaInsets` — **no frame overlap**.
- Video lifecycle strictly managed: only the **active visible item** plays, all others pause.
- Gold **progress bar** with real-time scrubbing via `PanResponder`.
- Time display: current position / total duration.
- Tap anywhere to pause/resume.

### 👤 Subscriptions
- Horizontally scrolling channel list extracted from mock data.
- Live indicators on active channels.

### 📚 Library
- History, Downloads, Your Videos, and custom Playlists.
- "New Playlist" quick action with gold accent.

### 🎨 Design System
| Token | Value |
|-------|-------|
| Background | `#0A0A0C` |
| Purple Primary | `#7F00FF` |
| Purple Light | `#C3B1E1` / `#CF9FFF` |
| Gold Accent | `#FFB800` |
| Card Background | `#121215` |

---

## 🛠 Tech Stack

| Library | Purpose |
|---------|---------|
| `expo` (v57) | App framework and managed workflow |
| `expo-video` | Native video playback |
| `expo-image` | High-performance image rendering with disk cache |
| `expo-haptics` | Tactile feedback |
| `expo-linear-gradient` | Smooth UI gradient effects |
| `react-native-reanimated` | Gesture-driven animations |
| `react-native-gesture-handler` | Swipe/pan gestures |
| `@shopify/flash-list` | Performant list rendering |
| `react-native-safe-area-context` | Safe area insets for precise layout |
| `@expo/vector-icons` (Feather) | Icon set |

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 20
- [Expo Go](https://expo.dev/client) on your iOS/Android device, or an iOS Simulator

### Install & Run

```bash
# Clone the repo
git clone https://github.com/iamtheorm/ormtube.git
cd ormtube

# Install dependencies
npm install

# Start the dev server
npx expo start

# Or start with a clean Metro cache
npx expo start --clear
```

Then:
- **iOS Simulator**: Press `i` in the terminal
- **Physical device**: Scan the QR code with the Expo Go app

---

## 📁 Project Structure

```
ormtube/
├── App.tsx                    # Root: SafeAreaProvider, navigation state, overlays
├── index.ts                   # Entry point
├── src/
│   ├── components/
│   │   ├── BottomTabBar.tsx   # Animated tab bar (Home, Moments, Subs, Library)
│   │   ├── CategoryRow.tsx    # Horizontal filter chips
│   │   ├── ShortsRow.tsx      # Embedded MOMENTS preview strip in Home feed
│   │   ├── VideoCard.tsx      # Feed video card with inline action bar
│   │   └── WatchOverlay.tsx   # Gesture-driven full/mini video player
│   ├── data/
│   │   └── mockData.ts        # Type definitions + 20 mock videos + 8 shorts
│   ├── screens/
│   │   ├── HomeScreen.tsx     # Main video feed
│   │   ├── MomentsScreen.tsx  # Full-screen vertical shorts feed
│   │   ├── ShortsViewer.tsx   # Overlay shorts viewer (launched from Home)
│   │   ├── SubscriptionsScreen.tsx
│   │   └── LibraryScreen.tsx
│   └── utils/
│       └── OverlayContext.tsx # Global state for WatchOverlay & ShortsViewer
├── assets/                    # App icons & splash
├── app.json                   # Expo config
├── package.json
└── tsconfig.json
```

---

## ⚠️ Known Warnings

- **`EBADENGINE`**: Node v20.19.0 is slightly below the `metro` package requirement (≥ 20.19.4). The app works fine — upgrade Node to resolve the warning.
- **`@babel/runtime/regenerator`**: Non-breaking Babel resolution fallback. Does not affect functionality.

---

## 📄 License

MIT
