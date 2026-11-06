# Comprobaci�n del nivel 3

Ejecuta npm ci, npm run api y npm run dev desde la rama nivel-3. Mant�n la API en el puerto 3000 y el frontend en el 5173.

## Pruebas autom�ticas

GitHub Actions tambi�n ejecuta scripts/e2e.mjs en Chromium con una base temporal. El workflow conserva capturas de escritorio, m�vil, confirmaci�n y cualquier fallo durante siete d�as. Para repetir esa comprobaci�n en un entorno de desarrollo con ambos puertos libres:

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

El primer modo prueba las peticiones de Axios contra el handler real de json-server dentro del proceso, sin abrir conexiones. El segundo utiliza HTTP real. Ambos prueban categor�as, relaciones, ocho productos por p�gina, filtros combinados, POST, PUT, DELETE, persistencia en un archivo temporal, 404 y cancelaci�n.

Tambi�n se comprueban cantidades, eliminaci�n al llegar a cero, total de 0.10 + 0.20, recuperaci�n del carrito, rechazo de datos persistidos inv�lidos, l�mite de cantidad y validaci�n del formulario.

## Cat�logo y navegaci�n

1. Recarga el cat�logo y comprueba el skeleton durante la consulta.
2. Confirma que la primera p�gina muestra ocho productos y Page 1 of 2.
3. Pulsa Next. Debe aparecer Vanilla Panna Cotta y Page 2 of 2.
4. Busca Baklava. Debe aparecer Pistachio Baklava.
5. Mant�n esa b�squeda y selecciona Cake. Debe aparecer No desserts found.
6. Limpia los filtros y entra al detalle desde una imagen o el nombre.
7. Abre /producto/999. Debe aparecer Product not found.
8. En Network, revisa peticiones GET con _page, _per_page=8, name:contains, categoryId y _embed=category.

## Carrito y confirmaci�n

1. Agrega un waffle de $6.50 e incrementa su cantidad a dos.
2. Agrega un macaron de $8.00. El total debe ser $21.00.
3. Recarga. Deben mantenerse ambos productos y sus cantidades.
4. Abre Cart y comprueba el drawer, los controles + y - y la eliminaci�n.
5. Confirma la orden. El modal debe mostrar los art�culos reales; el carrito debe quedar vac�o.
6. Cierra con Start New Order. Recarga y comprueba que el carrito siga vac�o.
7. Repite la apertura y cierre con teclado. El foco debe volver al control anterior.

## CRUD, formularios y notificaciones

1. Abre Manage products y New product.
2. Env�a el formulario vac�o. Debe mostrar errores de nombre, precio y categor�a.
3. Prueba precio cero, negativo y con tres decimales. No debe guardarse.
4. Crea Evaluation Cake, categor�a Cake y precio $4.75. En Product image escribe una ruta local o una URL p�blica directa de imagen. Comprueba la vista previa; una direcci�n inv�lida debe bloquear el env�o y una imagen inexistente debe mostrar el recurso de reemplazo. Tambi�n puedes elegir una de las im�genes incluidas mediante las sugerencias del campo.
5. Debe aparecer un toast de creaci�n y el producto en la b�squeda del listado.
6. Recarga la p�gina y abre el detalle. El producto debe seguir disponible.
7. Agr�galo al carrito y edita su precio a $6.00 y su imagen. La edici�n debe cargar los valores anteriores y actualizar los datos del art�culo del carrito tras guardar. Comprueba que una imagen propia conserve su URL en escritorio, m�vil, detalle y miniatura de la confirmaci�n de orden.
8. Abre Delete y pulsa Cancel. El producto debe seguir en el listado.
9. Repite Delete y confirma. Debe desaparecer del listado, del carrito y de db.json.
10. Si se elimina el �nico producto de la �ltima p�gina, la paginaci�n debe regresar a una p�gina v�lida.
11. Para comprobar errores de red, det�n temporalmente la API y realiza una b�squeda. Rein�ciala y pulsa Retry.

## Responsive y frontend publicado

Comprueba el cat�logo y el modal a 375 px: una columna, filtros apilados y ausencia de desbordamiento horizontal. En escritorio deben mostrarse tres columnas y el resumen lateral.

El enlace publicado sigue consultando http://localhost:3000. Necesita json-server del nivel 3 en el equipo que abre el sitio y los permisos de red local que solicite el navegador. No utiliza una API en la nube.
