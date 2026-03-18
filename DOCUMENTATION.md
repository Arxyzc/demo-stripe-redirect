# Stripe Payment Demo - Documentación Completa

## Introducción

Esta es una aplicación demo funcional que implementa el flujo de pago de **Stripe Checkout** con redireccionamiento. El proyecto está construido con **React 19**, **TypeScript**, **Tailwind CSS 4** y un backend **Express.js** que maneja de forma segura las operaciones sensibles de Stripe.

---

## Características Principales

- **Usuario por defecto**: No requiere login. El usuario `demo-user-001` está preconfigurado.
- **Flujo de Stripe Checkout**: Redireccionamiento seguro a Stripe para procesar pagos.
- **Backend Express.js**: Maneja las API keys de Stripe de forma segura (la clave secreta nunca se expone al frontend).
- **Páginas de confirmación**: Páginas de éxito y cancelación con detalles de la sesión de pago.
- **Interfaz moderna**: Diseño limpio y profesional con Tailwind CSS y componentes shadcn/ui.
- **TypeScript**: Tipado completo para mayor seguridad y mantenibilidad.

---

## Estructura del Proyecto

```
stripe-demo/
├── client/                          # Frontend React
│   ├── public/                      # Archivos estáticos (favicon, robots.txt)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx            # Página principal con formulario de pago
│   │   │   ├── Success.tsx         # Página de éxito de pago
│   │   │   ├── Cancel.tsx          # Página de cancelación
│   │   │   └── NotFound.tsx        # Página 404
│   │   ├── components/             # Componentes reutilizables (shadcn/ui)
│   │   ├── contexts/
│   │   │   ├── UserContext.tsx     # Contexto del usuario por defecto
│   │   │   └── ThemeContext.tsx    # Contexto del tema
│   │   ├── App.tsx                 # Componente raíz con rutas
│   │   ├── main.tsx                # Punto de entrada de React
│   │   └── index.css               # Estilos globales y variables CSS
│   └── index.html                  # HTML principal
├── server/
│   └── index.ts                    # Backend Express con rutas de Stripe
├── package.json                    # Dependencias del proyecto
└── DOCUMENTATION.md                # Esta documentación
```

---

## Configuración Inicial

### 1. Variables de Entorno

El proyecto requiere dos variables de entorno para funcionar:

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `STRIPE_SECRET_KEY` | Clave secreta de Stripe (backend) | `sk_test_...` |
| `STRIPE_PUBLIC_KEY` | Clave pública de Stripe (frontend) | `pk_test_...` |
| `FRONTEND_URL` | URL del frontend para redireccionamientos | `http://localhost:5173` |

**Nota**: La clave secreta NUNCA debe estar en el código fuente. Se debe configurar en las variables de entorno del servidor.

### 2. Instalación de Dependencias

```bash
# Instalar todas las dependencias
pnpm install

# O si usas npm
npm install
```

### 3. Ejecutar en Desarrollo

```bash
# Terminal 1: Iniciar el servidor backend (Express)
pnpm run dev

# El servidor estará disponible en http://localhost:3000
# El frontend se sirve desde el mismo puerto
```

---

## Flujo de Pago Detallado

### Paso 1: Página de Inicio (Home.tsx)

El usuario ve:
- **Información del usuario**: ID y email del usuario por defecto
- **Formulario de pago**: Campos para cantidad y descripción del producto
- **Tarjeta de prueba**: Información de la tarjeta de prueba de Stripe

El usuario puede:
- Modificar la cantidad (mínimo $0.50)
- Cambiar la descripción del producto
- Hacer clic en "Proceed to Stripe Checkout"

### Paso 2: Crear Sesión de Checkout

Cuando el usuario hace clic en el botón, el frontend:

1. Realiza una solicitud POST a `/api/stripe/create-checkout-session` con:
   ```json
   {
     "amount": 29.99,
     "description": "Premium Demo Product",
     "userId": "demo-user-001"
   }
   ```

2. El backend Express:
   - Valida los datos
   - Crea una sesión de Stripe Checkout usando la SDK de Stripe
   - Configura URLs de éxito y cancelación
   - Retorna el ID de sesión y la URL de Stripe

3. El frontend redirige al usuario a Stripe Checkout

### Paso 3: Pago en Stripe Checkout

El usuario:
- Ingresa los datos de la tarjeta (usar `4242 4242 4242 4242` para pruebas)
- Completa el pago o cancela

### Paso 4: Redirección a Éxito o Cancelación

**Si el pago es exitoso**:
- Stripe redirige a `/success?session_id={CHECKOUT_SESSION_ID}&user_id=demo-user-001`
- La página Success.tsx verifica la sesión con el backend
- Muestra detalles del pago (estado, ID de sesión, email)

**Si el usuario cancela**:
- Stripe redirige a `/cancel`
- La página Cancel.tsx muestra un mensaje informativo

---

## Rutas de API Backend

### GET `/api/stripe/public-key`

Retorna la clave pública de Stripe (seguro exponerla).

**Respuesta**:
```json
{
  "publicKey": "pk_test_..."
}
```

### POST `/api/stripe/create-checkout-session`

Crea una nueva sesión de Stripe Checkout.

**Cuerpo de la solicitud**:
```json
{
  "amount": 29.99,
  "description": "Premium Demo Product",
  "userId": "demo-user-001"
}
```

**Respuesta exitosa**:
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/pay/cs_test_..."
}
```

**Respuesta de error**:
```json
{
  "error": "Missing required fields"
}
```

### POST `/api/stripe/verify-session`

Verifica el estado de una sesión de pago completada.

**Cuerpo de la solicitud**:
```json
{
  "sessionId": "cs_test_..."
}
```

**Respuesta exitosa**:
```json
{
  "status": "paid",
  "paymentIntentId": "pi_test_...",
  "customerEmail": "user-demo-user-001@demo.local"
}
```

---

## Uso de Tarjetas de Prueba

Stripe proporciona tarjetas de prueba para desarrollo. Las más comunes son:

| Número | Descripción | Resultado |
|--------|-------------|-----------|
| `4242 4242 4242 4242` | Tarjeta válida | Pago exitoso |
| `4000 0000 0000 0002` | Pago rechazado | Simula rechazo |
| `4000 0025 0000 3155` | Requiere 3D Secure | Simula autenticación |
| `5555 5555 5555 4444` | Visa válida alternativa | Pago exitoso |

**Detalles de prueba**:
- **Fecha de expiración**: Cualquier fecha futura (ej: 12/25)
- **CVC**: Cualquier número de 3 dígitos (ej: 123)

---

## Contexto del Usuario (UserContext.tsx)

El proyecto implementa un contexto de React que proporciona un usuario por defecto:

```typescript
const DEFAULT_USER: User = {
  id: "demo-user-001",
  name: "Demo User",
  email: "demo@stripe-demo.local",
};
```

**Uso en componentes**:
```typescript
import { useUser } from "@/contexts/UserContext";

export default function MyComponent() {
  const { user } = useUser();
  
  return <div>{user.name}</div>;
}
```

Para cambiar el usuario por defecto, edita el archivo `client/src/contexts/UserContext.tsx`:

```typescript
const DEFAULT_USER: User = {
  id: "tu-id-personalizado",
  name: "Tu Nombre",
  email: "tu-email@example.com",
};
```

---

## Seguridad

### Protección de API Keys

- **Clave Secreta**: Almacenada solo en variables de entorno del servidor. NUNCA se expone al cliente.
- **Clave Pública**: Se expone al frontend a través de la ruta `/api/stripe/public-key` (esto es seguro).
- **CORS**: Configurado para desarrollo. En producción, restringe a dominios específicos.

### Validación de Datos

El backend valida:
- Presencia de campos requeridos (`amount`, `description`)
- Tipo de datos correcto
- Valores mínimos (amount >= $0.50)

### Manejo de Errores

Los errores se capturan y registran en el servidor sin exponer detalles sensibles al cliente.

---

### Opción 1: Node.js Tradicional

1. **Compilar el proyecto**:
   ```bash
   pnpm run build
   ```

2. **Configurar variables de entorno**:
   ```bash
   export STRIPE_SECRET_KEY="sk_test_..."
   export STRIPE_PUBLIC_KEY="pk_test_..."
   export FRONTEND_URL="https://tu-dominio.com"
   export NODE_ENV="production"
   ```

3. **Ejecutar el servidor**:
   ```bash
   pnpm run start
   ```

4. **Acceder a la aplicación**:
   ```
   http://localhost:3000
   ```

### Opción 2: Docker

Crea un `Dockerfile`:

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["pnpm", "run", "start"]
```

Construir e ejecutar:

```bash
docker build -t stripe-demo .
docker run -p 3000:3000 \
  -e STRIPE_SECRET_KEY="sk_test_..." \
  -e STRIPE_PUBLIC_KEY="pk_test_..." \
  stripe-demo
```

### Opción 3: Plataformas de Hosting

**Railway, Render, Heroku, etc.**:

1. Conecta tu repositorio Git
2. Configura las variables de entorno en el panel de control
3. Establece el comando de inicio: `pnpm run start`
4. Despliega

---

## Personalización

### Cambiar el Monto Predeterminado

En `client/src/pages/Home.tsx`:

```typescript
const [amount, setAmount] = useState("49.99"); // Cambiar aquí
```

### Cambiar la Descripción Predeterminada

En `client/src/pages/Home.tsx`:

```typescript
const [description, setDescription] = useState("Mi Producto"); // Cambiar aquí
```

### Cambiar Colores y Estilos

Los colores se definen en `client/src/index.css`. Modifica las variables CSS:

```css
:root {
  --primary: var(--color-blue-700);
  --primary-foreground: var(--color-blue-50);
  /* ... más variables */
}
```

### Agregar Más Productos

Modifica `client/src/pages/Home.tsx` para mostrar múltiples productos:

```typescript
const products = [
  { id: 1, name: "Basic", price: 9.99 },
  { id: 2, name: "Premium", price: 29.99 },
  { id: 3, name: "Enterprise", price: 99.99 },
];
```

---

## Solución de Problemas

### Error: "STRIPE_SECRET_KEY is not defined"

**Causa**: La variable de entorno no está configurada.

**Solución**:
```bash
export STRIPE_SECRET_KEY="sk_test_..."
pnpm run dev
```

### Error: "Failed to create checkout session"

**Causa**: Datos inválidos o error en Stripe API.

**Solución**:
1. Verifica que `amount` sea >= $0.50
2. Verifica que `description` no esté vacío
3. Revisa los logs del servidor para más detalles

### El botón de pago no funciona

**Causa**: El backend no está corriendo o no es accesible.

**Solución**:
1. Verifica que el servidor Express esté corriendo en puerto 3000
2. Abre la consola del navegador (F12) y busca errores de red
3. Verifica que `/api/stripe/create-checkout-session` sea accesible

### Stripe Checkout no carga

**Causa**: Clave pública de Stripe inválida.

**Solución**:
1. Verifica que `STRIPE_PUBLIC_KEY` sea correcta
2. Asegúrate de que sea una clave de prueba (comienza con `pk_test_`)
3. Revisa la consola del navegador para errores de Stripe

---

## Próximos Pasos

Para llevar esta demo a producción:

1. **Implementar autenticación real**: Reemplaza `UserContext` con un sistema de login real.
2. **Agregar base de datos**: Almacena órdenes y detalles de pagos en una base de datos.
3. **Implementar webhooks de Stripe**: Procesa eventos de pago en tiempo real.
4. **Agregar confirmación por email**: Envía recibos a los clientes.
5. **Implementar panel de administración**: Visualiza y gestiona pagos.
6. **Agregar más métodos de pago**: Tarjetas, billeteras digitales, etc.

---

## Recursos Útiles

- **Documentación de Stripe**: https://stripe.com/docs
- **Stripe Testing**: https://stripe.com/docs/testing
- **React Documentation**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **Express.js**: https://expressjs.com

---

## Soporte

Para preguntas o problemas:

1. Revisa esta documentación
2. Consulta los logs del servidor
3. Abre la consola del navegador (F12) para errores del cliente
4. Verifica la documentación oficial de Stripe

---

**Versión**: 1.0.0  
**Última actualización**: Febrero 2026  
**Autor**: Andre Tiburcio
