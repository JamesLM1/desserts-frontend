# Desserts

Prueba técnica frontend de una tienda de postres. El proyecto usa React, Vite y TypeScript. Conserva el diseño de Frontend Mentor y agrega un catálogo conectado a una API local, carrito persistente y administración de productos.

## Ramas de entrega

| Rama | Alcance |
| --- | --- |
| nivel-1 | Interfaz con productos locales, carrito vacío y confirmación visual. |
| nivel-2 | Axios, TanStack Query, búsqueda, filtros, skeletons y detalle. |
| nivel-3 | Carrito real con Zustand, CRUD, formularios, categorías, paginación y despliegue del frontend. |

Cada nivel conserva su propia rama. Los commits del nivel 3 no llevan emojis, por indicación del autor.

## Stack

React, Vite, TypeScript, Tailwind CSS, React Router, Axios, TanStack Query, Zustand, React Hook Form, Zod y json-server 1.0.0-beta.15.

Se recomienda Node.js 24 LTS y npm. La versión mínima configurada es Node.js 22.12.

## Instalación

```powershell
git clone https://github.com/JamesLM1/desserts-frontend.git
cd desserts-frontend
git switch nivel-3
npm ci
```

Los paquetes se instalan a partir de package-lock.json. No se necesita una cuenta de base de datos ni una API externa.

## Ejecución local

Abre dos terminales en la raíz del proyecto y mantenlas abiertas.

**Terminal 1: API**

```powershell
npm run api
```

API: http://localhost:3000

**Terminal 2: frontend**

```powershell
npm run dev
```

Aplicación: http://localhost:5173

Si uno de esos puertos está ocupado por una ejecución anterior, cierra ese proceso antes de volver a iniciarlo. El comando dev utiliza strictPort para mantener el puerto solicitado.

## Scripts

| Comando | Uso |
| --- | --- |
| npm run dev | Inicia Vite en el puerto 5173. |
| npm run api | Inicia json-server con db.json en el puerto 3000. |
| npm run lint | Revisa el código con ESLint. |
| npm run test | Prueba servicios, router real de json-server, escritura en una base desechable, carrito y validaciones. Usa un transporte HTTP dentro del proceso. |
| npm run test:http | Ejecuta las mismas pruebas con conexiones HTTP reales y un puerto temporal. |
| npm run build | Comprueba TypeScript y genera dist. |
| npm run preview | Permite revisar la compilación de producción. La API debe seguir ejecutándose. |
| npm run check | Ejecuta ESLint, pruebas y compilación. |

Las pruebas crean una base temporal dentro de node_modules/.tmp. No modifican los productos de db.json. GitHub Actions ejecuta ambos modos de pruebas en cada push a nivel-3.

## Configuración

Los valores predeterminados permiten ejecutar el proyecto sin crear archivos adicionales. Si necesitas cambiarlos, copia .env.example a .env.local y reinicia Vite.

| Variable | Valor predeterminado | Uso |
| --- | --- | --- |
| VITE_API_URL | http://localhost:3000 | Dirección de tu json-server local. |
| VITE_API_DELAY_MS | 1200 | Retraso de las consultas de productos para hacer visibles los skeletons. |

Estas variables son públicas y forman parte del código del navegador. La aplicación no configura una API online ni una base de datos en la nube.

## Funcionamiento

El catálogo muestra ocho productos por página. La búsqueda por nombre y el filtro por categoría se envían a la API. Los filtros y la página quedan en la URL. Hay estados de carga, error, respuesta vacía y producto inexistente.

Cada tarjeta permite agregar el producto al carrito y modificar su cantidad. El carrito está disponible en el resumen lateral y en un drawer. Zustand conserva sus artículos en localStorage con la clave desserts-cart. Al recargar se validan los datos recuperados.

Confirm Order captura los artículos y sus cantidades, vacía el carrito y abre la confirmación con ese resumen. Start New Order cierra el modal. La confirmación es local: esta prueba no procesa pagos ni registra pedidos en un servicio externo.

Manage products abre el listado de administración. New product y Edit utilizan el mismo formulario de React Hook Form con validación Zod. La edición recibe defaultValues con los datos del producto. La eliminación requiere confirmar en un modal.

Cada creación, edición o eliminación utiliza Axios y una mutación de TanStack Query. Después de una respuesta exitosa se invalidan las consultas de productos y se muestra un toast. Una edición actualiza el artículo que ya esté en el carrito; una eliminación también lo retira.

## Rutas

| Ruta | Vista |
| --- | --- |
| / | Catálogo y carrito. |
| /producto/:id | Detalle del producto. |
| /admin/products | Administración del catálogo. |
| /admin/products/new | Crear un producto. |
| /admin/products/:id/edit | Editar un producto. |
| Cualquier otra ruta | Página 404. |

La administración es parte de una demostración local y no incluye autenticación.

## Arquitectura

| Carpeta | Responsabilidad |
| --- | --- |
| src/components | Tarjetas, imágenes, filtros, paginación, formularios, dialogs y toasts. |
| src/pages | Catálogo, detalle, administración, creación, edición y 404. |
| src/hooks | Consultas, mutaciones, filtros de URL y acciones compartidas. |
| src/services | Instancia de Axios, operaciones de la API y mensajes de error. |
| src/schemas | Esquema Zod y resolver tipado para React Hook Form. |
| src/stores | Carrito persistente y notificaciones con Zustand. |
| src/interfaces | Tipos de productos, categorías, paginación y carrito. |
| src/routes | Definición de rutas y carga diferida de la administración. |

## API y datos

db.json contiene nueve productos y nueve categorías iniciales. json-server guarda las operaciones CRUD en ese archivo.

Cada producto tiene id, name, price, image y categoryId. Cada categoría tiene id y name. Las consultas de productos incluyen _embed=category para obtener su nombre. Los IDs de categorías usan el prefijo category-; esto evita que el parser de filtros de esta versión beta convierta un identificador de texto a un número.

| Método | Endpoint | Operación |
| --- | --- | --- |
| GET | /products?_page=1&_per_page=8&_embed=category | Catálogo paginado con categoría relacionada. |
| GET | /products?name:contains=Baklava&_page=1&_per_page=8&_embed=category | Búsqueda por nombre. |
| GET | /products?categoryId=category-7&_page=1&_per_page=8&_embed=category | Filtro por Cake. |
| GET | /products/:id?_embed=category | Detalle del producto. |
| GET | /categories | Opciones de categoría. |
| POST | /products | Crear producto. |
| PUT | /products/:id | Reemplazar los datos de un producto. |
| DELETE | /products/:id | Eliminar un producto. |

La respuesta paginada incluye data, items, pages, first, last, prev y next. La interfaz utiliza estos valores para mostrar la página actual y habilitar los botones.

## Decisiones técnicas

- TanStack Query administra los datos del servidor. La consulta inicial conserva la clave ['products']; las búsquedas y páginas utilizan claves derivadas. Las mutaciones invalidan ese prefijo, incluido el detalle.
- Zustand administra el carrito del navegador. La persistencia guarda artículos, sin copiar las funciones del store.
- Los totales se calculan en céntimos antes de convertirlos a dólares. Las cantidades están limitadas a 99 por producto.
- La confirmación conserva una copia de la orden antes de vaciar el carrito.
- Zod valida nombre, precio positivo, dos decimales, categoría e imagen local. El formulario comprueba además que la categoría exista en las opciones recuperadas.
- Las imágenes son assets locales y tienen variantes para escritorio, tablet y móvil. Una imagen ausente utiliza un recurso de reemplazo.
- Los dialogs mantienen el foco dentro de la ventana modal y lo devuelven al control que la abrió.
- La administración se carga por separado para reducir el código inicial del catálogo.

## Despliegue

El frontend se prepara para Vercel con vercel.json: framework Vite, comando npm run build, salida dist y reescritura de rutas de la SPA. El proyecto debe desplegar la rama nivel-3.

**La API permanece local por requisito de la prueba.** Para utilizar el frontend publicado, el visitante debe ejecutar npm run api en su equipo con el db.json del nivel 3. localhost siempre se refiere al equipo del visitante.

En Chrome puede aparecer una solicitud de acceso a la red local. Si el navegador no permite acceder a localhost desde el sitio publicado, la aplicación muestra un error con Retry. La evaluación completa puede realizarse en http://localhost:5173 con los dos servidores abiertos.

El enlace publicado ofrece el frontend; no se ha trasladado json-server a una API online. Publicar un backend remoto autónomo requeriría cambiar la regla de la prueba.

## Validación de la entrega

Consulta [docs/TESTING.md](docs/TESTING.md) para los pasos de evaluación manual. Ejecuta npm run check y npm run test:http para comprobar código, servicios y persistencia. El historial de la rama conserva los commits por grupo de funcionalidades.
