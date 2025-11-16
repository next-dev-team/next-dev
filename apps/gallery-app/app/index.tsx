import * as React from 'react';
import { View, Image, Platform } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Button } from '@/registry/new-york/components/ui/button';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';

export default function Index() {
  const [assets, setAssets] = React.useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [mode, setMode] = React.useState<'next' | 'random'>('next');
  const [permission, requestPermission] = MediaLibrary.usePermissions();
  const [isMediaLibraryAvailable, setIsMediaLibraryAvailable] = React.useState<boolean | null>(
    null,
  );

  React.useEffect(() => {
    let mounted = true;
    MediaLibrary.isAvailableAsync().then((available) => {
      if (mounted) setIsMediaLibraryAvailable(available);
    });
    return () => {
      mounted = false;
    };
  }, []);

  React.useEffect(() => {
    if (isMediaLibraryAvailable === false && Platform.OS === 'web') {
      return;
    }
    if (isMediaLibraryAvailable && permission?.granted) {
      MediaLibrary.getAssetsAsync({
        mediaType: MediaLibrary.MediaType.photo,
        sortBy: MediaLibrary.SortBy.creationTime,
        first: 500,
      })
        .then((res) => {
          const uris = res.assets.map((a) => a.uri).filter(Boolean);
          setAssets(uris);
          setCurrentIndex(0);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [isMediaLibraryAvailable, permission?.granted]);

  React.useEffect(() => {
    if (!assets.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (mode === 'next') {
          return (prev + 1) % assets.length;
        }
        let next = prev;
        if (assets.length > 1) {
          while (next === prev) {
            next = Math.floor(Math.random() * assets.length);
          }
        }
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [assets, mode]);

  const pickImagesWeb = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    } as any);
    if (!result.canceled && result.assets?.length) {
      const uris = result.assets.map((a) => a.uri).filter(Boolean);
      setAssets(uris);
      setCurrentIndex(0);
    }
  };

  const showPermissionUI = isMediaLibraryAvailable && !permission?.granted;
  const showWebPickerUI =
    isMediaLibraryAvailable === false && Platform.OS === 'web' && assets.length === 0;

  return (
    <View className="flex-1 items-center justify-center gap-4 p-6">
      <Text variant="h1">Gallery</Text>
      {showPermissionUI && (
        <Button onPress={() => requestPermission?.()}>
          <Text>Allow Gallery Access</Text>
        </Button>
      )}
      {showWebPickerUI && (
        <Button onPress={pickImagesWeb}>
          <Text>Select Images</Text>
        </Button>
      )}
      <View className="aspect-[4/3] w-full max-w-3xl items-center justify-center">
        {assets.length > 0 ? (
          <Image
            source={{ uri: assets[currentIndex] }}
            className="h-full w-full rounded-xl"
            resizeMode="cover"
          />
        ) : (
          <Text>No images loaded</Text>
        )}
      </View>
      <View className="flex-row gap-2">
        <Button onPress={() => setMode('next')}>
          <Text>Mode: Next</Text>
        </Button>
        <Button onPress={() => setMode('random')}>
          <Text>Mode: Random</Text>
        </Button>
      </View>
    </View>
  );
}
