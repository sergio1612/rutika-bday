import { Ornament } from '../../../components/Ornament'
import { giftConfig } from '../data/giftData'

function spacedCode(pin: string) {
  return pin.split('').join(' ')
}

export function ClueCardSheet({ onClose }: { onClose: () => void }) {
  const cards = [...giftConfig.gifts].filter((gift) => gift.physicalCard).sort((a, b) => a.order - b.order)
  const pages: (typeof cards)[] = []
  for (let index = 0; index < cards.length; index += 6) pages.push(cards.slice(index, index + 6))

  return (
    <div className="clue-sheet fixed inset-0 z-[70] overflow-auto bg-[#f3ebe4] px-5 py-8 text-ink print:static print:bg-white print:p-0">
      <div className="mx-auto mb-8 flex max-w-3xl items-center justify-between gap-3 print:hidden">
        <p className="font-serif text-2xl italic">Clue cards to print</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-full bg-wine px-4 py-2 text-[0.68rem] uppercase tracking-[0.18em] text-cream"
          >
            Print
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-4 py-2 text-[0.68rem] uppercase tracking-[0.18em] text-ink-soft"
          >
            Close
          </button>
        </div>
      </div>
      <div className="mx-auto flex max-w-5xl flex-col gap-10 print:max-w-none print:gap-0">
        {pages.map((page) => (
          <section key={page[0]?.physicalCard?.cardId} className="clue-print-page grid grid-cols-2 items-start gap-4 print:gap-[4mm]">
            {page.map((gift) => {
              const pin = gift.pinConfig?.value
              return (
                <article key={gift.physicalCard?.cardId} className="min-h-0">
                  <div className="rounded-[1.4rem] border border-rose/20 bg-[#fbf6f1] px-4 py-4 text-center shadow-sm [print-color-adjust:exact] print:rounded-2xl print:px-3 print:py-3 print:shadow-none">
                    <p className="text-[0.65rem] font-light leading-snug text-ink-soft print:hidden">
                      {gift.requiresPin
                        ? `Attach to ${gift.name}. Hide it in ${gift.location}.`
                        : `Hide this card in ${gift.location}. There is no gift there.`}
                    </p>
                    <p className="text-[0.62rem] uppercase tracking-[0.28em] text-gold">For Rutu</p>
                    <Ornament className="mt-2 h-3 print:mt-1" />
                    <p className="mt-3 whitespace-pre-line font-serif text-lg leading-snug text-ink print:mt-1 print:text-[11pt] print:leading-tight">
                      {gift.physicalCard?.verse}
                    </p>
                    <Ornament className="mt-2 h-3 print:mt-1" />
                    {pin ? (
                      <div className="mt-1">
                        <p className="text-[0.62rem] uppercase tracking-[0.24em] text-rose-deep">Your code</p>
                        <p className="mt-1 font-serif text-3xl tracking-[0.35em] text-rose-deep print:text-[16pt]">
                          {spacedCode(pin)}
                        </p>
                      </div>
                    ) : (
                      <p className="mt-1 font-serif text-base italic text-ink-soft print:text-[11pt]">Only a note this time.</p>
                    )}
                  </div>
                </article>
              )
            })}
          </section>
        ))}
      </div>
    </div>
  )
}
