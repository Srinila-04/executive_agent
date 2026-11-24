import { api } from './axios'

export const connectorsApi = {
  async getStatus() {
    const { data } = await api.get('/api/connectors/status')
    return data
  },

  async testConnection(payload) {
    const { data } = await api.post('/api/connectors/test', payload)
    return data
  },

  async connect(payload) {
    const { data } = await api.post('/api/connectors/connect', payload)
    return data
  },

  async seedData() {
    const { data } = await api.post('/api/connectors/seed')
    return data
  },

  async syncData() {
    const { data } = await api.post('/api/connectors/sync')
    return data
  },
}
