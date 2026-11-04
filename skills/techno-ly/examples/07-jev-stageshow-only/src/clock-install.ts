import { installVirtualClock } from '../kit/clock'
// Only the frame recorder (?record) drives time; the rehearsal gate and normal viewing use the real clock.
if (location.search.includes('record')) installVirtualClock({ fps: 30 })
