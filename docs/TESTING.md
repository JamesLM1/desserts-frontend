# Comprobación del nivel 3

Ejecuta npm ci, npm run api y npm run dev desde la rama nivel-3. Mantén la API en el puerto 3000 y el frontend en el 5173.

## Pruebas automáticas

GitHub Actions también ejecuta scripts/e2e.mjs en Chromium con una base temporal. El workflow conserva capturas de escritorio, móvil, confirmación y cualquier fallo durante siete días. Para repetir esa comprobación en un entorno de desarrollo con ambos puertos libres:

```powershell
npm install --no-save --package-lock=false @playwright/test@1.64.1
npx playwright install chromium
npm run build
node scripts/e2e.mjs
```

El script inicia y detiene sus propios servidores; no utiliza el db.json de trabajo para escribir los productos de prueba.

```powershell
npm run check
npm run test:http
```

El primer modo prueba las peticiones de Axios contra el handler real de json-server dentro del proceso, sin abrir conexiones. El segundo utiliza HTTP real. Ambos prueban categorías, relaciones, ocho productos por página, filtros combinados, POST, PUT, DELETE, persistencia en un archivo temporal, 404 y cancelación.

También se comprueban cantidades, eliminación al llegar a cero, total de 0.10 + 0.20, recuperación del carrito, rechazo de datos persistidos inválidos, límite de cantidad y validación del formulario.

## Catálogo y navegación

1. Recarga el catálogo y comprueba el skeleton durante la consulta.
2. Confirma que la primera página muestra ocho productos y Page 1 of 2.
3. Pulsa Next. Debe aparecer Vanilla Panna Cotta y Page 2 of 2.
4. Busca Baklava. Debe aparecer Pistachio Baklava.
5. Mantén esa búsqueda y selecciona Cake. Debe aparecer No desserts found.
6. Limpia los filtros y entra al detalle desde una imagen o el nombre.
7. Abre /producto/999. Debe aparecer Product not found.
8. En Network, revisa peticiones GET con _page, _per_page=8, name:contains, categoryId y _embed=category.

## Carrito y confirmación

1. Agrega un waffle de $6.50 e incrementa su cantidad a dos.
2. Agrega un macaron de $8.00. El total debe ser $21.00.
3. Recarga. Deben mantenerse ambos productos y sus cantidades.
4. Abre Cart y comprueba el drawer, los controles + y − y la eliminación.
5. Confirma la orden. El modal debe mostrar los artículos reales; el carrito debe quedar vacío.
6. Cierra con Start New Order. Recarga y comprueba que el carrito siga vacío.
7. Repite la apertura y cierre con teclado. El foco debe volver al control anterior.

## CRUD, formularios y notificaciones

1. Abre Manage products y New product.
2. Envía el formulario vacío. Debe mostrar errores de nombre, precio y categoría.
3. Prueba precio cero, negativo y con tres decimales. No debe guardarse.
4. Crea Evaluation Cake, categoría Cake, precio $4.75 e imagen de Red velvet cake.
5. Debe aparecer un toast de creación y el producto en la búsqueda del listado.
6. Recarga la página y abre el detalle. El producto debe seguir disponible.
7. Agrégalo al carrito y edita su precio a $6.00. La edición debe cargar los valores anteriores y actualizar el precio del carrito tras guardar.
8. Abre Delete y pulsa Cancel. El producto debe seguir en el listado.
9. Repite Delete y confirma. Debe desaparecer del listado, del carrito y de db.json.
10. Si se elimina el único producto de la última página, la paginación debe regresar a una página válida.
11. Para comprobar errores de red, detén temporalmente la API y realiza una búsqueda. Reiníciala y pulsa Retry.

## Responsive y frontend publicado

Comprueba el catálogo y el modal a 375 px: una columna, filtros apilados y ausencia de desbordamiento horizontal. En escritorio deben mostrarse tres columnas y el resumen lateral.

El enlace publicado sigue consultando http://localhost:3000. Necesita json-server del nivel 3 en el equipo que abre el sitio y los permisos de red local que solicite el navegador. No utiliza una API en la nube.
