import { sql } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

import schema from '../schema';

type SeedDatabase = NodePgDatabase<typeof schema>;

const magicLinkEmailTemplate = {
	key: 'auth_magic_link',
	version: 1,
	isActive: true,
	subject: 'Your secure sign-in link',
	html: `
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<title>Your secure sign-in link</title>
	</head>
	<body style="margin:0;background:#f6f7fb;color:#111827;font-family:Arial,Helvetica,sans-serif;">
		<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f7fb;padding:32px 16px;">
			<tr>
				<td align="center">
					<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;">
						<tr>
							<td style="padding:32px 32px 16px;">
								<p style="margin:0 0 12px;color:#6b7280;font-size:14px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">Secure sign in</p>
								<h1 style="margin:0;color:#111827;font-size:28px;line-height:1.2;">Use this magic link to continue</h1>
							</td>
						</tr>
						<tr>
							<td style="padding:0 32px 8px;">
								<p style="margin:0;color:#374151;font-size:16px;line-height:1.6;">We received a request to sign in to your account. This link expires in {{expiresInMinutes}} minutes and can only be used once.</p>
							</td>
						</tr>
						<tr>
							<td align="center" style="padding:24px 32px 16px;">
								<a href="{{verificationUrl}}" style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;border-radius:999px;padding:14px 24px;font-size:15px;font-weight:700;">Sign in securely</a>
							</td>
						</tr>
						<tr>
							<td style="padding:8px 32px 32px;">
								<p style="margin:0 0 12px;color:#6b7280;font-size:13px;line-height:1.6;">If the button does not work, copy and paste this link into your browser:</p>
								<p style="margin:0;word-break:break-all;color:#374151;font-size:13px;line-height:1.6;">{{verificationUrl}}</p>
							</td>
						</tr>
						<tr>
							<td style="background:#f9fafb;padding:20px 32px;border-top:1px solid #e5e7eb;">
								<p style="margin:0;color:#6b7280;font-size:12px;line-height:1.6;">If you did not request this email, you can safely ignore it. &copy; {{year}}</p>
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
	</body>
</html>
`.trim(),
	text: `
Use this magic link to sign in:

{{verificationUrl}}

This link expires in {{expiresInMinutes}} minutes and can only be used once.

If you did not request this email, you can safely ignore it.

(c) {{year}}
`.trim(),
};

export async function seedEmailTemplates(db: SeedDatabase): Promise<void> {
	await db
		.insert(schema.emailTemplates)
		.values(magicLinkEmailTemplate)
		.onConflictDoUpdate({
			target: [schema.emailTemplates.key, schema.emailTemplates.version],
			set: {
				subject: magicLinkEmailTemplate.subject,
				html: magicLinkEmailTemplate.html,
				text: magicLinkEmailTemplate.text,
				isActive: magicLinkEmailTemplate.isActive,
				updatedAt: sql`now()`,
			},
		});

	console.log(
		`Seeded email template: ${magicLinkEmailTemplate.key}@v${magicLinkEmailTemplate.version}`,
	);
}
