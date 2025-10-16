import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

// 计算容器内可展示的行数，默认最小行数 5，行高默认 56，可按实际样式微调
export function useResponsivePageSize(options = {}) {
  const {
    rowHeight = 56,
    minRows = 5,
    // 当一个数据项实际会占用超过1行的空间（如树形结构附带祖先行），可提高该系数以降低每页条数
    rowFactor = 1,
    // 预留若干行的安全缓冲，避免边界情况下出现溢出
    reserveRows = 0,
    // 是否在渲染后检测容器溢出并自动收敛 pageSize
    autoClampOverflow = true,
    // 单次计算内最多尝试向下收敛的次数，避免死循环
    clampTries = 3,
    containerRef = ref(null),
    pageSizeRef, // 必传：来自 useTableOperations 的 pageSize ref
    onChange // 可选：当行数变化时触发（通常用于触发 fetchData）
  } = options

  if (!pageSizeRef) {
    throw new Error('useResponsivePageSize: pageSizeRef is required')
  }

  let resizeTimer = null

  const compute = async () => {
    const el = containerRef.value
    if (!el) return
    const h = el.clientHeight || 0
    if (!h) return
    const effectivePerRow = Math.max(1, rowFactor) * rowHeight
    let rows = Math.floor(h / effectivePerRow)
    rows = Math.max(minRows, rows - Math.max(0, reserveRows))
    if (rows !== pageSizeRef.value) {
      pageSizeRef.value = rows
      if (typeof onChange === 'function') await onChange(rows)
      await nextTick()
    }

    if (!autoClampOverflow) return

    // 渲染后溢出检测：若内容超出容器高度，逐步减少 pageSizeRef 并刷新
    let tries = 0
    while (tries < clampTries) {
      const root = containerRef.value
      if (!root) break
      const overflow = (root.scrollHeight - 1) > root.clientHeight // 略给1px容差
      if (!overflow) break
      const nextSize = Math.max(minRows, (pageSizeRef.value || rows) - 1)
      if (nextSize === pageSizeRef.value) break
      pageSizeRef.value = nextSize
      if (typeof onChange === 'function') await onChange(nextSize)
      await nextTick()
      tries++
    }
  }

  const onResize = () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => compute(), 150)
  }

  onMounted(async () => {
    await nextTick()
    await compute()
    window.addEventListener('resize', onResize)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', onResize)
    clearTimeout(resizeTimer)
  })

  return {
    containerRef,
    computeResponsivePageSize: compute
  }
}
