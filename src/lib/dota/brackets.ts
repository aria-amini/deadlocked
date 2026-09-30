// Client-safe bracket constants. Keep server-only modules out of this file's
// import graph: route components read these values directly.

export type Bracket =
	| 'Herald'
	| 'Guardian'
	| 'Crusader'
	| 'Archon'
	| 'Legend'
	| 'Ancient'
	| 'Divine'
	| 'Immortal'

export type MetaBracket = Bracket | 'Pro'

// Pub medal MMR bands; one medal star spans ~154 MMR. Pro is not a pub rank.
export const BRACKET_MMR: Record<MetaBracket, string | null> = {
	Herald: '0–769',
	Guardian: '770–1539',
	Crusader: '1540–2309',
	Archon: '2310–3079',
	Legend: '3080–3849',
	Ancient: '3850–4619',
	Divine: '4620–5419',
	Immortal: '5420+',
	Pro: null,
}
