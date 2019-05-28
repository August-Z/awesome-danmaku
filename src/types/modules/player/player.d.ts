declare type PlayerOptions = {
  el?: HTMLElement | string,
  rollTime: number | string,
  node?: {
    tag?: string,
    className?: string,
    count?: number,
    valueKey?: number | string,
  },
  track?: {
    count?: number,
    height?: number | string,
  },
  list?: PlayerOptions[],
} | HTMLElement | string
