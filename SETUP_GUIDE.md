# Guía de Configuración - Stripe Payment Demo

## Paso 1: Obtener las Claves de Stripe

### 1.1 Crear una Cuenta en Stripe

1. Visita [stripe.com](https://stripe.com)
2. Haz clic en "Sign up" (Registrarse)
3. Completa el formulario con tu información
4. Verifica tu email

### 1.2 Acceder al Dashboard

1. Inicia sesión en [dashboard.stripe.com](https://dashboard.stripe.com)
2. En el menú izquierdo, busca "Developers" (Desarrolladores)
3. Haz clic en "API Keys" (Claves de API)

### 1.3 Obtener las Claves

En la página de API Keys, verás dos secciones: **Standard keys** (Claves estándar)

Para **desarrollo**, usa las claves de **Test mode** (Modo de prueba):

- **Publishable key** (Clave publicable): Comienza con `pk_test_`
- **Secret key** (Clave secreta): Comienza con `sk_test_`

Para **producción**, usa las claves de **Live mode** (Modo en vivo):

- **Publishable key**: Comienza con `pk_live_`
- **Secret key**: Comienza con `sk_live_`

> **⚠️ Importante**: Nunca compartas tu clave secreta. Guárdala en un lugar seguro.

---

## Paso 2: Configurar el Proyecto

### 2.1 Clonar o Descargar el Proyecto

```bash
# Si tienes acceso al repositorio
git clone <url-del-repositorio>
cd stripe-demo

# O descarga los archivos manualmente
```

### 2.2 Crear un Archivo `.env`

En la raíz del proyecto, crea un archivo llamado `.env`:

```bash
# En la raíz de stripe-demo/
touch .env
```

### 2.3 Agregar las Variables de Entorno

Abre el archivo `.env` y agrega:

```env
# Claves de Stripe (reemplaza con tus claves reales)
STRIPE_SECRET_KEY=sk_test_tu_clave_secreta_aqui
STRIPE_PUBLIC_KEY=pk_test_tu_clave_publicable_aqui

# URL del frontend (para redireccionamientos)
FRONTEND_URL=http://localhost:5173

# Entorno
NODE_ENV=development
```

**Ejemplo completo**:

```env
STRIPE_SECRET_KEY=sk_test_51234567890abcdefghijklmnopqrstuvwxyz
STRIPE_PUBLIC_KEY=pk_test_51234567890abcdefghijklmnopqrstuvwxyz
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

> **⚠️ Importante**: El archivo `.env` está en `.gitignore`, así que no se subirá a Git. Esto es seguro.

---

## Paso 3: Instalar Dependencias

```bash
# Instalar pnpm si no lo tienes
npm install -g pnpm

# Instalar todas las dependencias del proyecto
pnpm install
```

---

## Paso 4: Ejecutar el Proyecto

### 4.1 Desarrollo Local

```bash
# Iniciar el servidor de desarrollo
pnpm run dev

# El servidor estará disponible en:
# http://localhost:3000
```

### 4.2 Compilar para Producción

```bash
# Compilar el proyecto
pnpm run build

# Esto genera una carpeta 'dist' con los archivos compilados
```

### 4.3 Ejecutar en Producción

```bash
# Primero, compila el proyecto
pnpm run build

# Luego, inicia el servidor
pnpm run start

# El servidor estará disponible en:
# http://localhost:3000
```

---

## Paso 5: Probar el Flujo de Pago

### 5.1 Acceder a la Aplicación

1. Abre tu navegador
2. Ve a `http://localhost:3000`
3. Deberías ver la página de inicio con el formulario de pago

### 5.2 Realizar un Pago de Prueba

1. Verifica que el monto sea >= $0.50
2. Haz clic en "Proceed to Stripe Checkout"
3. Serás redirigido a Stripe Checkout
4. Usa una tarjeta de prueba:
   - **Número**: `4242 4242 4242 4242`
   - **Fecha**: Cualquier fecha futura (ej: 12/25)
   - **CVC**: Cualquier número de 3 dígitos (ej: 123)
5. Haz clic en "Pay" (Pagar)
6. Deberías ser redirigido a la página de éxito

### 5.3 Probar Cancelación

1. En la página de Stripe Checkout, busca el botón "Back" o simplemente cierra la pestaña
2. Serás redirigido a la página de cancelación

---

## Paso 6: Configurar para Despliegue

### 6.1 Selecciona tu Plataforma de Hosting

Opciones populares:
- **Railway**: Fácil integración con GitHub
- **Render**: Despliegue automático
- **Heroku**: Plataforma tradicional
- **DigitalOcean**: VPS con control total
- **AWS**: Escalabilidad empresarial

### 6.2 Configurar Variables de Entorno en el Hosting

En el panel de control de tu plataforma:

1. Busca la sección de "Environment Variables" (Variables de Entorno)
2. Agrega:
   - `STRIPE_SECRET_KEY`: Tu clave secreta
   - `STRIPE_PUBLIC_KEY`: Tu clave publicable
   - `FRONTEND_URL`: La URL de tu aplicación desplegada
   - `NODE_ENV`: `production`

### 6.3 Desplegar

Sigue las instrucciones de tu plataforma de hosting. Generalmente:

1. Conecta tu repositorio Git
2. Establece el comando de inicio: `pnpm run start`
3. Despliega

---

## Solución de Problemas

### Problema: "Cannot find module 'stripe'"

**Causa**: Las dependencias no están instaladas.

**Solución**:
```bash
pnpm install
```

### Problema: "STRIPE_SECRET_KEY is not defined"

**Causa**: Las variables de entorno no están configuradas.

**Solución**:
1. Verifica que el archivo `.env` exista en la raíz del proyecto
2. Verifica que contenga `STRIPE_SECRET_KEY=sk_test_...`
3. Reinicia el servidor: `pnpm run dev`

### Problema: "Failed to create checkout session"

**Causa**: Las claves de Stripe son inválidas o no están configuradas correctamente.

**Solución**:
1. Verifica que las claves sean de prueba (comienzan con `pk_test_` y `sk_test_`)
2. Verifica que no haya espacios en blanco en el archivo `.env`
3. Reinicia el servidor

### Problema: "Stripe Checkout no carga"

**Causa**: La clave pública de Stripe es inválida.

**Solución**:
1. Abre la consola del navegador (F12)
2. Busca errores de Stripe
3. Verifica que `STRIPE_PUBLIC_KEY` sea correcta
4. Reinicia el servidor

### Problema: "Port 3000 is already in use"

**Causa**: Otro proceso está usando el puerto 3000.

**Solución**:
```bash
# En Linux/Mac: Mata el proceso en el puerto 3000
lsof -ti:3000 | xargs kill -9

# O usa otro puerto
PORT=3001 pnpm run dev
```

---

## Cambiar de Modo de Prueba a Producción

> **⚠️ Importante**: Solo haz esto cuando estés listo para aceptar pagos reales.

### Paso 1: Obtener las Claves de Producción

1. En el dashboard de Stripe, desactiva el "Test mode" (Modo de prueba)
2. Copia las claves de **Live mode** (Modo en vivo)

### Paso 2: Actualizar las Variables de Entorno

```env
STRIPE_SECRET_KEY=sk_live_tu_clave_secreta_aqui
STRIPE_PUBLIC_KEY=pk_live_tu_clave_publicable_aqui
NODE_ENV=production
```

### Paso 3: Verificar la Configuración

1. Verifica que `NODE_ENV=production`
2. Verifica que las claves comiencen con `sk_live_` y `pk_live_`
3. Verifica que `FRONTEND_URL` sea tu dominio real

### Paso 4: Desplegar

Compila y despliega el proyecto en tu servidor de producción.

---

## Recursos Adicionales

- **Documentación de Stripe**: https://stripe.com/docs
- **Claves de API de Stripe**: https://dashboard.stripe.com/apikeys
- **Tarjetas de Prueba**: https://stripe.com/docs/testing
- **Webhooks de Stripe**: https://stripe.com/docs/webhooks

---

## Preguntas Frecuentes

### ¿Es seguro usar tarjetas de prueba?

Sí. Las tarjetas de prueba de Stripe nunca cobran dinero real. Solo funcionan en modo de prueba.

### ¿Puedo cambiar el monto predeterminado?

Sí. Edita `client/src/pages/Home.tsx` y cambia el valor inicial de `amount`.

### ¿Cómo agrego más usuarios?

Edita `client/src/contexts/UserContext.tsx` y cambia el usuario por defecto, o implementa un sistema de autenticación real.

### ¿Cómo almaceno los datos de los pagos?

Necesitas una base de datos. Puedes usar PostgreSQL, MongoDB, etc. Agrega un modelo de datos y guarda la información después de cada pago exitoso.

### ¿Cómo envío confirmaciones por email?

Usa un servicio como SendGrid, Mailgun o AWS SES. Integra la API en la página de éxito.

---

**Versión**: 1.0.0  
**Última actualización**: Febrero 2026
