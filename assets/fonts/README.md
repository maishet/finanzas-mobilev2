# Fuentes del Proyecto

## Requeridas

### Space Grotesk (Títulos y Wordmark)
- Descargar desde: https://fonts.google.com/specimen/Space+Grotesk
- Variantes necesarias:
  - `SpaceGrotesk-Regular.ttf` (400)
  - `SpaceGrotesk-Medium.ttf` (500)
  - `SpaceGrotesk-Bold.ttf` (700)

### Inter (Contenido numérico y listas)
- Descargar desde: https://fonts.google.com/specimen/Inter
- Variantes necesarias:
  - `Inter-Regular.ttf` (400)
  - `Inter-Medium.ttf` (500)
  - `Inter-SemiBold.ttf` (600)
  - `Inter-Bold.ttf` (700)

## Configuracion Actual

Las fuentes ya estan configuradas en `tamagui.config.ts` y se cargan en `app/_layout.tsx` desde esta carpeta.

- `Space Grotesk`: titulos, wordmark y jerarquia principal.
- `Inter`: cuerpo, formularios, navegacion, numeros, importes y graficos.

Esta combinacion encaja con Fint porque Space Grotesk aporta identidad fintech moderna sin perder seriedad, mientras Inter mantiene alta legibilidad para datos financieros.

## Instalación

1. Descargar los archivos .ttf de Google Fonts
2. Colocar en esta carpeta (`assets/fonts/`)
3. Las fuentes se cargan automaticamente al iniciar la app

## Uso en componentes

```typescript
import { typography } from '@/src/theme/typography';

// Títulos (Space Grotesk)
<Text style={typography.scales.h1}>Mi Título</Text>

// Contenido numérico (Inter)
<Text style={typography.scales.body}>$1,234.56</Text>
```
