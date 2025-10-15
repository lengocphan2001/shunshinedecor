import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { typography, spacing, useTheme } from '../../theme';

export interface BreadcrumbItem {
  id: string;
  label: string;
  onPress?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: 'chevron' | 'slash' | 'dot';
  maxItems?: number;
}

export default function Breadcrumb({ 
  items, 
  separator = 'chevron',
  maxItems 
}: BreadcrumbProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const getSeparatorIcon = () => {
    switch (separator) {
      case 'chevron':
        return 'chevron-right';
      case 'slash':
        return 'slash';
      case 'dot':
        return 'circle';
      default:
        return 'chevron-right';
    }
  };

  const renderSeparator = () => (
    <View style={styles.separatorContainer}>
      <FontAwesome5 
        name={getSeparatorIcon()} 
        size={separator === 'dot' ? 4 : 10} 
        color={colors.text.secondary} 
      />
    </View>
  );

  // Handle maxItems limit
  const displayItems = React.useMemo(() => {
    if (!maxItems || items.length <= maxItems) {
      return items;
    }

    // Show first item, ellipsis, and last items
    const firstItem = items[0];
    const lastItems = items.slice(-(maxItems - 1));
    
    return [
      firstItem,
      { id: 'ellipsis', label: '...', onPress: undefined },
      ...lastItems
    ];
  }, [items, maxItems]);

  const isLastItem = (index: number) => index === displayItems.length - 1;
  const isEllipsis = (item: BreadcrumbItem) => item.id === 'ellipsis';

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {displayItems.map((item, index) => (
          <View key={item.id} style={styles.itemContainer}>
            {isEllipsis(item) ? (
              <Text style={styles.ellipsisText}>{item.label}</Text>
            ) : (
              <TouchableOpacity
                onPress={item.onPress}
                disabled={isLastItem(index) || !item.onPress}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.itemText,
                    isLastItem(index) ? styles.activeItemText : styles.parentItemText,
                    !item.onPress && styles.disabledItemText,
                  ]}
                  numberOfLines={1}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
            
            {!isLastItem(index) && renderSeparator()}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    ...typography.styles.textMedium,
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '400',
  },
  activeItemText: {
    color: colors.text.secondary,
    fontWeight: '400',
  },
  parentItemText: {
    color: colors.text.primary,
    fontWeight: 'bold',
  },
  disabledItemText: {
    color: colors.text.secondary,
  },
  ellipsisText: {
    ...typography.styles.textMedium,
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '400',
  },
  separatorContainer: {
    marginHorizontal: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

