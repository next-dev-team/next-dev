// Tron Plugin Entry Point (optional for future host integrations)
const plugin = {
  manifest: {
    name: 'Web Counter Plugin',
    version: '0.1.0',
    description: 'A simple counter demonstration plugin',
    type: 'ui',
    permissions: ['storage']
  },
  async initialize(api) {
    console.log('[Web Counter Plugin] initialized with api', api?.id)
    this.api = api
  },
  async destroy() {
    console.log('[Web Counter Plugin] destroyed')
  }
}

const hooks = {
  onPluginLoad: () => { console.log('[Web Counter Plugin] onPluginLoad') },
  onPluginUnload: () => { console.log('[Web Counter Plugin] onPluginUnload') }
}

const api = {
  getCount: () => 0,
  setCount: (value) => { console.log('[Web Counter Plugin] setCount:', value) }
}

module.exports = { plugin, hooks, api, default: plugin }