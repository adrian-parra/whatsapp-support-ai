# 🎤 Flow de Voceos

Este módulo implementa la funcionalidad para consultar voceos del sistema a través del bot de WhatsApp.

## 📋 Características

### Comandos Disponibles
- `voceos` / `voceo` / `llamadas` - Consulta detallada de voceos
- `stats` / `estadisticas voceos` - Estadísticas resumidas por departamento
- `ayuda voceos` / `help voceos` - Ayuda del comando

### Funcionalidades
- ✅ Consulta por rango de fechas
- ✅ Filtrado opcional por departamento
- ✅ Validación de fechas y formatos
- ✅ Limitación de rango (máximo 31 días)
- ✅ Estadísticas por departamento
- ✅ Formateo legible de fechas
- ✅ Manejo de errores

## 🔧 Configuración de Base de Datos

### Conexión SQL Server
```javascript
const dbConfig = {
    server: '172.30.73.8',
    database: 'lanpointCs',
    user: 'lanpoint',
    password: 'syslanpoint',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};
```

### Tabla Objetivo
- **Tabla**: `TBL_LineID_DepartmentID`
- **Base de datos**: `LanpointCs`
- **Esquema**: `dbo`

## 📊 Campos Consultados

| Campo | Descripción |
|-------|-------------|
| LineID | ID de la línea |
| DepartmentID | ID del departamento |
| ProblemID | ID del problema |
| DateRegister | Fecha de registro |
| Status | Estado del voceo |
| DateVoice | Fecha del voceo |
| Desktop | Escritorio asociado |
| Area | Área del voceo |

## 🚀 Uso del Comando

### Consulta Básica
1. Usuario escribe: `voceos`
2. Bot solicita: Fecha de inicio (YYYY-MM-DD)
3. Usuario responde: `2025-01-15`
4. Bot solicita: Fecha de fin (YYYY-MM-DD)
5. Usuario responde: `2025-01-16`
6. Bot solicita: Departamento (003 o "todos")
7. Usuario responde: `003` o `todos`
8. Bot muestra: Resultados formateados

### Consulta de Estadísticas
1. Usuario escribe: `stats`
2. Bot solicita: Fecha de inicio
3. Usuario responde: `2025-01-15`
4. Bot solicita: Fecha de fin
5. Usuario responde: `2025-01-16`
6. Bot muestra: Estadísticas por departamento

## 📝 Validaciones Implementadas

### Fechas
- ✅ Formato YYYY-MM-DD obligatorio
- ✅ Fechas válidas (no futuras para inicio)
- ✅ Fecha fin >= fecha inicio
- ✅ Rango máximo de 31 días

### Departamento
- ✅ Formato de 3 dígitos (ej: 003)
- ✅ Opción "todos" para consultar todos los departamentos
- ✅ Validación de entrada

## 🔍 Ejemplos de Respuesta

### Consulta con Resultados
```
🎤 Consulta de Voceos

📅 Período: 2025-01-15 al 2025-01-16
🏢 Departamento: 003
📊 Total de registros: 5

📋 Detalle de Voceos:

1. 📞 LineID: 12345
   🏢 Depto: 003
   🔧 Problema: PROB001
   📅 Fecha: Miércoles, 15 de enero del 2025 a las 14:30:00
   📊 Estado: Activo
   🎤 Fecha Voceo: 15/1/2025 14:35:00
   💻 Desktop: PC001
   📍 Área: Producción
```

### Estadísticas
```
📊 Estadísticas de Voceos

📅 Período: 2025-01-15 al 2025-01-16

📈 Total General: 25 voceos

🏢 Por Departamento:

1. Depto 003: 15 voceos
   ✅ Activos: 12
   ❌ Inactivos: 3

2. Depto 001: 10 voceos
   ✅ Activos: 8
   ❌ Inactivos: 2
```

## ⚡ Optimizaciones

### Performance
- Límite de 1000 registros por consulta
- Índices recomendados en DateRegister y DepartmentID
- Conexiones de base de datos con pool
- Cierre automático de conexiones

### UX
- Mensajes de "procesando" para consultas largas
- Validación en tiempo real
- Mensajes de error descriptivos
- Limpieza automática del estado

## 🛠️ Mantenimiento

### Logs
Todos los errores se registran en consola con:
```javascript
console.error('Error al consultar voceos:', error);
```

### Monitoreo
- Tiempo de respuesta de consultas
- Errores de conexión a BD
- Validación de parámetros

## 🔒 Seguridad

### Parámetros SQL
- ✅ Uso de parámetros preparados
- ✅ Validación de entrada
- ✅ Sanitización de datos
- ✅ Manejo seguro de conexiones

### Limitaciones
- Máximo 31 días de consulta
- Máximo 1000 registros
- Validación estricta de formatos

## 📞 Soporte

Para problemas o mejoras, contactar al equipo de desarrollo del bot de WhatsApp.