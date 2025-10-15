# Theme Configuration

Theme được cấu hình theo quy tắc giao diện của SunShine Decor.

## Quy tắc giao diện

- **Font**: SF Pro Display Medium 12pt, SF Pro Text Light 9pt, SF Pro Text Light 8pt
- **Màu**: Primary #007AFF, Success #34C759, Warning #FF9500, Danger #FF3B30, Neutral #8E8E93, Divider #E5E5EA, Background #FFFFFF
- **Style**: Kính mờ (frosted glass), shadow rgba(0,0,0,0.08)
- **Layout**: Top bar 48px – Content 75% – Footer 60px (ẩn/hiện tự động)

## Cách sử dụng

### Import theme

```typescript
import theme from '@/theme';
// hoặc
import { colors, typography, spacing, shadows } from '@/theme';
```

### Sử dụng colors

```typescript
import { colors } from '@/theme';

<View style={{ backgroundColor: colors.primary }}>
  <Text style={{ color: colors.text.white }}>Hello</Text>
</View>
```

### Sử dụng typography

```typescript
import { typography } from '@/theme';

<Text style={typography.styles.displayMedium}>
  Heading Text
</Text>

<Text style={typography.styles.textMedium}>
  Body Text
</Text>
```

### Sử dụng spacing

```typescript
import { spacing } from '@/theme';

<View style={{
  padding: spacing.md,
  marginTop: spacing.layout.topBar,
  borderRadius: spacing.borderRadius.medium,
}}>
  Content
</View>
```

### Sử dụng shadows

```typescript
import { shadows } from '@/theme';

<View style={{
  
  backgroundColor: colors.background,
}}>
  Card with shadow
</View>
```

### Sử dụng frosted glass effect

```typescript
import { frostedGlass } from '@/theme';

<View style={{
  ...frostedGlass,
  padding: spacing.md,
}}>
  Frosted glass container
</View>
```

## Cấu trúc file

- `colors.ts` - Định nghĩa màu sắc
- `typography.ts` - Định nghĩa fonts và text styles
- `spacing.ts` - Định nghĩa spacing, layout dimensions
- `shadows.ts` - Định nghĩa shadow styles
- `effects.ts` - Định nghĩa frosted glass và blur effects
- `index.ts` - Export tất cả theme configs

