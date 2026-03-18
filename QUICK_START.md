# 🚀 Stripe Payment Demo - Quick Start Guide

## ✅ Configuración Correcta

Este proyecto tiene **dos servidores que corren en paralelo**:
1. **Backend Express**: Puerto 3000 (maneja API de Stripe)
2. **Frontend Vite**: Puerto 5173 (interfaz React)

El frontend tiene un **proxy configurado** que redirige todas las llamadas a `/api/*` al backend en puerto 3000.

---

## 🔧 Instalación Correcta - Paso a Paso

### Paso 1: Descomprimir y entrar al directorio

```bash
unzip stripe-demo-final.zip
cd stripe-demo
```

### Paso 2: CREAR ARCHIVO `.env` (ESTO ES IMPORTANTE)

En la raíz del proyecto (mismo nivel que `package.json`), crea un archivo llamado **`.env`** (sin extensión):

#### En Windows (Notepad):
1. Abre Notepad
2. Copia esto:
```
STRIPE_SECRET_KEY=sk_test_tu_clave_secreta_aqui
STRIPE_PUBLIC_KEY=pk_test_tu_clave_publicable_aqui
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```
3. Guarda como: `Nombre: .env` | `Tipo: Todos los archivos`
4. Coloca el archivo en la carpeta `stripe-demo/`

#### En Mac/Linux (Terminal):
```bash
cat > .env << EOF
STRIPE_SECRET_KEY=sk_test_tu_clave_secreta_aqui
STRIPE_PUBLIC_KEY=pk_test_tu_clave_publicable_aqui
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
EOF
```

### Paso 3: Reemplazar con tus claves reales

Edita el archivo `.env` y reemplaza:
- `sk_test_tu_clave_secreta_aqui` → Tu clave secreta real de Stripe
- `pk_test_tu_clave_publicable_aqui` → Tu clave pública real de Stripe

**Obtén tus claves en**: https://dashboard.stripe.com/apikeys

**Ejemplo completo:**
```
STRIPE_SECRET_KEY=sk_test_51234567890abcdefghijklmnopqrstuvwxyz
STRIPE_PUBLIC_KEY=pk_test_51234567890abcdefghijklmnopqrstuvwxyz
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Paso 4: Instalar dependencias

```bash
npm install -g pnpm
pnpm install
```

### Paso 5: Ejecutar CORRECTAMENTE

```bash
pnpm run dev
```

Deberías ver:
```
[0] ✅ Server running on http://localhost:3000/
[0] ✅ Stripe integration ready
[1] ➜  Local:   http://localhost:5173/
```

---

## 🌐 Acceder a la Aplicación

Una vez que ejecutes `pnpm run dev`, abre tu navegador en:

```
http://localhost:5173
```

**Nota**: El frontend corre en puerto 5173, el backend en 3000. El proxy redirige automáticamente las llamadas a `/api/*` al backend.

---

## 🧪 Probar el Pago

1. En la página de inicio, verás el formulario de pago
2. Haz clic en **"Proceed to Stripe Checkout"**
3. Usa la tarjeta de prueba:
   - **Número**: `4242 4242 4242 4242`
   - **Fecha**: Cualquier fecha futura (ej: 12/25)
   - **CVC**: Cualquier número de 3 dígitos (ej: 123)
4. Haz clic en **"Pay"**
5. Deberías ser redirigido a la página de éxito

---

## 🔍 Verificar que Todo Funciona

### Verificar que el Backend está corriendo

Abre una nueva terminal y ejecuta:

```bash
curl http://localhost:3000/api/stripe/public-key
```

Deberías ver una respuesta JSON con tu clave pública de Stripe:
```json
{"publicKey":"pk_test_..."}
```

### Verificar que el Frontend está corriendo

Abre tu navegador en `http://localhost:5173` y deberías ver la página de inicio.

---

## ❌ Solución de Problemas

### Error: "Neither apiKey nor config.authenticator provided"

**Causa**: El archivo `.env` no existe o no tiene `STRIPE_SECRET_KEY`.

**Solución**:
1. Verifica que el archivo `.env` exista en la raíz del proyecto
2. Verifica que contenga `STRIPE_SECRET_KEY=sk_test_...`
3. Verifica que no haya espacios en blanco antes o después
4. Reinicia: `pnpm run dev`

### Error: "POST http://localhost:5173/api/stripe/create-checkout-session 404"

**Causa**: El backend Express no está corriendo o el proxy no está configurado.

**Solución**:
1. Asegúrate de ejecutar `pnpm run dev` (no solo `pnpm run dev:frontend`)
2. Verifica que veas dos procesos en la terminal:
   - `[0] ✅ Server running on http://localhost:3000/`
   - `[1] ➜  Local:   http://localhost:5173/`
3. Verifica que `vite.config.ts` tenga el proxy configurado

### Error: "Port 3000 is already in use"

**Causa**: Otro proceso está usando el puerto 3000.

**Solución**:
```bash
# En Windows (PowerShell como admin)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# En Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Error: "Port 5173 is already in use"

**Causa**: Otro proceso está usando el puerto 5173.

**Solución**:
```bash
# En Mac/Linux
lsof -ti:5173 | xargs kill -9

# O usa otro puerto
VITE_PORT=5174 pnpm run dev
```

### Error: "Cannot find module 'dotenv'"

**Causa**: Las dependencias no están instaladas.

**Solución**:
```bash
pnpm install
```

### Stripe Checkout no carga

**Causa**: La clave pública de Stripe es inválida.

**Solución**:
1. Abre la consola del navegador (F12)
2. Busca errores de Stripe
3. Verifica que `STRIPE_PUBLIC_KEY` sea correcta en `.env`
4. Reinicia: `pnpm run dev`

---

## 📁 Estructura del Proyecto

```
stripe-demo/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx      # Formulario de pago
│   │   │   ├── Success.tsx   # Página de éxito
│   │   │   └── Cancel.tsx    # Página de cancelación
│   │   ├── contexts/
│   │   │   └── UserContext.tsx # Usuario por defecto
│   │   └── App.tsx           # Rutas principales
│   └── index.html
├── server/
│   └── index.ts              # Backend Express con API de Stripe
├── vite.config.ts            # Configuración de Vite con proxy
├── .env                      # Variables de entorno (CREAR ESTO)
├── package.json              # Scripts y dependencias
├── ENV_TEMPLATE.txt          # Plantilla de .env
└── QUICK_START.md           # Este archivo
```

---

## 🚢 Despliegue en Producción

### Compilar para Producción

```bash
pnpm run build
```

Esto genera:
- Carpeta `dist/` con el código compilado

### Ejecutar en Producción

```bash
pnpm run start
```

---

## 💡 Comandos Útiles

| Comando | Descripción |
|---------|-------------|
| `pnpm run dev` | Ejecuta frontend y backend juntos |
| `pnpm run dev:frontend` | Solo frontend (Vite en puerto 5173) |
| `pnpm run dev:backend` | Solo backend (Express en puerto 3000) |
| `pnpm run build` | Compila para producción |
| `pnpm run start` | Ejecuta en producción |
| `pnpm run check` | Verifica tipos TypeScript |
| `pnpm run format` | Formatea el código |

---

## 🎯 Próximos Pasos

1. **Personalizar el usuario**: Edita `client/src/contexts/UserContext.tsx`
2. **Cambiar colores**: Edita `client/src/index.css`
3. **Agregar más productos**: Modifica `client/src/pages/Home.tsx`
4. **Implementar base de datos**: Guarda órdenes en una BD
5. **Agregar webhooks de Stripe**: Procesa eventos en tiempo real

---

## 📚 Documentación Completa

- **README.md** - Descripción general
- **DOCUMENTATION.md** - Documentación técnica detallada
- **SETUP_GUIDE.md** - Guía de configuración paso a paso
- **ENV_TEMPLATE.txt** - Plantilla del archivo .env

---

## ✅ Checklist de Configuración

- [ ] Archivo `.env` creado en la raíz del proyecto
- [ ] `.env` contiene `STRIPE_SECRET_KEY=sk_test_...`
- [ ] `.env` contiene `STRIPE_PUBLIC_KEY=pk_test_...`
- [ ] `pnpm install` ejecutado
- [ ] `pnpm run dev` ejecutado correctamente
- [ ] Veo dos procesos (Backend en 3000 + Frontend en 5173)
- [ ] Puedo acceder a `http://localhost:5173`
- [ ] Puedo hacer un pago de prueba

---

**¡Listo! Tu demo de Stripe está funcionando. 🎉**

Si tienes problemas, revisa la sección "Solución de Problemas" arriba.
