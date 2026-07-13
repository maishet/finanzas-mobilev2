import { animations } from '@tamagui/config/v5-reanimated'
import { createSystemFont, createV5Theme, defaultChildrenThemes, defaultConfig } from '@tamagui/config/v5'
import { green, greenDark, red, redDark, yellow, yellowDark } from '@tamagui/colors'
import { v5ComponentThemes } from '@tamagui/themes/v5'
import { createTamagui } from 'tamagui'

const darkPalette = [
  'rgb(14, 38, 56)',
  'rgb(8, 28, 43)',
  'rgb(20, 42, 58)',
  'rgb(25, 52, 70)',
  'rgb(32, 71, 91)',
  'rgb(43, 88, 108)',
  'rgb(58, 109, 128)',
  'rgb(80, 132, 151)',
  'rgb(130, 160, 180)',
  'rgb(166, 198, 211)',
  'rgb(200, 228, 237)',
  'rgb(235, 248, 252)',
]

const lightPalette = [
  'rgb(255, 255, 255)',
  'rgb(242, 250, 253)',
  'rgb(240, 248, 252)',
  'rgb(215, 230, 240)',
  'rgb(201, 220, 232)',
  'rgb(184, 210, 222)',
  'rgb(159, 191, 204)',
  'rgb(131, 168, 183)',
  'rgb(110, 145, 160)',
  'rgb(66, 105, 120)',
  'rgb(40, 81, 97)',
  'rgb(15, 42, 56)',
]

const accentLight = {
  accent1: 'rgb(240, 248, 252)',
  accent2: 'rgb(230, 244, 248)',
  accent3: 'rgb(211, 238, 243)',
  accent4: 'rgb(184, 226, 233)',
  accent5: 'rgb(145, 211, 221)',
  accent6: 'rgb(99, 194, 207)',
  accent7: 'rgb(43, 175, 190)',
  accent8: 'rgb(0, 185, 210)',
  accent9: 'rgb(8, 126, 139)',
  accent10: 'rgb(6, 108, 120)',
  accent11: 'rgb(15, 80, 90)',
  accent12: 'rgb(15, 42, 56)',
}

const accentDark = {
  accent1: 'rgb(18, 48, 65)',
  accent2: 'rgb(20, 56, 73)',
  accent3: 'rgb(22, 68, 86)',
  accent4: 'rgb(27, 86, 102)',
  accent5: 'rgb(25, 113, 132)',
  accent6: 'rgb(20, 144, 164)',
  accent7: 'rgb(20, 160, 180)',
  accent8: 'rgb(0, 179, 201)',
  accent9: 'rgb(0, 200, 220)',
  accent10: 'rgb(51, 213, 229)',
  accent11: 'rgb(180, 235, 245)',
  accent12: 'rgb(235, 248, 252)',
}

const generatedThemes = createV5Theme({
  darkPalette,
  lightPalette,
  componentThemes: v5ComponentThemes,
  accent: {
    light: accentLight,
    dark: accentDark,
  },
  childrenThemes: {
    ...defaultChildrenThemes,
    warning: {
      light: yellow,
      dark: yellowDark,
    },
    error: {
      light: red,
      dark: redDark,
    },
    success: {
      light: green,
      dark: greenDark,
    },
  },
})

const themes = {
  ...generatedThemes,
  light: {
    ...generatedThemes.light,
    background: 'rgb(242, 250, 253)',
    color: 'rgb(15, 42, 56)',
    card: 'rgb(255, 255, 255)',
    cardForeground: 'rgb(15, 42, 56)',
    popover: 'rgb(255, 255, 255)',
    popoverForeground: 'rgb(15, 42, 56)',
    primary: 'rgb(8, 126, 139)',
    primaryForeground: 'rgb(255, 255, 255)',
    portfolio: 'hsl(186, 89%, 29%)',
    portfolioForeground: 'rgb(255, 255, 255)',
    secondary: 'rgb(230, 244, 248)',
    secondaryForeground: 'rgb(15, 80, 90)',
    muted: 'rgb(240, 248, 252)',
    mutedForeground: 'rgb(110, 145, 160)',
    accent: 'rgb(0, 185, 210)',
    accentForeground: 'rgb(255, 255, 255)',
    destructive: 'rgb(235, 87, 87)',
    borderColor: 'rgb(215, 230, 240)',
    input: 'rgb(215, 230, 240)',
    ring: 'rgb(8, 126, 139)',
    chart1: 'rgb(8, 126, 139)',
    chart2: 'rgb(0, 185, 210)',
    chart3: 'rgb(13, 148, 136)',
    chart4: 'rgb(245, 158, 11)',
    chart5: 'rgb(235, 87, 87)',
  },
  dark: {
    ...generatedThemes.dark,
    background: 'rgb(8, 28, 43)',
    color: 'rgb(235, 248, 252)',
    card: 'rgb(14, 38, 56)',
    cardForeground: 'rgb(235, 248, 252)',
    popover: 'rgb(18, 38, 55)',
    popoverForeground: 'rgb(235, 248, 252)',
    primary: 'rgb(0, 200, 220)',
    primaryForeground: 'rgb(8, 28, 43)',
    portfolio: 'hsl(185, 100%, 43%)',
    portfolioForeground: 'rgb(8, 28, 43)',
    secondary: 'rgb(18, 48, 65)',
    secondaryForeground: 'rgb(180, 235, 245)',
    muted: 'rgb(20, 42, 58)',
    mutedForeground: 'rgb(130, 160, 180)',
    accent: 'rgb(20, 160, 180)',
    accentForeground: 'rgb(255, 255, 255)',
    destructive: 'rgb(255, 100, 100)',
    borderColor: 'rgb(25, 52, 70)',
    input: 'rgb(25, 52, 70)',
    ring: 'rgb(0, 200, 220)',
    chart1: 'rgb(0, 200, 220)',
    chart2: 'rgb(20, 160, 180)',
    chart3: 'rgb(45, 212, 191)',
    chart4: 'rgb(251, 191, 36)',
    chart5: 'rgb(255, 100, 100)',
  },
}

const bodyFont = createSystemFont({
  font: {
    family: 'Inter',
    face: {
      400: { normal: 'InterRegular' },
      500: { normal: 'InterMedium' },
      600: { normal: 'InterSemiBold' },
      700: { normal: 'InterBold' },
    },
    weight: {
      1: '400',
      4: '400',
      5: '500',
      6: '600',
      7: '700',
    },
    letterSpacing: {
      1: 0,
      4: -0.05,
      6: -0.1,
      9: -0.2,
    },
  },
})

const headingFont = createSystemFont({
  font: {
    family: 'SpaceGrotesk',
    face: {
      400: { normal: 'SpaceGroteskRegular' },
      500: { normal: 'SpaceGroteskMedium' },
      600: { normal: 'SpaceGroteskSemiBold' },
      700: { normal: 'SpaceGroteskBold' },
    },
    weight: {
      1: '500',
      4: '500',
      6: '600',
      7: '700',
      9: '700',
    },
    letterSpacing: {
      4: -0.15,
      7: -0.4,
      9: -0.8,
      10: -1.2,
      12: -1.8,
    },
  },
  sizeLineHeight: (size) => Math.round(size * 1.12 + 4),
})

export const config = createTamagui({
  ...defaultConfig,
  animations,
  fonts: {
    ...defaultConfig.fonts,
    body: bodyFont,
    heading: headingFont,
  },
  themes,
})

export default config

export type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
