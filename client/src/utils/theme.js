const THEME_KEY = 'theme-mode'
const mql = typeof window !== 'undefined' && window.matchMedia
  ? window.matchMedia('(prefers-color-scheme: dark)')
  : null

export function getStoredTheme () {
  try {
    const v = window.localStorage.getItem(THEME_KEY)
    return v === 'light' || v === 'dark' ? v : 'auto' // 默认跟随系统
  } catch (e) {
    return 'auto'
  }
}

export function setStoredTheme (mode) {
  try { window.localStorage.setItem(THEME_KEY, mode) } catch (e) {}
}

export function isDark (mode = getStoredTheme()) {
  if (mode === 'dark') return true
  if (mode === 'light') return false
  return !!(mql && mql.matches) // 'auto'
}

export function applyTheme (mode = getStoredTheme()) {
  const dark = isDark(mode)
  document.documentElement.classList.toggle('dark', dark)
  return dark
}

function onPrefersChange () {
  // 仅在"跟随系统"模式下实时响应系统主题变化
  if (getStoredTheme() === 'auto') applyTheme('auto')
}

export function initTheme () {
  applyTheme(getStoredTheme())
  if (mql) {
    // 现代浏览器用 addEventListener，旧版 Safari 回退到 addListener
    if (typeof mql.addEventListener === 'function') mql.addEventListener('change', onPrefersChange)
    else if (typeof mql.addListener === 'function') mql.addListener(onPrefersChange)
  }
}
