// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'chevron.left': 'chevron-left',
  'plus.circle.fill': 'add-circle',
  'waveform.path.ecg': 'insights',
  'heart.text.square.fill': 'workspace-premium',
  'clock.fill': 'history',
  'eye.fill': 'visibility',
  'eye.slash.fill': 'visibility-off',
  'person.fill': 'person',
  'gearshape.fill': 'settings',
  'bell.fill': 'notifications',
  'shield.fill': 'shield',
  'arrow.right.square.fill': 'logout',
  'play.circle.fill': 'play-circle-filled',
  'stop.circle.fill': 'stop-circle',
  'timer': 'timer',
  'note.text': 'edit-note',
  'arrow.counterclockwise': 'replay',
  'xmark.circle.fill': 'highlight-off',
  'flag.checkered': 'flag',
  'figure.strengthtraining.traditional': 'fitness-center',
  'target': 'gps-fixed',
  'scope': 'track-changes',
  'bed.double.fill': 'hotel',
  'star.fill': 'star',
  'figure.mixed.cardio': 'directions-run',
  'arrow.triangle.2.circlepath': 'sync',
  'square.grid.3x3.fill': 'grid-view',
  'shuffle': 'shuffle',
  'arrow.left.arrow.right': 'swap-horiz',
  'circle.fill': 'circle',
  'bolt.fill': 'bolt',
  'flame.fill': 'local-fire-department',
  'dumbbell.fill': 'fitness-center',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
