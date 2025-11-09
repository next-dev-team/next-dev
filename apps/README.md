# Tron Core - Plugin-Based Electron Application

A modern, plugin-based Electron application framework that supports both built-in and external plugins. This project demonstrates a complete plugin architecture with a counter demo plugin.

## 🏗️ Project Structure

```
apps/
├── tron-core/                 # Main Electron application
│   ├── src/
│   │   ├── main/             # Main process (Electron backend)
│   │   ├── renderer/         # Renderer process (React frontend)
│   │   └── shared/           # Shared types and utilities
│   ├── plugins/              # Built-in plugins directory
│   │   └── counter-plugin/   # Counter demo plugin (built-in)
│   └── dist/                 # Build output
├── tron-counter-plugin/       # Counter demo plugin (standalone)
│   ├── src/
│   │   ├── Counter.tsx       # React counter component
│   │   ├── plugin.ts         # Plugin entry point
│   │   └── store.ts          # Zustand state management
│   └── dist/                 # Plugin build output
└── build.sh                  # Build script for both projects
```

## 🚀 Features

### Tron Core (Main Application)
- **Plugin Architecture**: Modular plugin system with built-in and external plugin support
- **Security**: Plugin validation, permission system, and sandboxing
- **Database**: In-memory storage for plugin data and management
- **IPC Communication**: Secure communication between main and renderer processes
- **Plugin Manager**: UI for installing, loading, and managing plugins
- **Development Mode**: Hot reloading and development tools for plugins

### Counter Plugin (Demo)
- **Interactive Counter**: Increment, decrement, and reset functionality
- **State Persistence**: Save and load counter state using plugin API
- **Modern UI**: Gradient design with glassmorphism effects
- **Responsive**: Works across different screen sizes
- **Plugin API Integration**: Full integration with Tron Core's plugin system

## 🛠️ Development Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or pnpm

### Quick Start

1. **Clone and navigate to the project:**
   ```bash
   cd apps
   ```

2. **Run the build script:**
   ```bash
   ./build.sh
   ```

3. **Start development:**
   ```bash
   # Start the main application
   cd tron-core && npm run electron:dev
   
   # Or start the counter plugin in development mode
   cd tron-counter-plugin && npm run dev
   ```

### Manual Setup

1. **Install dependencies:**
   ```bash
   cd apps
   npm install
   cd tron-core && npm install
   cd ../tron-counter-plugin && npm install
   ```

2. **Build the counter plugin:**
   ```bash
   cd tron-counter-plugin
   npm run build:plugin
   ```

3. **Build and run tron-core:**
   ```bash
   cd ../tron-core
   npm run build
   npm run electron:dev
   ```

## 📦 Build Process

### Plugin Development
The counter plugin can be built in two modes:
- **Web Mode**: `npm run build` - Creates a web version for testing
- **Plugin Mode**: `npm run build:plugin` - Creates plugin bundles (ES module and CommonJS)

### Application Build
The main application build process:
1. Builds the counter plugin in plugin mode
2. Copies the plugin to the built-in plugins directory
3. Builds the tron-core Electron application
4. Packages everything for distribution

## 🔌 Plugin System

### Plugin Architecture
- **Manifest-based**: Each plugin has a `package.json` with `tron-plugin` configuration
- **Type Support**: UI plugins and background plugins
- **Permission System**: Plugins declare required permissions
- **API Bridge**: Secure communication between plugins and the main application
- **Lifecycle Management**: Proper initialization and cleanup of plugins

### Plugin API
Plugins have access to:
- **Data Storage**: `getData()` and `setData()` for persistent storage
- **Messaging**: `sendMessage()` and `onMessage()` for inter-plugin communication
- **UI Integration**: Automatic window creation for UI plugins

### Creating a Plugin

1. **Create plugin structure:**
   ```
   my-plugin/
   ├── package.json
   ├── src/
   │   ├── plugin.ts    # Plugin entry point
   │   └── index.html   # UI (for UI plugins)
   └── dist/            # Build output
   ```

2. **Define plugin manifest in package.json:**
   ```json
   {
     "name": "my-plugin",
     "tron-plugin": {
       "name": "My Plugin",
       "version": "1.0.0",
       "description": "My awesome plugin",
       "type": "ui",
       "permissions": ["storage"]
     }
   }
   ```

3. **Implement plugin interface:**
   ```typescript
   export const plugin = {
     manifest: manifest,
     async initialize(api: PluginAPI) {
       // Plugin initialization logic
     },
     async destroy() {
       // Cleanup logic
     }
   };
   ```

## 🧪 Testing

### Plugin System Test
Run the comprehensive plugin system test:
```bash
cd tron-core
npx ts-node test-plugin-system.ts
```

### Unit Tests
Both projects include test suites:
```bash
# Test tron-core
cd tron-core && npm test

# Test counter plugin
cd tron-counter-plugin && npm test
```

## 📁 Build Outputs

### Tron Core
- `dist/main/` - Main process bundle
- `dist/renderer/` - Renderer process bundle
- `plugins/` - Built-in plugins directory

### Counter Plugin
- `dist/plugin.js` - ES module plugin bundle
- `dist/plugin.cjs` - CommonJS plugin bundle
- `dist/index.html` - Web version for testing

## 🔧 Configuration

### Vite Configuration
- **tron-core**: Separate configs for main and renderer processes
- **tron-counter-plugin**: Dual-mode build (web and plugin)

### TypeScript Configuration
- Strict type checking enabled
- ES2020 target for modern JavaScript features
- Path aliases for clean imports

## 🚀 Deployment

### Development
- Use `npm run electron:dev` for hot reloading
- Plugins can be loaded from development directories
- Debug tools and logging enabled

### Production
- Use `npm run build` for production builds
- Electron Builder creates platform-specific installers
- Plugins are bundled and optimized

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📄 License

MIT License - see individual project LICENSE files for details.

## 🆘 Troubleshooting

### Common Issues

1. **Plugin not loading:**
   - Check plugin manifest format
   - Verify plugin entry point exists
   - Check console for error messages

2. **Build failures:**
   - Ensure all dependencies are installed
   - Check Node.js version compatibility
   - Clear node_modules and reinstall

3. **Electron app not starting:**
   - Check if build completed successfully
   - Verify Electron is installed
   - Check main process logs

### Debug Mode
Enable debug logging:
```bash
DEBUG=tron:* npm run electron:dev
```

## 📚 Documentation

- [Plugin Development Guide](docs/plugin-development.md)
- [API Reference](docs/api-reference.md)
- [Architecture Overview](docs/architecture.md)

---

Built with ❤️ using Electron, React, TypeScript, and Vite.