import { Link } from '@tanstack/react-router'
import { cn } from 'cn'
import { type ReactNode } from 'react'

const NAV = [
	{ id: 'heroes', label: 'Heroes', to: '/' },
	{ id: 'matches', label: 'Matches', to: '/stats' },
] as const

function BoardHeader({ active }: { active: 'heroes' | 'matches' }) {
	return (
		<header className="bg-card border-b">
			<div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-8 px-6">
				<Link
					to="/"
					className="flex items-center gap-2.5 outline-none focus-visible:opacity-80"
				>
					<span className="font-stretch-board text-lg font-bold tracking-wide uppercase">
						Dota·Visualizer
					</span>
				</Link>
				<nav aria-label="Primary" className="flex items-stretch self-stretch">
					{NAV.map((item) => (
						<Link
							key={item.id}
							to={item.to}
							aria-current={item.id === active ? 'page' : undefined}
							className={cn(
								'label-mono inline-flex items-center border-b-2 px-4 transition-colors outline-none focus-visible:bg-muted',
								item.id === active
									? 'border-primary text-foreground'
									: 'border-transparent text-muted-foreground hover:text-foreground',
							)}
						>
							{item.label}
						</Link>
					))}
				</nav>
			</div>
		</header>
	)
}

function CornerMarks({ className }: { className?: string }) {
	const positions = [
		'top-1 left-1',
		'top-1 right-1',
		'bottom-1 left-1',
		'bottom-1 right-1',
	]

	return (
		<div
			aria-hidden
			className={cn('pointer-events-none absolute inset-0', className)}
		>
			{positions.map((position) => (
				<svg
					key={position}
					viewBox="0 0 8 8"
					className={cn('absolute size-2 text-primary/50', position)}
					fill="none"
					stroke="currentColor"
					strokeWidth="1"
				>
					<path d="M4 0v8M0 4h8" />
				</svg>
			))}
		</div>
	)
}

function LadderBoard({ children }: { children: ReactNode }) {
	return (
		<section className="bevel border-border bg-card shadow-card relative border">
			<CornerMarks />
			<div>{children}</div>
		</section>
	)
}

export { BoardHeader, CornerMarks, LadderBoard }
