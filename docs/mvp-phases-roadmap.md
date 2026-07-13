# Fint MVP Mobile v2 Roadmap

Este documento detalla las fases del MVP de `finanzas-mobilev2`, tomando como referencia el documento original `E:\Personal proyects\finanzas-mobile\docs\mvp-compact-fint.md` y el estado actual del nuevo proyecto creado desde cero con Expo Router, Tamagui, Supabase Auth y `finanzas-api` como backend asociado.

## Objetivo Del MVP

Construir una version limpia, moderna y estable de Fint Mobile para Android e iOS. El MVP debe validar la experiencia principal de finanzas personales por usuario: autenticacion, dashboard financiero, cuentas, movimientos, categorias, deudas, sincronizacion con backend y preparacion para pendientes detectados por Gmail.

El objetivo no es replicar toda la app anterior, sino reconstruir el producto con una base tecnica y visual consistente:

- App mobile-first con Expo y React Native.
- Navegacion con Expo Router.
- UI con Tamagui y wrappers propios `Fint*`.
- Tema fintech minimalista claro/oscuro.
- Auth con Supabase.
- Datos de negocio desde `finanzas-api`.
- Contratos alineados al backend existente.
- Preparacion para EAS Build.

## Principios De Alcance

- `finanzas-mobilev2` es solo mobile; no desarrolla una API nueva.
- `finanzas-api` sigue siendo el backend objetivo y fuente de contratos.
- El cliente mobile nunca debe usar service role.
- Todos los endpoints privados deben usar `Authorization: Bearer <supabase_access_token>`.
- El modelo debe ser user-owned, sin tenants.
- Las pantallas consumen UI por wrappers `src/ui/Fint*` cuando aplique.
- Los selectores criticos deben favorecer bottom sheets custom simples sobre selects complejos si hay riesgo en Android.
- Gmail y pendientes son fase posterior al core financiero.

## Estado Actual Del Proyecto

Ya existe base funcional en `E:\Personal proyects\finanzas-mobilev2`:

- Proyecto generado con template Tamagui Expo Router.
- Expo SDK 55, React 19, React Native 0.83, Tamagui 2.
- TypeScript strict.
- Supabase JS configurado.
- Session storage con `expo-secure-store` en nativo y storage web seguro para SSR.
- `AuthProvider` inicial.
- Login/register/Google OAuth inicial.
- Callback OAuth físico en `app/auth/callback.tsx`.
- Tabs principales: dashboard, cuentas, movimientos, deudas.
- Formularios base: cuenta y movimiento.
- Cliente API centralizado en `src/api/client.ts`.
- i18n ES/EN base.
- Tema claro/oscuro personalizado con Tamagui `createV5Theme`.
- Wrappers base: `FintButton`, `FintCard`, `FintInput`, `FintSheetSelect`.
- Documento de vision de producto en `docs/fint-product-vision.md`.

Validaciones recientes:

- `bun run typecheck`: OK.
- `bunx expo-doctor`: OK.

## Fase 1: Base App

### Objetivo

Dejar una base mobile limpia, estable y mantenible para construir el MVP sin arrastrar deuda de la app anterior.

### Alcance

- Crear el proyecto desde cero con Tamagui Expo Router template.
- Configurar TypeScript strict.
- Configurar `app.json` con nombre, slug, scheme, package Android y bundle iOS.
- Configurar `userInterfaceStyle: automatic`.
- Configurar Tamagui Provider.
- Configurar tema claro/oscuro.
- Configurar i18n ES/EN.
- Configurar TanStack Query.
- Crear estructura `app/` y `src/` recomendada.
- Crear wrappers UI `Fint*` desde el inicio.
- Crear README, `.env.example` y `eas.json` base.

### Entregables

- `app/_layout.tsx` con providers globales.
- `src/providers/AppProviders.tsx`.
- `tamagui.config.ts`.
- `src/i18n/index.ts`.
- `src/ui/FintButton.tsx`.
- `src/ui/FintCard.tsx`.
- `src/ui/FintInput.tsx`.
- `src/ui/FintSheetSelect.tsx`.
- `.env.example`.
- `eas.json`.

### Criterios De Aceptacion

- La app arranca con `bun run start`.
- TypeScript compila sin errores.
- Expo Doctor no reporta problemas bloqueantes.
- Hay modo claro/oscuro automatico.
- La navegacion base existe.
- No hay dependencia de la app mobile anterior.

### Estado

Completada en la base actual. Puede requerir ajustes visuales incrementales durante el resto del MVP.

## Fase 2: Identidad Visual Y Design System MVP

### Objetivo

Definir una experiencia visual fintech minimalista, moderna y consistente, que haga que Fint se sienta confiable, simple y facil de entender.

### Alcance

- Documentar la vision de producto y diseno.
- Refinar paleta claro/oscuro.
- Definir accent principal azul/cian.
- Definir componentes base homogeneos.
- Aplicar tokens del theme en wrappers.
- Mantener diferencias claras entre fondo, superficie, borde, texto y accion.
- Preparar componentes para graficos financieros futuros.

### Entregables

- `docs/fint-product-vision.md`.
- `tamagui.config.ts` con paletas y accent.
- Wrappers visuales consistentes.
- Login redisenado como primera experiencia de marca.

### Criterios De Aceptacion

- Modo claro y oscuro se ven consistentes.
- Botones, cards, inputs y estados vacios usan tokens del theme.
- No hay colores primarios dispersos sin justificacion.
- La identidad visual comunica fintech, simplicidad y control.

### Estado

En progreso avanzado. El theme y login ya fueron mejorados, pero aun falta aplicar la misma calidad visual a dashboard, cuentas, movimientos, deudas y graficos.

## Fase 3: Auth Real

### Objetivo

Permitir que el usuario pueda registrarse, iniciar sesion, entrar con Google, mantener sesion y cerrar sesion de forma segura usando Supabase Auth.

### Alcance

- Configurar Supabase Auth email/password.
- Configurar Google Provider en Supabase.
- Configurar redirects permitidos.
- Implementar `AuthProvider`.
- Implementar `app/login.tsx`.
- Implementar `app/auth/callback.tsx`.
- Persistir sesion en nativo con `expo-secure-store`.
- Persistir sesion web con storage seguro.
- Manejar errores de auth con mensajes amigables.
- Redirigir segun estado de sesion.
- Desloguear correctamente.

### Configuracion Externa Requerida

Supabase Auth URL Configuration debe permitir:

```text
finanzasmobilev2://auth/callback
```

Google Cloud debe permitir el callback de Supabase:

```text
https://<project-ref>.supabase.co/auth/v1/callback
```

Variables mobile:

```env
EXPO_PUBLIC_API_URL=https://finanzas-api-ansq.onrender.com
EXPO_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon-or-publishable-key>
```

### Entregables

- `src/auth/supabase.ts`.
- `src/auth/sessionStorage.ts`.
- `src/auth/AuthProvider.tsx`.
- `app/login.tsx`.
- `app/auth/callback.tsx`.

### Criterios De Aceptacion

- Usuario puede registrarse con email/password.
- Usuario puede iniciar sesion con email/password.
- Usuario puede iniciar sesion con Google Account.
- Sesion persiste al cerrar/reabrir app.
- Logout limpia la sesion.
- Usuario autenticado entra a tabs.
- Usuario sin sesion vuelve a login.
- Errores comunes se muestran en lenguaje claro.

### Pruebas Manuales

- Crear usuario nuevo.
- Iniciar sesion con credenciales validas.
- Probar password incorrecto.
- Probar correo no confirmado si aplica.
- Cerrar y abrir la app.
- Cerrar sesion.
- Probar OAuth Google en build nativo o dev client.

### Estado

En progreso. La implementacion base existe y el login fue redisenado. Falta validacion completa en dispositivo real/emulador con las variables ya configuradas.

## Fase 4: Contratos Finance Mobile

### Objetivo

Alinear el modelo mobile con los contratos existentes de `finanzas-api`, evitando crear un modelo paralelo o incompatible.

### Alcance

- Revisar endpoints disponibles en `finanzas-api`.
- Definir interfaces mobile para cuentas, movimientos, categorias, resumen, deudas y pendientes.
- Crear mappers para aislar diferencias entre backend y UI.
- Validar payloads con Zod donde aplique.
- Centralizar formato de dinero y fechas.
- Manejar envelope `{ ok, data }` y errores `{ ok, error, message }`.

### Endpoints Core

- `GET /api/me`.
- `GET /api/accounts`.
- `POST /api/accounts`.
- `GET /api/summary`.
- `GET /api/transactions`.
- `POST /api/transactions`.
- `PATCH /api/transactions/:id`.
- `DELETE /api/transactions/:id`.
- `GET /api/categories`.
- `POST /api/categories`.
- `GET /api/debts`.
- `POST /api/debts/:id/pay`.

### Entregables

- `src/api/types.ts` completo.
- `src/api/mappers.ts` completo.
- Schemas Zod para payloads clave.
- Helpers para money/date.
- Manejo estandarizado de errores API.

### Criterios De Aceptacion

- Los tipos mobile reflejan contratos reales.
- Las pantallas no dependen de campos ambiguos.
- Los formularios envian payloads validos.
- Los errores de backend se muestran de forma util.
- 401 invalida sesion y redirige correctamente.

### Estado

Parcial. Existen `client.ts`, `types.ts` y `mappers.ts` iniciales. Falta completar tipos/mappers contra respuestas reales del backend.

## Fase 5: Asociacion Con Backend Existente

### Objetivo

Conectar el mobile MVP con `finanzas-api` como backend real del producto.

### Alcance

- Usar `EXPO_PUBLIC_API_URL` por ambiente.
- Enviar Bearer token de Supabase en requests privados.
- Manejar `401 invalid_token` con logout automatico.
- Validar `GET /api/me` al iniciar sesion.
- Definir estrategia para Render Free si el backend duerme.
- Mostrar estados de carga cuando Render despierte lento.

### Entregables

- `src/api/client.ts` robusto.
- Hooks o query functions por dominio.
- Manejo de errores y retry razonable.
- Estado global de sesion invalidada.

### Criterios De Aceptacion

- Mobile puede consumir endpoints privados con token real.
- Si el token expira, la app reacciona sin quedarse rota.
- Si backend esta dormido o lento, UI muestra loading/error claro.
- No hay service role ni secrets privados en mobile.

### Estado

Parcial. El cliente API ya existe y envia Bearer token. Falta robustecer hooks, errores, loading y validacion con datos reales.

## Fase 6: UI Funcional Core

### Objetivo

Construir las pantallas principales del MVP con datos reales, buena distribucion visual y acciones esenciales.

### Alcance

- Dashboard financiero basico.
- Tabs Inicio, Cuentas, Movimientos, Deudas.
- Formularios de cuenta y movimiento.
- Selectores de cuenta y categoria.
- Categorias con emoji.
- Toasts in-app.
- Empty states utiles para usuario nuevo.
- Loading states y error states.
- Pull-to-refresh si aplica.

### Dashboard

Debe mostrar:

- Patrimonio o balance total.
- Ingresos del mes.
- Gastos del mes.
- Ahorro o flujo neto.
- Deudas activas.
- Acciones rapidas.
- Pendientes destacados cuando exista fase Gmail.

### Cuentas

Debe permitir:

- Listar cuentas.
- Crear cuenta.
- Ver balance por cuenta.
- Identificar tipo de cuenta.
- Preparar edicion posterior.

### Movimientos

Debe permitir:

- Listar movimientos.
- Crear ingreso.
- Crear gasto.
- Ver categoria, cuenta, monto, fecha y nota.
- Filtrar por mes como minimo.
- Preparar edicion/eliminacion.

### Categorias

Debe permitir:

- Listar categorias por tipo.
- Crear categoria.
- Asociar emoji.
- Usar categoria en movimientos.

### Deudas

Debe permitir:

- Listar deudas.
- Registrar pago.
- Mostrar estado de deuda.
- Asociar cuenta de pago.

### Criterios De Aceptacion

- Usuario nuevo entiende que debe crear una cuenta inicial.
- Usuario puede crear una cuenta.
- Usuario puede crear ingreso y gasto.
- Dashboard refleja datos reales.
- Las pantallas no se sienten vacias ni tecnicas.
- La UI mantiene consistencia en claro/oscuro.

### Estado

Parcial. Existen tabs y formularios base, pero requieren selectors reales, estados de carga, mappers completos y mejor UI de dominio.

## Fase 7: Onboarding Y Primer Uso

### Objetivo

Reducir friccion para usuarios nuevos y asegurar que puedan obtener valor en minutos.

### Alcance

- Detectar usuario sin cuentas.
- Sugerir crear primera cuenta.
- Sugerir moneda base.
- Crear categorias base o sugerirlas.
- Explicar conceptos sin tecnicismos.
- Preparar estados vacios accionables.

### Entregables

- Empty states accionables.
- Pantalla o flujo de onboarding simple.
- CTA para primera cuenta.
- CTA para primer movimiento.

### Criterios De Aceptacion

- Usuario nuevo sabe que hacer despues de registrarse.
- Usuario puede completar el primer flujo sin ayuda.
- Dashboard no se ve roto sin datos.

### Estado

Pendiente.

## Fase 8: Gmail Y Pendientes

### Objetivo

Agregar la capacidad de revisar pendientes detectados por Gmail sin que Gmail bloquee el MVP core.

### Alcance

- Consumir `GET /api/pending-movements`.
- Confirmar pendiente con `POST /api/pending-movements/:id/confirm`.
- Descartar pendiente con `POST /api/pending-movements/:id/discard`.
- Mostrar fuentes Gmail conectadas.
- Iniciar OAuth Gmail con endpoint existente.
- Sync manual Gmail.
- Supabase Realtime en `pending_movements` filtrado por `user_id`.

### Endpoints Gmail/Pendientes

- `GET /api/pending-movements`.
- `POST /api/pending-movements/:id/confirm`.
- `POST /api/pending-movements/:id/discard`.
- `GET /api/integrations/gmail/oauth/start`.
- `POST /api/integrations/gmail/sync`.
- `GET /api/integrations/sources/gmail`.
- `DELETE /api/integrations/sources/gmail/:id`.

### Criterios De Aceptacion

- Usuario ve pendientes detectados.
- Usuario confirma pendiente y se crea movimiento real.
- Usuario descarta pendiente.
- Realtime actualiza pendientes sin polling donde aporte valor.
- Gmail no crea movimientos directamente sin confirmacion del usuario.

### Estado

Pendiente. Debe iniciar despues del core financiero.

## Fase 9: EAS, QA Y Builds Mobile

### Objetivo

Generar builds instalables y validar la experiencia real en Android e iOS.

### Alcance

- Configurar EAS project real.
- Completar `extra.eas.projectId` si aplica.
- Build Android preview.
- Build iOS preview si hay acceso.
- Validar deep links en build nativo.
- Validar Google login fuera de Expo Go.
- Validar Supabase redirects.
- Validar modo claro/oscuro en dispositivo real.
- Validar tamanos pequenos.

### Comandos De Validacion

```bash
bun run typecheck
bunx expo-doctor
bun run build:web
eas build --platform android --profile preview
```

### Criterios De Aceptacion

- Build Android preview generado.
- Login email/password funciona en build.
- Google OAuth funciona en build.
- Deep link abre `app/auth/callback.tsx`.
- Sesion persiste despues de cerrar app.
- No hay crashes en formularios basicos.

### Estado

Pendiente. `eas.json` existe, pero falta configurar proyecto EAS real y generar builds.

## Fase 10: Calidad, Seguridad Y Preparacion Beta

### Objetivo

Preparar la app para pruebas beta con usuarios reales sin comprometer seguridad ni experiencia.

### Alcance

- Revisar que no existan secrets privados en mobile.
- Confirmar RLS y ownership en backend asociado.
- Revisar que mobile use solo anon/publishable key.
- Manejar errores globales.
- Agregar logging basico o Sentry si se decide.
- Agregar tests minimos para mappers y API client.
- Revisar performance inicial.
- Revisar accesibilidad basica.

### Seguridad Supabase Relevante

- Nunca exponer service role en mobile.
- No usar `user_metadata` para autorizacion.
- RLS debe filtrar por `user_id` en tablas de negocio.
- Las policies deben usar ownership, no solo `TO authenticated`.
- Validar que las tablas expuestas al Data API tengan RLS.
- Si se usan views, revisar `security_invoker = true` cuando aplique.

### Criterios De Aceptacion

- No hay secretos sensibles en repo/mobile.
- Las operaciones de usuario solo afectan sus datos.
- El usuario no queda atrapado en errores de sesion.
- La app tiene feedback claro para errores comunes.
- Typecheck y Expo Doctor siguen en verde.

### Estado

Pendiente.

## Checklist MVP Listo

- Usuario puede registrarse.
- Usuario puede iniciar sesion por email/password.
- Usuario puede iniciar sesion con Google Account.
- Sesion persiste al cerrar/reabrir la app.
- Logout limpia sesion.
- Usuario nuevo ve onboarding o empty states utiles.
- Usuario crea cuenta.
- Usuario crea ingreso.
- Usuario crea gasto.
- Usuario crea categoria con emoji.
- Usuario ve dashboard con datos reales.
- Usuario ve listado de cuentas.
- Usuario ve listado de movimientos.
- Usuario registra deuda o pago de deuda.
- Todos los requests privados usan Bearer token.
- Datos estan filtrados por usuario en backend/RLS.
- Modo claro/oscuro validado.
- Build Android preview generado.
- Deep links OAuth probados en build nativo.

## Roadmap Priorizado Desde El Estado Actual

Este orden prioriza entregar valor real del MVP antes de avanzar a integraciones posteriores. Las fases 1 y 2 se consideran base continua: ya existen, pero deben seguir refinandose cuando una pantalla nueva lo requiera.

### P0: Cerrar Base Critica Del MVP

Objetivo: asegurar que la app pueda usarse con datos reales, sesion real y contratos estables sin bloquear al usuario.

Estado actual: en progreso. Ya existe una capa API tipada por dominio, manejo robusto de envelope/errores, validacion inicial de `/api/me` antes de entrar a tabs y estados basicos de loading/error para vistas core. La conectividad remota fue comprobada con `GET /healthz` en estado 200, y `/api/me`, accounts, summary, transactions, categories, debts y pending movements responden 401 sin token. Falta validar Auth real y respuestas autenticadas en dispositivo/emulador con backend y Supabase reales.

1. Validar Auth Real en dispositivo/emulador.
   Fases relacionadas: Fase 3, Fase 9.
   Entregables: email/password, Google OAuth, persistencia de sesion, logout y deep link `finanzasmobilev2://auth/callback` probados fuera del navegador.
   Criterio de salida: usuario autenticado entra a tabs, usuario sin sesion vuelve a login, y errores comunes se muestran claramente.
   Estado: pendiente de validacion manual en dispositivo/emulador. Codigo base listo para validar `/api/me` y cerrar sesion si backend responde 401.

2. Completar contratos mobile contra `finanzas-api`.
   Fases relacionadas: Fase 4, Fase 5.
   Entregables: `src/api/types.ts`, `src/api/mappers.ts`, payloads de formularios y manejo de envelope/errores alineados a respuestas reales.
   Criterio de salida: pantallas no dependen de campos ambiguos y todos los requests privados usan Bearer token.
   Estado: avanzado. Tipos core, payloads y API de dominio agregados para me, accounts, summary, transactions, categories, debts y pending movements.

3. Robustecer cliente API y queries por dominio.
   Fases relacionadas: Fase 5, Fase 6.
   Entregables: query functions o hooks claros para summary, accounts, transactions, categories y debts; manejo de 401; mensajes para backend lento/dormido.
   Criterio de salida: loading, error, retry y sesion expirada tienen comportamiento predecible.
   Estado: avanzado. `apiRequest` maneja red, JSON invalido, missing data, status/codigo de error y logout en 401. Tabs core usan `financeApi` y estados basicos de loading/error.

### P1: Core Financiero Usable

Objetivo: permitir que el usuario nuevo cree su estructura financiera basica y vea valor en el dashboard.

4. Completar cuentas.
   Fases relacionadas: Fase 6, Fase 7.
   Entregables: listado, creacion, balance por cuenta, tipo de cuenta y estado vacio accionable.
   Criterio de salida: usuario puede crear su primera cuenta y entender su balance.

5. Completar categorias.
   Fases relacionadas: Fase 4, Fase 6.
   Entregables: listado por tipo, creacion con emoji, selector para movimientos y categorias base si aplica.
   Criterio de salida: usuario puede asignar categoria real a ingreso/gasto sin escribir texto libre obligatorio.

6. Completar movimientos.
   Fases relacionadas: Fase 6.
   Entregables: crear ingreso/gasto con cuenta y categoria reales, listar historial, mostrar fecha/nota, filtros por mes como minimo.
   Criterio de salida: usuario puede registrar ingresos y gastos que actualizan el resumen financiero.

7. Completar dashboard financiero.
   Fases relacionadas: Fase 2, Fase 6.
   Entregables: balance total, ingresos, gastos, ahorro, deudas, acciones rapidas, ultimos movimientos, recomendaciones y graficos consistentes con la paleta.
   Criterio de salida: dashboard refleja datos reales y no se ve vacio o tecnico para usuarios nuevos.

### P2: Gestion Financiera Completa Del MVP

Objetivo: cubrir deudas, primer uso y estados de producto necesarios para una experiencia redonda.

8. Completar deudas y pagos.
   Fases relacionadas: Fase 6.
   Entregables: listado de deudas, estado, monto pendiente, registro de pago y cuenta asociada.
   Criterio de salida: usuario puede registrar pago y ver reduccion/progreso de deuda.

9. Implementar onboarding y empty states accionables.
   Fases relacionadas: Fase 7.
   Entregables: guia para primera cuenta, primer movimiento, sugerencia de moneda base y explicaciones simples.
   Criterio de salida: usuario nuevo sabe que hacer despues de registrarse sin ayuda externa.

10. Consolidar identidad visual y accesibilidad basica.
    Fases relacionadas: Fase 2, Fase 10.
    Entregables: modo claro/oscuro consistente, jerarquia tipografica estable, contraste validado, componentes `Fint*` reutilizados y UI limpia sin sombras pesadas.
    Criterio de salida: todas las tabs se sienten parte del mismo sistema visual.

### P3: Integraciones, QA Y Beta

Objetivo: preparar el MVP para pruebas reales y dejar listas las capacidades posteriores sin bloquear el core financiero.

11. Activar Gmail y pendientes.
    Fases relacionadas: Fase 8.
    Entregables: listado de pendientes, confirmar, descartar, OAuth Gmail, sync manual y Realtime filtrado por usuario si aporta valor.
    Criterio de salida: Gmail sugiere movimientos, pero el usuario siempre confirma antes de crear datos reales.

12. Configurar EAS y generar build preview Android.
    Fases relacionadas: Fase 9.
    Entregables: proyecto EAS, `extra.eas.projectId` si aplica, build Android preview y validacion de deep links/OAuth en build.
    Criterio de salida: APK/AAB preview instalable y login funcional fuera de Expo Go.

13. Preparar beta tecnica.
    Fases relacionadas: Fase 10.
    Entregables: revision de secrets, ownership/RLS en backend, tests minimos de mappers/API client, errores globales y checklist de performance inicial.
    Criterio de salida: app lista para usuarios de prueba sin exponer datos ni quedarse atrapada en errores comunes.

## Secuencia Recomendada De Implementacion

1. P0.1 Auth real validada en dispositivo/emulador.
2. P0.2 Contratos y mappers contra backend real.
3. P0.3 Cliente API robusto y estados de error/loading.
4. P1.4 Cuentas completas.
5. P1.5 Categorias completas.
6. P1.6 Movimientos completos.
7. P1.7 Dashboard conectado y pulido.
8. P2.8 Deudas y pagos.
9. P2.9 Onboarding y empty states accionables.
10. P2.10 Consolidacion visual/accesibilidad.
11. P3.11 Gmail y pendientes.
12. P3.12 EAS build preview Android.
13. P3.13 Beta tecnica.

## Riesgos Principales

- Google OAuth puede fallar si Google Cloud, Supabase redirect y deep link no estan alineados.
- Render Free puede dormir y generar primeras cargas lentas.
- Contratos backend pueden diferir de los tipos mobile iniciales.
- Selectores complejos pueden tener problemas de portal/z-index en Android.
- Sin onboarding, usuarios nuevos pueden ver dashboard vacio y no entender el siguiente paso.
- Realtime debe filtrarse correctamente por `user_id` para no mezclar datos.

## Definicion De Hecho Por Fase

Una fase se considera terminada solo cuando:

- El flujo funciona en mobile.
- TypeScript compila sin errores.
- Expo Doctor no reporta problemas bloqueantes.
- La UI mantiene consistencia claro/oscuro.
- Hay manejo de loading, empty y error states donde aplique.
- La fase no introduce secrets ni bypasses de seguridad.
- El comportamiento esta documentado o reflejado en este roadmap si cambia el alcance.
