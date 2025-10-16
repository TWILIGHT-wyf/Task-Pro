import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer'

// 导入所有的mock文件
const modules = import.meta.globEager('./mock/*.js')

const mockModules = []
Object.keys(modules).forEach((key) => {
  if (key.includes('/mock/')) {
    mockModules.push(...modules[key].default)
  }
})

/**
 * Used in a production environment. Need to manually import all modules
 */
export function setupProdMockServer() {
  createProdMockServer(mockModules)
}
