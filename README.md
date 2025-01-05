# 🤖 Chatbot con AI21 Studio

## 📋 Descripción
Bot de WhatsApp integrado con AI21 Studio para proporcionar respuestas inteligentes a los usuarios. El bot procesa mensajes en tiempo real y utiliza la API de AI21 para generar respuestas contextuales.

## 🚀 Características
- Integración con WhatsApp mediante bot
- Procesamiento de mensajes con AI21 Studio
- Respuestas en tiempo real
- Mensajes informativos sobre el estado del proceso
- Indicador visual de respuestas de IA

## 🛠️ Tecnologías Utilizadas
- Node.js
- AI21 Studio API
- builderbot

## ⚙️ Requisitos Previos
- Node.js (versión 14.0.0 o superior)
- API Key de AI21 Studio
- Cuenta de WhatsApp activa

## 🔧 Instalación

1. Clona el repositorio:
git clone [URL_DEL_REPOSITORIO]

2. Instala las dependencias:
npm install

3. Configura las variables de entorno:
```env
# Crea un archivo .env con las siguientes variables
AI21_API_KEY=tu_api_key_aqui
```

## 🚀 Uso

1. Inicia el servidor:
```bash
npm run dev
```

2. Escanea el código QR con WhatsApp

3. ¡Listo! El bot está funcionando y responderá a los mensajes

## 📝 Estructura del Proyecto
```
├── src/
│   ├── flows/
│   │   ├── index.js
│   │   ├── welcome/
│   │   │   ├── index.js
│   │   │   └── welcome.flow.js
│   │   ├── support/
│   │   │   ├── index.js
│   │   │   ├── support.flow.js
│   │   │   ├── hardware.flow.js
│   │   │   ├── software.flow.js
│   │   │   └── network.flow.js
│   │   ├── tickets/
│   │   │   ├── index.js
│   │   │   ├── status.flow.js
│   │   │   ├── feedback.flow.js
│   │   │   └── survey.flow.js
│   │   ├── equipment/
│   │   │   ├── index.js
│   │   │   └── request.flow.js
│   │   └── utils/
│   │       ├── index.js
│   │       ├── knowledge-base.js
│   │       └── diagnostic.flow.js
│   ├── services/
│   │   └── ai21.service.js
│   └── app.js
├── .env
├── package.json
└── README.md
```

## 🤖 Ejemplos de Uso

### Flujo de interacción:
1. Usuario envía un mensaje al bot
2. Bot responde: "🤖 Procesando tu mensaje..."
3. Bot informa: "ℹ️ Nota importante: Esta IA no guarda el contexto..."
4. La IA procesa y responde con "🤖 [Respuesta generada]"

## ⚠️ Limitaciones
- La IA no mantiene contexto entre conversaciones
- Las respuestas pueden tomar algunos segundos dependiendo de la complejidad
- Se requiere una conexión estable a internet

## 🔐 Variables de Entorno
```env
AI21_API_KEY=tu_api_key_aqui
```

## Sistema de Soporte Automatizado

El bot incluye un sistema de soporte técnico automatizado que permite a los usuarios gestionar diferentes tipos de solicitudes sin necesidad de intervención humana directa. 

### Características del Soporte

- **Menú Interactivo**: Sistema de navegación basado en números (1-8) para fácil acceso
- **Categorías Principales**:
  - Problemas con Hardware
  - Problemas con Software
  - Accesos y Credenciales
  - Solicitud de Equipo Nuevo
  - Reporte de Incidentes
  - Consulta de Estado de Tickets
  - FAQ/Ayuda Rápida

### Funcionalidades Destacadas

- Sistema de tickets automatizado
- Guías paso a paso para problemas comunes
- Respuestas predefinidas para consultas frecuentes
- Formato estructurado para reportar incidentes
- Sistema de escalamiento para casos urgentes
- Acceso directo a contactos de soporte

### Cómo Usar

Los usuarios pueden acceder al sistema de soporte utilizando las palabras clave:
- `soporte`
- `ayuda`
- `help`
- `it`

## 👥 Contribución
Si deseas contribuir al proyecto:
1. Haz un Fork
2. Crea una rama para tu feature (`git checkout -b feature/NuevaFuncionalidad`)
3. Commit tus cambios (`git commit -m 'Agregando nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/NuevaFuncionalidad`)
5. Abre un Pull Request

## 📄 Licencia
MIT License - ver archivo LICENSE.md para más detalles

## 📞 Contacto
[Tu nombre] - [Tu email]
Link del proyecto: [URL_DEL_REPOSITORIO]

## 🙏 Agradecimientos
- AI21 Studio por proporcionar la API
- La comunidad de desarrolladores de builderbot
- Todos los contribuidores del proyecto



