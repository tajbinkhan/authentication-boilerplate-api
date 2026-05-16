import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';

@Controller()
export class AppController {
	constructor() {}

	@Get()
	getRoot(@Res() res: Response): void {
		const html = `<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>Operon API — Service Status</title>
	<style>
		:root {
			--page: #f5f7fb;
			--surface: #ffffff;
			--surface-soft: #f8fafc;
			--ink: #111827;
			--muted: #64748b;
			--line: #d9e2ef;
			--brand: #155eef;
			--brand-dark: #12377a;
			--aqua: #0f766e;
			--amber: #b45309;
			--rose: #be123c;
			--green: #15803d;
			--shadow: 0 22px 60px rgba(15, 23, 42, 0.12);
		}

		* { box-sizing: border-box; }

		html {
			background: var(--page);
		}

		body {
			margin: 0;
			min-height: 100vh;
			font-family:
				Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
				sans-serif;
			color: var(--ink);
			background:
				linear-gradient(145deg, rgba(21, 94, 239, 0.11), transparent 34rem),
				linear-gradient(315deg, rgba(15, 118, 110, 0.12), transparent 30rem),
				var(--page);
			padding: 32px;
		}

		a {
			color: inherit;
			text-decoration: none;
		}

		.shell {
			width: min(1120px, 100%);
			margin: 0 auto;
		}

		.topbar {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 16px;
			margin-bottom: 20px;
		}

		.brand {
			display: inline-flex;
			align-items: center;
			gap: 12px;
			font-weight: 800;
			font-size: 1.05rem;
			color: var(--brand-dark);
		}

		.mark {
			display: grid;
			place-items: center;
			width: 42px;
			height: 42px;
			border-radius: 8px;
			color: #fff;
			background:
				linear-gradient(135deg, rgba(255, 255, 255, 0.22), transparent 42%),
				var(--brand);
			box-shadow: 0 12px 28px rgba(21, 94, 239, 0.26);
		}

		.status-pill {
			display: inline-flex;
			align-items: center;
			gap: 8px;
			min-height: 36px;
			border: 1px solid #bbf7d0;
			border-radius: 999px;
			padding: 0 14px;
			background: #f0fdf4;
			color: #166534;
			font-size: 0.9rem;
			font-weight: 700;
			white-space: nowrap;
		}

		.pulse {
			width: 9px;
			height: 9px;
			border-radius: 999px;
			background: var(--green);
			box-shadow: 0 0 0 0 rgba(21, 128, 61, 0.4);
			animation: pulse 2s infinite;
		}

		@keyframes pulse {
			0% { box-shadow: 0 0 0 0 rgba(21, 128, 61, 0.4); }
			72% { box-shadow: 0 0 0 9px rgba(21, 128, 61, 0); }
			100% { box-shadow: 0 0 0 0 rgba(21, 128, 61, 0); }
		}

		.hero {
			position: relative;
			display: grid;
			grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr);
			gap: 28px;
			align-items: stretch;
			border: 1px solid rgba(18, 55, 122, 0.14);
			border-radius: 8px;
			background: var(--surface);
			box-shadow: var(--shadow);
			overflow: hidden;
		}

		.hero::before {
			content: "";
			position: absolute;
			inset: 0;
			background:
				linear-gradient(90deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.72)),
				repeating-linear-gradient(
					135deg,
					rgba(21, 94, 239, 0.11) 0 1px,
					transparent 1px 18px
				);
			pointer-events: none;
		}

		.hero-copy,
		.hero-panel {
			position: relative;
			z-index: 1;
		}

		.hero-copy {
			padding: 44px;
			display: flex;
			flex-direction: column;
			justify-content: center;
			min-height: 380px;
		}

		.kicker {
			margin: 0 0 14px;
			color: var(--aqua);
			font-size: 0.78rem;
			font-weight: 800;
			letter-spacing: 0;
			text-transform: uppercase;
		}

		h1 {
			margin: 0;
			max-width: 12ch;
			color: #0f172a;
			font-size: clamp(2.4rem, 6vw, 5.8rem);
			line-height: 0.9;
			letter-spacing: 0;
		}

		.lede {
			max-width: 64ch;
			margin: 22px 0 0;
			color: #475569;
			font-size: clamp(1rem, 1.4vw, 1.18rem);
			line-height: 1.7;
		}

		.quick-actions {
			display: flex;
			flex-wrap: wrap;
			gap: 10px;
			margin-top: 28px;
		}

		.action {
			display: inline-flex;
			align-items: center;
			gap: 9px;
			min-height: 42px;
			border: 1px solid var(--line);
			border-radius: 8px;
			padding: 0 14px;
			background: #fff;
			color: #1e293b;
			font-weight: 750;
			box-shadow: 0 8px 18px rgba(15, 23, 42, 0.06);
		}

		.action.primary {
			border-color: var(--brand);
			background: var(--brand);
			color: #fff;
		}

		.icon {
			width: 17px;
			height: 17px;
			flex: 0 0 auto;
		}

		.hero-panel {
			padding: 24px;
			background: #10233f;
			color: #e2e8f0;
			display: grid;
			align-content: center;
		}

		.terminal {
			border: 1px solid rgba(226, 232, 240, 0.16);
			border-radius: 8px;
			overflow: hidden;
			background: #071527;
			box-shadow: 0 20px 40px rgba(2, 6, 23, 0.28);
		}

		.terminal-bar {
			display: flex;
			align-items: center;
			gap: 7px;
			height: 38px;
			padding: 0 14px;
			border-bottom: 1px solid rgba(226, 232, 240, 0.12);
			background: rgba(255, 255, 255, 0.05);
		}

		.light {
			width: 10px;
			height: 10px;
			border-radius: 999px;
			background: #94a3b8;
		}

		.light.red { background: #fb7185; }
		.light.yellow { background: #fbbf24; }
		.light.green { background: #34d399; }

		pre {
			margin: 0;
			padding: 20px;
			overflow-x: auto;
			color: #dbeafe;
			font: 0.9rem/1.65 "Cascadia Code", "SFMono-Regular", Consolas, monospace;
		}

		.comment { color: #93c5fd; }
		.command { color: #fef3c7; }
		.value { color: #86efac; }

		.metrics {
			display: grid;
			grid-template-columns: repeat(4, minmax(0, 1fr));
			gap: 12px;
			margin: 18px 0;
		}

		.metric {
			border: 1px solid var(--line);
			border-radius: 8px;
			background: rgba(255, 255, 255, 0.76);
			padding: 16px;
			min-height: 96px;
		}

		.metric strong {
			display: block;
			color: #0f172a;
			font-size: clamp(1.35rem, 3vw, 2rem);
			line-height: 1;
		}

		.metric span {
			display: block;
			margin-top: 10px;
			color: var(--muted);
			font-size: 0.9rem;
			line-height: 1.35;
		}

		.content {
			display: grid;
			grid-template-columns: 1.1fr 0.9fr;
			gap: 18px;
			align-items: start;
		}

		.section {
			border: 1px solid var(--line);
			border-radius: 8px;
			background: var(--surface);
			overflow: hidden;
		}

		.section-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 16px;
			padding: 18px 20px;
			border-bottom: 1px solid var(--line);
			background: var(--surface-soft);
		}

		h2 {
			margin: 0;
			font-size: 1rem;
			letter-spacing: 0;
		}

		.caption {
			margin: 0;
			color: var(--muted);
			font-size: 0.88rem;
		}

		.routes {
			display: grid;
			gap: 0;
		}

		.route-row {
			display: grid;
			grid-template-columns: 72px minmax(0, 1fr) auto;
			align-items: center;
			gap: 14px;
			padding: 14px 20px;
			border-bottom: 1px solid #eef2f7;
		}

		.route-row:last-child {
			border-bottom: 0;
		}

		.method {
			display: inline-grid;
			place-items: center;
			width: 62px;
			min-height: 30px;
			border-radius: 7px;
			font-size: 0.72rem;
			font-weight: 900;
			letter-spacing: 0;
		}

		.get { background: #ecfeff; color: #0e7490; border: 1px solid #a5f3fc; }
		.post { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
		.patch { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }
		.delete { background: #fff1f2; color: #be123c; border: 1px solid #fecdd3; }

		.path {
			display: block;
			color: #0f172a;
			font: 0.93rem/1.3 "Cascadia Code", "SFMono-Regular", Consolas, monospace;
			overflow-wrap: anywhere;
		}

		.route-note {
			display: block;
			margin-top: 4px;
			color: var(--muted);
			font-size: 0.86rem;
		}

		.lock {
			display: inline-flex;
			align-items: center;
			gap: 6px;
			color: #475569;
			font-size: 0.82rem;
			white-space: nowrap;
		}

		.domain-grid {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 12px;
			padding: 20px;
		}

		.domain {
			border: 1px solid #e5e7eb;
			border-radius: 8px;
			padding: 16px;
			background: #fff;
			min-height: 142px;
		}

		.domain:nth-child(2) { border-top-color: #99f6e4; }
		.domain:nth-child(3) { border-top-color: #fed7aa; }
		.domain:nth-child(4) { border-top-color: #fecdd3; }

		.domain h3 {
			display: flex;
			align-items: center;
			gap: 9px;
			margin: 0;
			font-size: 0.98rem;
		}

		.domain p {
			margin: 10px 0 0;
			color: var(--muted);
			font-size: 0.9rem;
			line-height: 1.45;
		}

		.dot {
			width: 10px;
			height: 10px;
			border-radius: 999px;
			background: var(--brand);
		}

		.dot.aqua { background: var(--aqua); }
		.dot.amber { background: var(--amber); }
		.dot.rose { background: var(--rose); }

		.docs-list {
			display: grid;
			gap: 12px;
			margin: 0;
			padding: 20px;
			list-style: none;
		}

		.docs-list li {
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
			gap: 12px;
			border: 1px solid #e5e7eb;
			border-radius: 8px;
			padding: 14px;
			background: #fff;
		}

		.docs-list strong {
			display: block;
			font-size: 0.94rem;
		}

		.docs-list span {
			display: block;
			margin-top: 5px;
			color: var(--muted);
			font-size: 0.86rem;
			line-height: 1.4;
		}

		code {
			display: inline-block;
			border: 1px solid #dbeafe;
			border-radius: 7px;
			background: #eff6ff;
			color: #1d4ed8;
			font: 0.82rem/1.2 "Cascadia Code", "SFMono-Regular", Consolas, monospace;
			padding: 2px 8px;
		}

		.footer {
			display: flex;
			justify-content: space-between;
			gap: 16px;
			margin-top: 18px;
			color: var(--muted);
			font-size: 0.88rem;
		}

		@media (max-width: 920px) {
			body { padding: 20px; }
			.hero,
			.content {
				grid-template-columns: 1fr;
			}
			.hero-copy {
				min-height: auto;
			}
			.metrics {
				grid-template-columns: repeat(2, minmax(0, 1fr));
			}
		}

		@media (max-width: 640px) {
			body { padding: 14px; }
			.topbar,
			.footer {
				align-items: flex-start;
				flex-direction: column;
			}
			.hero-copy,
			.hero-panel {
				padding: 22px;
			}
			h1 {
				font-size: clamp(2.25rem, 18vw, 3.8rem);
			}
			.metrics,
			.domain-grid {
				grid-template-columns: 1fr;
			}
			.route-row {
				grid-template-columns: 1fr;
				align-items: start;
				gap: 8px;
			}
			.lock {
				white-space: normal;
			}
		}
	</style>
</head>
<body>
	<div class="shell">
		<header class="topbar" aria-label="Service header">
			<div class="brand">
				<span class="mark" aria-hidden="true">
					<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
						<path d="M12 3l7.5 4.25v8.5L12 20 4.5 15.75v-8.5L12 3z" />
						<path d="M8.5 9.5l3.5 2 3.5-2" />
						<path d="M12 11.5V16" />
					</svg>
				</span>
				<span>Operon API</span>
			</div>
			<span class="status-pill"><span class="pulse"></span>API ready</span>
		</header>

		<main>
			<section class="hero" aria-labelledby="page-title">
				<div class="hero-copy">
					<p class="kicker">NestJS service gateway</p>
					<h1 id="page-title">Operon API</h1>
					<p class="lede">
						A focused backend surface for authentication, media, planning, tracker, attendance,
						leave, calendar, and CSRF-protected admin workflows. Use this page as a compact map
						of the routes currently exposed by the service.
					</p>
					<div class="quick-actions" aria-label="Quick links">
						<a class="action primary" href="/csrf" aria-label="Open CSRF token endpoint">
							<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
								<path d="M20 13c0 5-3.5 7.5-8 8.5C7.5 20.5 4 18 4 13V5l8-3 8 3v8z" />
								<path d="M9 12l2 2 4-5" />
							</svg>
							CSRF token
						</a>
						<a class="action" href="/auth/me" aria-label="Open current user endpoint">
							<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
								<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
								<circle cx="12" cy="7" r="4" />
							</svg>
							Profile
						</a>
						<a class="action" href="/routes.json" aria-label="Open routes inventory">
							<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
								<path d="M3 7h18" />
								<path d="M7 3v18" />
								<rect x="3" y="3" width="18" height="18" rx="2" />
							</svg>
							Routes
						</a>
					</div>
				</div>

				<aside class="hero-panel" aria-label="Example request">
					<div class="terminal">
						<div class="terminal-bar" aria-hidden="true">
							<span class="light red"></span>
							<span class="light yellow"></span>
							<span class="light green"></span>
						</div>
						<pre><span class="comment"># public health check</span>
<span class="command">curl</span> <span class="value">http://localhost:3000/</span>

<span class="comment"># token for protected writes</span>
<span class="command">curl</span> <span class="value">http://localhost:3000/csrf</span>

<span class="comment"># authenticated work routes</span>
<span class="command">GET</span> <span class="value">/projects</span>
<span class="command">GET</span> <span class="value">/issues</span>
<span class="command">POST</span> <span class="value">/tracker</span></pre>
					</div>
				</aside>
			</section>

			<section class="metrics" aria-label="API summary">
				<div class="metric">
					<strong>8</strong>
					<span>API modules</span>
				</div>
				<div class="metric">
					<strong>58</strong>
					<span>routes in inventory</span>
				</div>
				<div class="metric">
					<strong>JWT</strong>
					<span>auth-protected workflows</span>
				</div>
				<div class="metric">
					<strong>CSRF</strong>
					<span>guarded mutating requests</span>
				</div>
			</section>

			<div class="content">
				<section class="section" aria-labelledby="routes-heading">
					<div class="section-header">
						<div>
							<h2 id="routes-heading">Route Highlights</h2>
							<p class="caption">Common entry points for quick API checks.</p>
						</div>
						<code>GET /</code>
					</div>
					<div class="routes">
						<div class="route-row">
							<span class="method get">GET</span>
							<span>
								<span class="path">/csrf</span>
								<span class="route-note">Issue a CSRF token cookie and response value.</span>
							</span>
							<span class="lock">Public</span>
						</div>
						<div class="route-row">
							<span class="method post">POST</span>
							<span>
								<span class="path">/auth/login</span>
								<span class="route-note">Create an authenticated session.</span>
							</span>
							<span class="lock">Credentials</span>
						</div>
						<div class="route-row">
							<span class="method get">GET</span>
							<span>
								<span class="path">/auth/me</span>
								<span class="route-note">Read the current user profile.</span>
							</span>
							<span class="lock">JWT</span>
						</div>
						<div class="route-row">
							<span class="method post">POST</span>
							<span>
								<span class="path">/media</span>
								<span class="route-note">Upload and register media assets.</span>
							</span>
							<span class="lock">JWT + CSRF</span>
						</div>
						<div class="route-row">
							<span class="method get">GET</span>
							<span>
								<span class="path">/projects</span>
								<span class="route-note">List planning projects with filters and sorting.</span>
							</span>
							<span class="lock">JWT</span>
						</div>
						<div class="route-row">
							<span class="method patch">PATCH</span>
							<span>
								<span class="path">/sprints/:sprintId</span>
								<span class="route-note">Update sprint lifecycle details.</span>
							</span>
							<span class="lock">ADMIN/SUPER_ADMIN + CSRF</span>
						</div>
					</div>
				</section>

				<section class="section" aria-labelledby="domains-heading">
					<div class="section-header">
						<div>
							<h2 id="domains-heading">Service Domains</h2>
							<p class="caption">Current modules wired into the API.</p>
						</div>
					</div>
					<div class="domain-grid">
						<article class="domain">
							<h3><span class="dot"></span>Auth</h3>
							<p>Registration, login, logout, profile updates, profile image upload, and Google sign-in under <code>/auth</code>.</p>
						</article>
						<article class="domain">
							<h3><span class="dot aqua"></span>Media</h3>
							<p>Upload, read, update, and delete media assets through the protected <code>/media</code> endpoints.</p>
						</article>
						<article class="domain">
							<h3><span class="dot amber"></span>Planning</h3>
							<p>Project, sprint, issue, tracker, attendance, leave, and calendar workflows are available across the main route surface.</p>
						</article>
						<article class="domain">
							<h3><span class="dot rose"></span>Security</h3>
							<p>Global request formatting, stable error codes, request IDs, JWT guards, role guards, and CSRF protection keep the surface consistent.</p>
						</article>
					</div>
				</section>
			</div>

			<section class="section docs" aria-labelledby="docs-heading">
				<div class="section-header">
					<div>
						<h2 id="docs-heading">Local Documentation</h2>
						<p class="caption">Repo files that describe this API surface.</p>
					</div>
				</div>
				<ul class="docs-list">
					<li>
						<div>
							<strong>Root route contract</strong>
							<span>See <code>docs/api-root-open-route.md</code> for the public HTML endpoint behavior.</span>
						</div>
						<code>HTML</code>
					</li>
					<li>
						<div>
							<strong>Planning endpoints</strong>
							<span>See <code>docs/planning/planning-projects-sprints-endpoints.md</code> for project and sprint route details.</span>
						</div>
						<code>JWT</code>
					</li>
					<li>
						<div>
							<strong>Route inventory</strong>
							<span>Regenerate <code>routes.json</code> when controllers change so this map stays honest.</span>
						</div>
						<code>routes.json</code>
					</li>
					<li>
						<div>
							<strong>Frontend guide</strong>
							<span>See <code>docs/frontend-ui-api-guide.md</code> for API-to-UI mapping and UX guidance.</span>
						</div>
						<code>UI</code>
					</li>
				</ul>
			</section>
		</main>
		<footer class="footer">
			<span>Operon backend status page</span>
			<span>Built with NestJS, Drizzle, PostgreSQL, and Jest</span>
		</footer>
	</div>
</body>
</html>`;
		res.setHeader('Content-Type', 'text/html; charset=utf-8');
		res.send(html);
	}
}
