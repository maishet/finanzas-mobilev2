# Fint Product Vision

Fint es una app movil de finanzas personales disenada para ayudar a cada usuario a entender, organizar y mejorar su relacion diaria con el dinero. El producto busca convertir datos financieros dispersos en una experiencia clara, accionable y visualmente ordenada.

## Proposito

Fint permite que una persona tenga control real de sus finanzas personales desde el telefono: cuentas, ingresos, gastos, deudas, categorias, pendientes detectados y resumen financiero mensual. La app debe sentirse confiable, moderna y simple desde el primer uso.

## Principios De Producto

- Claridad antes que complejidad: cada pantalla debe responder una pregunta concreta del usuario.
- Control visible: el usuario debe entender cuanto tiene, cuanto entra, cuanto sale y que debe atender.
- Accion inmediata: crear cuenta, registrar movimiento o pagar deuda debe requerir pocos pasos.
- Finanzas sin friccion: los datos deben sincronizarse con Supabase y backend sin exponer detalles tecnicos.
- Confianza: auth, sesion, errores y datos deben sentirse seguros y predecibles.

## Identidad Visual

Fint usa un lenguaje fintech minimalista, simple y moderno. La interfaz debe ser limpia, con suficiente aire, jerarquia clara y componentes consistentes.

La direccion visual se apoya en:

- Paleta azul/cian inspirada en confianza, tecnologia y liquidez.
- Fondos suaves en modo claro para una experiencia luminosa.
- Superficies profundas en modo oscuro para lectura comoda y foco visual.
- Accents cian/azul para acciones primarias, estados activos y elementos destacados.
- Bordes sutiles y elevacion ligera para separar tarjetas sin ruido visual.
- Tipografia clara, con titulos fuertes y textos secundarios contenidos.

## Experiencia Esperada

La app debe sentirse como una herramienta financiera personal completa pero facil de entender. El usuario no debe necesitar conocimientos contables para usarla.

Las pantallas principales deben estar distribuidas asi:

- Inicio: resumen financiero, metricas clave, alertas y acciones rapidas.
- Cuentas: origen y destino del dinero, balance por cuenta y tipo.
- Movimientos: historial, filtros, ingresos, gastos y categorias.
- Deudas: obligaciones activas, pagos registrados y progreso.
- Pendientes: movimientos sugeridos por Gmail o fuentes externas para confirmar o descartar.

## Componentes

Los componentes deben mantener una estetica homogenea:

- Cards con fondo de superficie, borde suave y elevacion moderada.
- Botones primarios con accent fuerte y alto contraste.
- Botones secundarios transparentes con borde accent.
- Inputs limpios, con foco accent y placeholders discretos.
- Empty states utiles, no solo mensajes vacios.
- Graficos simples, legibles y consistentes con la paleta.
- Bottom sheets para selectores criticos en mobile, evitando selects complejos que puedan fallar en Android.

## Modo Claro Y Oscuro

Fint debe soportar modo claro y oscuro desde el inicio.

Modo claro:

- Sensacion limpia, fresca y ligera.
- Superficies blancas/azules muy suaves.
- Acciones primarias con azul/cian profundo.
- Texto de alto contraste sin negros extremos innecesarios.

Modo oscuro:

- Fondos azul noche profundos.
- Cards ligeramente elevadas sobre el fondo.
- Accent cian luminoso para accion y foco.
- Contraste suficiente para lectura prolongada.

## MVP

El MVP debe validar que el usuario puede registrarse, iniciar sesion, persistir sesion, crear cuentas, registrar movimientos, ver resumen financiero, administrar categorias, registrar deudas y avanzar hacia pendientes detectados por Gmail.

El objetivo no es tener muchas pantallas, sino una experiencia central bien resuelta, estable y agradable de usar.
