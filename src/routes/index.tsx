import { createFileRoute, Link } from '@tanstack/react-router'
import { cn } from 'cn'
import { z } from 'zod'

import { BoardHeader, LadderBoard } from '@/components/dota/board-frame'
import { HeroIcon } from '@/components/dota/hero-icon'
import { RankIcon } from '@/components/dota/rank-icon'
import {
	ChannelRail,
	type ChannelItemProps,
} from '@/components/ui/channel-rail'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { BRACKET_MMR, type MetaBracket } from '@/lib/dota/brackets'
import { getMetaPage } from '@/lib/dota/server'
import type { BracketName } from '@/lib/dota/server'

const BRACKETS: Array<BracketName> = [
	'Herald',
	'Guardian',
	'Crusader',
	'Archon',
	'Legend',
	'Ancient',
	'Divine',
	'Pro',
]

export const Route = createFileRoute('/')({
	validateSearch: z.object({ bracket: z.enum(BRACKETS).optional() }),
	loaderDeps: ({ search: { bracket } }) => ({ bracket }),
	loader: async ({ deps }) =>
		getMetaPage({ data: { bracket: deps.bracket ?? 'Archon' } }),
	component: MetaPage,
})

const compactPicks = new Intl.NumberFormat('en-US', {
	notation: 'compact',
	maximumFractionDigits: 1,
})

function bracketTitle(
	name: BracketName,
	bracketTotals: Record<MetaBracket, number>,
): string {
	const range = BRACKET_MMR[name]

	return [
		range ? `${name} · ${range} MMR` : `${name} matches`,
		`${compactPicks.format(bracketTotals[name])} picks`,
	].join(' · ')
}

function WinRate({ winrate }: { winrate: number }) {
	const strong = winrate >= 50

	return (
		<span
			className={cn(
				'inline-flex items-center justify-end font-mono text-sm tabular-nums',
				strong ? 'text-win' : 'text-loss',
			)}
		>
			{winrate}%
		</span>
	)
}

function PickShareGauge({ share, max }: { share: number; max: number }) {
	const fill = max > 0 ? (share / max) * 100 : 0

	return (
		<div className="flex items-center justify-end gap-3">
			<div className="bg-border hidden h-1.5 w-28 lg:block">
				<div
					className="gauge-fill bg-primary/70 h-full"
					style={{ '--fill': `${fill}%` }}
				/>
			</div>
			<span className="text-muted-foreground w-12 text-right font-mono text-xs tabular-nums">
				{share}%
			</span>
		</div>
	)
}

function MetaPage() {
	const { bracket } = Route.useSearch()
	const { bracketTotals, heroes: rows } = Route.useLoaderData()
	const active: BracketName = bracket ?? 'Archon'

	const channels: Array<ChannelItemProps> = BRACKETS.map((name) => ({
		label: name,
		title: bracketTitle(name, bracketTotals),
		icon: (
			<span
				className={cn(
					'grid size-6 place-items-center rounded-full',
					name === active && 'bg-card shadow-sm',
				)}
			>
				<RankIcon bracket={name} className="size-5" />
			</span>
		),
		active: name === active,
		render: <Link to="/" search={{ bracket: name }} />,
	}))

	const maxShare = Math.max(...rows.map((row) => row.pickShare), 0)

	return (
		<div className="min-h-dvh">
			<BoardHeader active="heroes" />
			<main className="mx-auto w-full max-w-6xl space-y-6 px-6 py-8">
				<ChannelRail aria-label="Rank bracket" items={channels} />

				<LadderBoard>
					<div className="max-h-[26rem] overflow-y-auto">
						<Table>
							<TableHeader variant="sticky">
								<TableRow>
									<TableHead className="text-right">#</TableHead>
									<TableHead>Hero</TableHead>
									<TableHead className="text-right">Picks</TableHead>
									<TableHead className="text-right">Pick share</TableHead>
									<TableHead className="text-right">Win rate</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{rows.map((row, index) => (
									<TableRow key={row.hero}>
										<TableCell muted numeric className="text-right">
											{index + 1}
										</TableCell>
										<TableCell strong>
											<span className="flex items-center gap-2">
												<HeroIcon hero={row.hero} />
												{row.hero}
											</span>
										</TableCell>
										<TableCell numeric className="text-right">
											{row.picks.toLocaleString()}
										</TableCell>
										<TableCell>
											<PickShareGauge share={row.pickShare} max={maxShare} />
										</TableCell>
										<TableCell className="text-right">
											<WinRate winrate={row.winrate} />
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</LadderBoard>
			</main>
		</div>
	)
}
