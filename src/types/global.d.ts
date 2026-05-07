import type { GtAPI } from '../../shared/gt-api'

declare global {
  interface Window {
    gt: GtAPI
  }
}
