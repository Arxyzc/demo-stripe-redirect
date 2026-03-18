# Stripe Payment Demo

Una aplicación web moderna para demostrar el flujo completo de pagos con **Stripe Checkout**. Construida con **React 19**, **TypeScript**, **Tailwind CSS 4** y **Express.js**.

## 🚀 Características

- ✅ **Flujo de Stripe Checkout** con redireccionamiento seguro
- ✅ **Backend Express.js** que maneja las API keys de forma segura
- ✅ **Usuario por defecto** - sin autenticación requerida
- ✅ **Páginas de confirmación** - éxito y cancelación
- ✅ **Interfaz moderna** - diseño limpio y profesional
- ✅ **TypeScript** - tipado completo para mayor seguridad

## 📋 Requisitos

- Node.js 18+ (recomendado 22+)
- pnpm 10+ (o npm/yarn)
- Cuenta en Stripe (gratuita)

## 🔧 Configuración Rápida

### 1. Clonar el Proyecto

```bash
git clone <url-del-repositorio>
cd stripe-demo
```

### 2. Instalar Dependencias

```bash
pnpm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz:

```env
STRIPE_SECRET_KEY=sk_test_tu_clave_aqui
STRIPE_PUBLIC_KEY=pk_test_tu_clave_aqui
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

> Obtén tus claves en [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)

### 4. Ejecutar en Desarrollo

```bash
pnpm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🧪 Probar el Pago

1. En la página de inicio, haz clic en "Proceed to Stripe Checkout"
2. Usa la tarjeta de prueba: **4242 4242 4242 4242**
3. Cualquier fecha futura y CVC (ej: 12/25, 123)
4. Completa el pago

## 📁 Estructura del Proyecto

```
stripe-demo/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── pages/            # Páginas (Home, Success, Cancel)
│   │   ├── contexts/         # Contextos (User, Theme)
│   │   ├── components/       # Componentes reutilizables
│   │   └── App.tsx           # Rutas principales
│   └── index.html
├── server/
│   └── index.ts              # Backend Express con rutas de Stripe
├── package.json
├── DOCUMENTATION.md          # Documentación completa
└── SETUP_GUIDE.md           # Guía de configuración
```

## 🔌 Rutas de API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/stripe/public-key` | Obtiene la clave pública de Stripe |
| POST | `/api/stripe/create-checkout-session` | Crea una sesión de pago |
| POST | `/api/stripe/verify-session` | Verifica el estado de un pago |

## 📚 Documentación

- **[DOCUMENTATION.md](./DOCUMENTATION.md)** - Documentación completa del proyecto
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Guía paso a paso de configuración

## 🚢 Despliegue

### Compilar para Producción

```bash
pnpm run build
```

### Ejecutar en Producción

```bash
pnpm run start
```

### Desplegar en Railway, Render, Heroku, etc.

1. Conecta tu repositorio Git
2. Configura las variables de entorno
3. Establece el comando de inicio: `pnpm run start`
4. Despliega

## 🛠️ Personalización

### Cambiar el Usuario

Edita `client/src/contexts/UserContext.tsx`:

```typescript
const DEFAULT_USER: User = {
  id: "tu-id",
  name: "Tu Nombre",
  email: "tu-email@example.com",
};
```

### Cambiar Colores

Edita `client/src/index.css` y modifica las variables CSS.

### Agregar Más Productos

Modifica `client/src/pages/Home.tsx` para mostrar múltiples productos.

## 🐛 Solución de Problemas

### "STRIPE_SECRET_KEY is not defined"

Verifica que el archivo `.env` exista y contenga las claves correctas.

### "Failed to create checkout session"

Asegúrate de que:
- Las claves de Stripe sean válidas
- El monto sea >= $0.50
- El servidor Express esté corriendo

### "Stripe Checkout no carga"

Abre la consola del navegador (F12) y busca errores de Stripe.

## 📖 Recursos

- [Documentación de Stripe](https://stripe.com/docs)
- [Tarjetas de Prueba](https://stripe.com/docs/testing)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)

## 📝 Licencia

MIT

## 👨‍💻 Autor

Creado por **Andre Tiburcio** - Febrero 2026

---

¿Preguntas? Consulta [DOCUMENTATION.md](./DOCUMENTATION.md) o [SETUP_GUIDE.md](./SETUP_GUIDE.md).
