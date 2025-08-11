# 📋 Comando Checadas - WhatsApp Bot

## Descripción
Este comando permite consultar las checadas de empleados desde la base de datos SQL Server `Checadas_Sinaloa` a través del bot de WhatsApp.

## 🚀 Funcionalidades Implementadas

### 1. Comando Principal: `checadas`
- **Palabras clave:** `checadas`, `checada`, `asistencia`
- **Función:** Consulta las checadas de un empleado en un período específico
- **Interacción:** Solicita datos paso a paso al usuario

### 2. Comando de Ayuda: `ayuda checadas`
- **Palabras clave:** `ayuda checadas`, `help checadas`
- **Función:** Muestra información detallada sobre cómo usar el comando

## 📊 Datos de Conexión
- **Servidor:** 172.30.184.76
- **Base de Datos:** Checadas_Sinaloa
- **Usuario:** lanpoint
- **Contraseña:** syslanpoint
- **Tabla:** TBL_ChecadasSinaloa

## 🔧 Archivos Creados/Modificados

### Nuevos Archivos:
1. **`src/services/checadas.service.js`**
   - Servicio para manejar la conexión a SQL Server
   - Métodos para consultar y formatear checadas
   - Manejo de errores y validaciones

2. **`src/flows/checadas/checadas.flow.js`**
   - Flow principal para el comando checadas
   - Flow de ayuda con instrucciones
   - Validaciones de entrada y manejo de estados

### Archivos Modificados:
1. **`src/flows/index.js`**
   - Importación y registro de los nuevos flows

2. **`package.json`**
   - Agregada dependencia `mssql` para SQL Server

## 💬 Uso del Comando

### Ejemplo de Conversación:
```
Usuario: checadas

Bot: 📋 Consulta de Checadas 📋

Para consultar las checadas, necesito los siguientes datos:

👤 Por favor, ingresa el ID del empleado:

Usuario: 256553

Bot: 📅 Ahora ingresa la fecha de inicio en formato YYYY-MM-DD
(Ejemplo: 2025-01-15):

Usuario: 2025-01-09

Bot: 📅 Por último, ingresa la fecha de fin en formato YYYY-MM-DD
(Ejemplo: 2025-01-15):

Usuario: 2025-01-10

Bot: 🔍 Consultando checadas... Por favor espera un momento.

📋 Consulta de Checadas

👤 Empleado: 256553
📅 Período: 2025-01-09 al 2025-01-10
📊 Total de registros: 4

⏰ Detalle de Checadas:

1. Jueves, 9 de enero del 2025 a las 08:00:00
2. Jueves, 9 de enero del 2025 a las 12:00:00
3. Jueves, 9 de enero del 2025 a las 13:00:00
4. Jueves, 9 de enero del 2025 a las 17:00:00
```

## ✅ Validaciones Implementadas

1. **ID de Empleado:**
   - No puede estar vacío
   - Debe contener solo números

2. **Fechas:**
   - Formato obligatorio: YYYY-MM-DD
   - Deben ser fechas válidas
   - La fecha de fin no puede ser anterior a la fecha de inicio

3. **Base de Datos:**
   - Manejo de errores de conexión
   - Timeout y reconexión automática
   - Mensajes de error amigables

## 🔍 Consulta SQL Utilizada

La consulta incluye:
- Todos los campos de la tabla `TBL_ChecadasSinaloa`
- Campo calculado `FechaHoraLegible` con formato en español
- Filtros por EmployeeID y rango de fechas
- Ordenamiento por fecha ascendente

## 🚀 Instalación y Configuración

1. **Instalar dependencia:**
   ```bash
   npm install mssql
   ```

2. **Ejecutar el bot:**
   ```bash
   npm run dev
   ```

3. **Probar el comando:**
   - Enviar "checadas" al bot por WhatsApp
   - Seguir las instrucciones paso a paso

## 🛠️ Mantenimiento

- Los logs de errores se muestran en la consola del servidor
- La conexión a la base de datos se cierra automáticamente después de cada consulta
- El estado del usuario se limpia automáticamente al finalizar o en caso de error

## 📞 Soporte

Para obtener ayuda sobre el comando, los usuarios pueden escribir:
- `ayuda checadas`
- `help checadas`

Esto mostrará las instrucciones completas de uso.