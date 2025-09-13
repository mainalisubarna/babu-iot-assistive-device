// Typography system based on SF Pro / Inter
export const Typography = {
  // Font Sizes
  display: {
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '600' as const,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600' as const,
  },
  cardStat: {
    fontSize: 36,
    lineHeight: 40,
    fontWeight: 'bold' as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500' as const,
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400' as const,
  },
  small: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600' as const,
  },
} as const;

// Spacing system based on 8px grid
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

// Border radius
export const BorderRadius = {
  card: 24,
  button: 20,
  input: 16,
  sheet: 28,
  chip: 16,
  circle: 999,
} as const;