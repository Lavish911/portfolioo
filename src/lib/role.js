const TRACKS = {
  ml: {
    key: 'ml',
    resumeUrl: '/resume-ml.pdf',
    featuredOrder: ['srris', 'aura', 'interview', 'invoiceiq'],
  },
  fs: {
    key: 'fs',
    resumeUrl: '/resume-fs.pdf',
    featuredOrder: ['invoiceiq', 'interview', 'aura', 'srris'],
  },
  sde: {
    key: 'sde',
    resumeUrl: '/resume-sde.pdf',
    featuredOrder: ['invoiceiq', 'interview', 'srris', 'aura'],
  },
}

const ALIASES = {
  ml: 'ml',
  aiml: 'ml',
  ai: 'ml',
  fs: 'fs',
  fullstack: 'fs',
  web: 'fs',
  sde: 'sde',
  swe: 'sde',
  be: 'sde',
  backend: 'sde',
}

const DEFAULT_TRACK = {
  key: 'default',
  resumeUrl: '/resume-fs.pdf',
  featuredOrder: null,
}

export function getActiveTrack() {
  if (typeof window === 'undefined') return DEFAULT_TRACK
  try {
    const params = new URLSearchParams(window.location.search)
    const raw = (params.get('r') || params.get('role') || '').toLowerCase().trim()
    const mapped = ALIASES[raw]
    if (mapped && TRACKS[mapped]) {
      sessionStorage.setItem('portfolio_role', mapped)
      return TRACKS[mapped]
    }
    const saved = sessionStorage.getItem('portfolio_role')
    if (saved && TRACKS[saved]) {
      return TRACKS[saved]
    }
  } catch {
    // Ignore storage or URL parsing errors
  }
  return DEFAULT_TRACK
}

export function sortFeaturedProjects(featuredList) {
  const { featuredOrder } = getActiveTrack()
  if (!featuredOrder || !Array.isArray(featuredList)) return featuredList

  const rankOf = (project) => {
    const key = `${project.id || ''} ${project.title || ''}`.toLowerCase()
    const idx = featuredOrder.findIndex((token) => key.includes(token))
    return idx === -1 ? 999 : idx
  }

  return [...featuredList].sort((a, b) => rankOf(a) - rankOf(b))
}
