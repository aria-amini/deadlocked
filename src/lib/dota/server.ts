import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

export { BRACKET_MMR, type Bracket, type MetaBracket } from './brackets'

export const bracketSchema = z.enum([
	'Herald',
	'Guardian',
	'Crusader',
	'Archon',
	'Legend',
	'Ancient',
	'Divine',
	'Pro',
])

export type BracketName = z.infer<typeof bracketSchema>

// Handler bodies are stripped from the client bundle, so the OpenDota and
// database imports must stay inside them; a static import would ship the
// postgres driver to the browser.
export const getMetaPage = createServerFn({ method: 'GET' })
	.validator(
		z.object({
			bracket: bracketSchema.default('Archon'),
		}),
	)
	.handler(async ({ data }) => {
		const { loadHeroMeta } = await import('./opendota')

		return loadHeroMeta(data.bracket)
	})

export const getStatsPage = createServerFn({ method: 'GET' })
	.validator(z.object({ accountId: z.number().int().positive() }))
	.handler(async ({ data }) => {
		const { loadHeroBracketWinrates, loadMatchHistory } =
			await import('./opendota')

		const result = await loadMatchHistory(data.accountId)

		if (!result.ok) return result

		const topHeroes = result.history.heroTallies
			.slice(0, 5)
			.map((tally) => tally.hero)

		const heroBrackets = await loadHeroBracketWinrates(topHeroes)

		return { ok: true as const, history: result.history, heroBrackets }
	})
