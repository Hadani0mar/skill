import React from 'react'
import { Ico } from './ui'
import { lin, eo, spring, clamp } from './anim'
// Sample team-tasks app (our own design, sample data) drawn at 402pt phone width.
export type Task = { title: string; done: number; flash?: number; enter?: number; tap?: number; by: string }
export function TaskApp({ me, initial, tasks, input = '', inputTap, addTap, focus }: { me: string; initial: string; tasks: Task[]; input?: string; inputTap?: number; addTap?: number; focus?: boolean }) {
  return (
    <div className="ta" dir="rtl">
      <div className="ta__head">
        <div className="ta__title">مهام الفريق</div>
        <div className="ta__me"><span className="ta__av">{initial}</span>{me}<span className="ta__live"><i />مباشر</span></div>
      </div>
      <div className="ta__list">
        {tasks.map((k, i) => {
          const e = k.enter === undefined ? 1 : spring(k.enter, 0, 0.6)
          if (e <= 0) return null
          return (
            <div key={k.title} className="ta__row" style={{ opacity: clamp(e * 1.4), transform: `translateY(${(1 - e) * -30}px) scale(${0.9 + 0.1 * e})`, height: 88 * clamp(e * 1.6), marginBottom: 12 * clamp(e * 1.6) }}>
              <div className="ta__card" style={{ boxShadow: k.flash ? `0 0 0 ${3}px rgba(62,207,142,${k.flash}), 0 8px 24px rgba(62,207,142,${k.flash * 0.35})` : undefined, background: k.flash ? `rgba(62,207,142,${k.flash * 0.1})` : undefined }}>
                <span className="ta__chk" style={{ background: k.done > 0 ? `rgba(31,157,99,${k.done})` : undefined, borderColor: k.done > 0.5 ? '#1f9d63' : undefined, transform: `scale(${1 + Math.sin(k.done * Math.PI) * 0.25})` }}>
                  {k.done > 0.3 && <Ico name="check" size={22} color="#fff" style={{ opacity: k.done }} />}
                  {k.tap !== undefined && k.tap > 0 && k.tap < 1 && <span className="tap" style={{ transform: `scale(${0.4 + eo(k.tap) * 1.6})`, opacity: 1 - k.tap }} />}
                </span>
                <span className="ta__txt" style={{ color: k.done > 0.5 ? '#9a9a9a' : undefined }}>
                  <b>{k.title}</b>
                  <small>{k.by}</small>
                </span>
              </div>
            </div>
          )
        })}
      </div>
      <div className="ta__add">
        <span className="ta__input" data-focus={focus || undefined} data-empty={!input || undefined}>{input || 'مهمة جديدة…'}{focus && <i className="caret" />}
          {inputTap !== undefined && inputTap > 0 && inputTap < 1 && <span className="tap" style={{ left: '50%', transform: `scale(${0.4 + eo(inputTap) * 1.6})`, opacity: 1 - inputTap }} />}
        </span>
        <span className="ta__plus" style={{ transform: `scale(${addTap !== undefined && addTap > 0 && addTap < 0.3 ? 0.88 : 1})` }}><Ico name="plus" size={28} color="#fff" />
          {addTap !== undefined && addTap > 0 && addTap < 1 && <span className="tap" style={{ transform: `scale(${0.4 + eo(addTap) * 1.6})`, opacity: 1 - addTap }} />}
        </span>
      </div>
    </div>
  )
}
// helpers for timed task states
export const tapP = (t: number, at: number) => (t < at ? undefined : (t - at) / 0.5)
export const doneP = (t: number, at: number) => eo(lin(t, at, at + 0.3))
export const flashP = (t: number, at: number, hold = 1.4) => Math.min(lin(t, at, at + 0.15), 1 - lin(t, at + hold, at + hold + 0.5))
