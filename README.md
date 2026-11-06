# Desserts

Prueba t�cnica frontend de una tienda de postres. El proyecto usa React, Vite y TypeScript. Conserva el dise�o de Frontend Mentor y agrega un cat�logo conectado a una API local, carrito persistente y administraci�n de productos.

## Ramas de entrega

| Rama | Alcance |
| --- | --- |
| nivel-1 | Interfaz con productos locales, carrito vac�o y confirmaci�n visual. |
| nivel-2 | Axios, TanStack Query, b�squeda, filtros, skeletons y detalle. |
| nivel-3 | Carrito real con Zustand, CRUD, formularios, categor�as, paginaci�n y despliegue del frontend. |

## Stack

React, Vite, TypeScript, Tailwind CSS, React Router, Axios, TanStack Query, Zustand, React Hook Form, Zod y json-server 1.0.0-beta.15.

Se recomienda Node.js 24 LTS y npm. La versi�n m�nima configurada es Node.js 22.12.

## Instalaci�n

```powershell
git clone https://github.com/JamesLM1/desserts-frontend.git
cd desserts-frontend
git switch nivel-3
npm ci
```

Los paquetes se instalan a partir de package-lock.json. No se necesita una cuenta de base de datos ni una API externa.

## Ejecuci�n local

Abre dos terminales en la ra�z del proyecto y mantenlas abiertas.

**Terminal 1: API**

```powershell
npm run api
```

API: http://localhost:3000

**Terminal 2: frontend**

```powershell
npm run dev
```

Aplicaci�n: http://localhost:5173

Si uno de esos puertos est� ocupado por una ejecuci�n anterior, cierra ese proceso antes de volver a iniciarlo. El comando dev utiliza strictPort para mantener el puerto solicitado.

## Scripts

| Comando | Uso |
| --- | --- |
| npm run dev | Inicia Vite en el puerto 5173. |
| npm run api | Inicia json-server con db.json en el puerto 3000. |
| npm run lint | Revisa el c�digo con ESLint. |
| npm run test | Prueba servicios, router real de json-server, escritura en una base desechable, carrito y validaciones. Usa un transporte HTTP dentro del proceso. |
| npm run test:http | Ejecuta las mismas pruebas con conexiones HTTP reales y un puerto temporal. |
| npm run build | Comprueba TypeScript y genera dist. |
| npm run preview | Permite revisar la compilaci�n de producci�n. La API debe seguir ejecut�ndose. |
| npm run check | Ejecuta ESLint, pruebas y compilaci�n. |

Las pruebas crean una base temporal dentro de node_modules/.tmp. No modifican los productos de db.json. GitHub Actions ejecuta ambos modos de pruebas en cada push a nivel-3.

## Configuraci�n

Los valores predeterminados permiten ejecutar el proyecto sin crear archivos adicionales. Si necesitas cambiarlos, copia .env.example a .env.local y reinicia Vite.

| Variable | Valor predeterminado | Uso |
| --- | --- | --- |
| VITE_API_URL | http://localhost:3000 | Direcci�n de tu json-server local. |
| VITE_API_DELAY_MS | 1200 | Retraso de las consultas de productos para hacer visibles los skeletons. |

Estas variables son p�blicas y forman parte del c�digo del navegador. La aplicaci�n no configura una API online ni una base de datos en la nube.

## Funcionamiento

El cat�logo muestra ocho productos por p�gina. La b�squeda por nombre y el filtro por categor�a se env�an a la API. Los filtros y la p�gina quedan en la URL. Hay estados de carga, error, respuesta vac�a y producto inexistente.

Cada tarjeta permite agregar el producto al carrito y modificar su cantidad. El carrito est� disponible en el resumen lateral y en un drawer. Zustand conserva sus art�culos en localStorage con la clave desserts-cart. Al recargar se validan los datos recuperados.

Confirm Order captura los art�culos y sus cantidades, vac�a el carrito y abre la confirmaci�n con ese resumen. Start New Order cierra el modal. La confirmaci�n es local: esta prueba no procesa pagos ni registra pedidos en un servicio externo.

Manage products abre el listado de administraci�n. New product y Edit utilizan el mismo formulario de React Hook Form con validaci�n Zod. La edici�n recibe defaultValues con los datos del producto. La eliminaci�n requiere confirmar en un modal.

Cada creaci�n, edici�n o eliminaci�n utiliza Axios y una mutaci�n de TanStack Query. Despu�s de una respuesta exitosa se invalidan las consultas de productos y se muestra un toast. Una edici�n actualiza el art�culo que ya est� en el carrito; una eliminaci�n tambi�n lo retira.

## Rutas

| Ruta | Vista |
| --- | --- |
| / | Cat�logo y carrito. |
| /producto/:id | Detalle del producto. |
| /admin/products | Administraci�n del cat�logo. |
| /admin/products/new | Crear un producto. |
| /admin/products/:id/edit | Editar un producto. |
| Cualquier otra ruta | P�gina 404. |

La administraci�n es parte de una demostraci�n local y no incluye autenticaci�n.

## Arquitectura

| Carpeta | Responsabilidad |
| --- | --- |
| src/components | Tarjetas, im�genes, filtros, paginaci�n, formularios, dialogs y toasts. |
| src/pages | Cat�logo, detalle, administraci�n, creaci�n, edici�n y 404. |
| src/hooks | Consultas, mutaciones, filtros de URL y acciones compartidas. |
| src/services | Instancia de Axios, operaciones de la API y mensajes de error. |
| src/schemas | Esquema Zod y resolver tipado para React Hook Form. |
| src/stores | Carrito persistente y notificaciones con Zustand. |
| src/interfaces | Tipos de productos, categor�as, paginaci�n y carrito. |
| src/routes | Definici�n de rutas y carga diferida de la administraci�n. |

## API y datos

db.json contiene nueve productos y nueve categor�as iniciales. json-server guarda las operaciones CRUD en ese archivo.

Cada producto tiene id, name, price, image y categoryId. Cada categor�a tiene id y name. Las consultas de productos incluyen _embed=category para obtener su nombre. Los IDs de categor�as usan el prefijo category-; esto evita que el parser de filtros de esta versi�n beta convierta un identificador de texto a un n�mero.

| M�todo | Endpoint | Operaci�n |
| --- | --- | --- |
| GET | /products?_page=1&_per_page=8&_embed=category | Cat�logo paginado con categor�a relacionada. |
| GET | /products?name:contains=Baklava&_page=1&_per_page=8&_embed=category | B�squeda por nombre. |
| GET | /products?categoryId=category-7&_page=1&_per_page=8&_embed=category | Filtro por Cake. |
| GET | /products/:id?_embed=category | Detalle del producto. |
| GET | /categories | Opciones de categor�a. |
| POST | /products | Crear producto. |
| PUT | /products/:id | Reemplazar los datos de un producto. |
| DELETE | /products/:id | Eliminar un producto. |

La respuesta paginada incluye data, items, pages, first, last, prev y next. La interfaz utiliza estos valores para mostrar la p�gina actual y habilitar los botones.

## Decisiones t�cnicas

- TanStack Query administra los datos del servidor. La consulta inicial conserva la clave ['products']; las b�squedas y p�ginas utilizan claves derivadas. Las mutaciones invalidan ese prefijo, incluido el detalle.
- Zustand administra el carrito del navegador. La persistencia guarda art�culos, sin copiar las funciones del store.
- Los totales se calculan en c�ntimos antes de convertirlos a d�lares. Las cantidades est�n limitadas a 99 por producto.
- La confirmaci�n conserva una copia de la orden antes de vaciar el carrito.
- Zod valida nombre, precio positivo, dos decimales, categor�a y una ruta local o URL HTTP(S) de imagen. El formulario comprueba adem�s que la categor�a exista en las opciones recuperadas.
- Crear y editar aceptan una sola imagen propia, muestran una vista previa y conservan las im�genes incluidas como sugerencias. Para un archivo local, col�calo en public/assets/images y escribe /assets/images/nombre-del-archivo.jpg. Una URL debe apuntar directamente a una imagen p�blica. No se suben archivos desde el formulario.
- Las fotos incluidas conservan sus variantes de escritorio, tablet, m�vil y miniatura. Las im�genes propias reutilizan el mismo enlace en todas las vistas, sin modificar el nombre del archivo. Una imagen ausente utiliza un recurso de reemplazo. Los datos de productos y categor�as siguen usando exclusivamente json-server local; una URL de imagen externa depende de la disponibilidad de ese servidor de im�genes.
- Los dialogs mantienen el foco dentro de la ventana modal y lo devuelven al control que la abri�.
- La administraci�n se carga por separado para reducir el c�digo inicial del cat�logo.

## Despliegue

Frontend publicado: [desserts-frontend.vercel.app](https://desserts-frontend.vercel.app/).

Rama de entrega: [nivel-3](https://github.com/JamesLM1/desserts-frontend/tree/nivel-3). Las ramas nivel-1 y nivel-2 permanecen disponibles.

El frontend se prepara para Vercel con vercel.json: framework Vite, comando npm run build, salida dist y reescritura de rutas de la SPA. El proyecto debe desplegar la rama nivel-3.

**La API permanece local por requisito de la prueba.** Para utilizar el frontend publicado, el visitante debe ejecutar npm run api en su equipo con el db.json del nivel 3. localhost siempre se refiere al equipo del visitante.

En Chrome puede aparecer una solicitud de acceso a la red local. Si el navegador no permite acceder a localhost desde el sitio publicado, la aplicaci�n muestra un error con Retry. La evaluaci�n completa puede realizarse en http://localhost:5173 con los dos servidores abiertos.

El enlace publicado ofrece el frontend; no se ha trasladado json-server a una API online. Publicar un backend remoto aut�nomo requerir�a cambiar la regla de la prueba.

## Validaci�n de la entrega

GitHub Actions ejecuta adem�s una prueba de Chromium contra el build de producci�n y una copia temporal de db.json. Recorre cat�logo, filtros, carrito, confirmaci�n, CRUD, formularios, recuperaci�n de errores y vista m�vil; sus capturas se guardan como artefacto del workflow. Las herramientas del navegador se instalan solo en ese paso de CI y no forman parte del bundle de la tienda.

Consulta [docs/TESTING.md](docs/TESTING.md) para los pasos de evaluaci�n manual. Ejecuta npm run check y npm run test:http para comprobar c�digo, servicios y persistencia. El historial de la rama conserva los commits por grupo de funcionalidades.
