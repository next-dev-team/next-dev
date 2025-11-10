// Tron Plugin Entry Point
const plugin = {
  manifest: {
    name: 'Todo Plugin',
    version: '1.0.1',
    description: 'A modern React-based todo app plugin with task management, filtering, and persistent storage',
    type: 'ui',
    permissions: ['storage']
  },
  
  async initialize(api) {
    console.log('[Todo Plugin] initialized with api', api.id);
    this.api = api;
  },
  
  async destroy() {
    console.log('[Todo Plugin] destroyed');
  }
};

const hooks = {
  onPluginLoad: () => {
    console.log('[Todo Plugin] onPluginLoad hook');
  },
  onPluginUnload: () => {
    console.log('[Todo Plugin] onPluginUnload hook');
  }
};

const api = {
  getTodos: () => {
    // Return todos from storage or state
    return [];
  },
  addTodo: (todo) => {
    // Add todo logic
    console.log('[Todo Plugin] Adding todo:', todo);
  }
};

// CommonJS exports for plugin system compatibility
module.exports = {
  plugin,
  hooks,
  api,
  default: plugin
};