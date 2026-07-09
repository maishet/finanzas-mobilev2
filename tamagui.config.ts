import { animations } from '@tamagui/config/v5-reanimated'
import { createSystemFont, createV5Theme, defaultChildrenThemes, defaultConfig } from '@tamagui/config/v5'
import { green, greenDark, red, redDark, yellow, yellowDark } from '@tamagui/colors'
import { v5ComponentThemes } from '@tamagui/themes/v5'
import { createTamagui } from 'tamagui'

const darkPalette = [
  'hsla(209, 38%, 7%, 1)',
  'hsla(209, 34%, 10%, 1)',
  'hsla(208, 30%, 14%, 1)',
  'hsla(207, 27%, 18%, 1)',
  'hsla(207, 24%, 23%, 1)',
  'hsla(206, 22%, 29%, 1)',
  'hsla(205, 20%, 37%, 1)',
  'hsla(205, 18%, 47%, 1)',
  'hsla(205, 16%, 59%, 1)',
  'hsla(205, 18%, 72%, 1)',
  'hsla(205, 28%, 88%, 1)',
  'hsla(205, 45%, 97%, 1)',
]

const lightPalette = [
  'hsla(206, 30%, 97%, 1)',
  'hsla(205, 28%, 95%, 1)',
  'hsla(205, 26%, 92%, 1)',
  'hsla(205, 24%, 89%, 1)',
  'hsla(205, 22%, 85%, 1)',
  'hsla(205, 22%, 78%, 1)',
  'hsla(205, 20%, 70%, 1)',
  'hsla(205, 18%, 62%, 1)',
  'hsla(205, 16%, 54%, 1)',
  'hsla(205, 18%, 46%, 1)',
  'hsla(205, 24%, 26%, 1)',
  'hsla(205, 30%, 13%, 1)',
]

const accentLight = {
  accent1: 'hsla(205, 100%, 98%, 1)',
  accent2: 'hsla(204, 92%, 95%, 1)',
  accent3: 'hsla(203, 88%, 91%, 1)',
  accent4: 'hsla(203, 85%, 85%, 1)',
  accent5: 'hsla(202, 82%, 77%, 1)',
  accent6: 'hsla(201, 78%, 68%, 1)',
  accent7: 'hsla(200, 75%, 58%, 1)',
  accent8: 'hsla(203, 80%, 48%, 1)',
  accent9: 'hsla(205, 90%, 42%, 1)',
  accent10: 'hsla(207, 92%, 36%, 1)',
  accent11: 'hsla(210, 80%, 32%, 1)',
  accent12: 'hsla(214, 65%, 14%, 1)',
}
 
const accentDark = {
  accent1: 'hsla(215, 45%, 8%, 1)',
  accent2: 'hsla(213, 42%, 11%, 1)',
  accent3: 'hsla(211, 40%, 15%, 1)',
  accent4: 'hsla(209, 40%, 20%, 1)',
  accent5: 'hsla(207, 42%, 26%, 1)',
  accent6: 'hsla(205, 46%, 33%, 1)',
  accent7: 'hsla(203, 52%, 42%, 1)',
  accent8: 'hsla(201, 60%, 50%, 1)',
  accent9: 'hsla(199, 85%, 58%, 1)',
  accent10: 'hsla(197, 90%, 66%, 1)',
  accent11: 'hsla(195, 85%, 78%, 1)',
  accent12: 'hsla(195, 90%, 94%, 1)',
}

const themes = createV5Theme({
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
