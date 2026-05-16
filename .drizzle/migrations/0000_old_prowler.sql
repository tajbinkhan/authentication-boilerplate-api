CREATE TYPE "public"."role_type" AS ENUM('ADMIN', 'MANAGER', 'USER', 'SUPER_ADMIN');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"public_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" integer NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "accounts_public_id_unique" UNIQUE("public_id")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"public_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"token" text NOT NULL,
	"ip_address" text DEFAULT 'Unknown',
	"user_agent" text DEFAULT 'Unknown',
	"device_name" varchar(255) DEFAULT 'Unknown Device',
	"device_type" varchar(50) DEFAULT 'Unknown',
	"two_factor_verified" boolean DEFAULT false NOT NULL,
	"user_id" integer NOT NULL,
	"expires_at" timestamp NOT NULL,
	"is_revoked" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_public_id_unique" UNIQUE("public_id"),
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"public_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"password" text,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"image_information" jsonb,
	"phone" varchar(20),
	"is_2fa_enabled" boolean DEFAULT false NOT NULL,
	"role" "role_type" DEFAULT 'USER' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_public_id_unique" UNIQUE("public_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"public_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "verifications_public_id_unique" UNIQUE("public_id")
);
--> statement-breakpoint
CREATE TABLE "email_templates" (
	"id" serial PRIMARY KEY NOT NULL,
	"public_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(120) NOT NULL,
	"subject" text NOT NULL,
	"html" text NOT NULL,
	"text" text,
	"version" integer DEFAULT 1 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "email_templates_public_id_unique" UNIQUE("public_id")
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" serial PRIMARY KEY NOT NULL,
	"public_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"filename" varchar(255) NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"file_extension" varchar(10) NOT NULL,
	"secure_url" text,
	"file_size" bigint NOT NULL,
	"width" integer,
	"height" integer,
	"duration" numeric(10, 2),
	"storage_key" text NOT NULL,
	"media_type" text NOT NULL,
	"alt_text" text,
	"caption" text,
	"description" text,
	"tags" json,
	"storage_metadata" json,
	"uploaded_by" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "media_public_id_unique" UNIQUE("public_id")
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "accounts_public_id_idx" ON "accounts" USING btree ("public_id");--> statement-breakpoint
CREATE UNIQUE INDEX "accounts_account_id_provider_id_idx" ON "accounts" USING btree ("account_id","provider_id");--> statement-breakpoint
CREATE INDEX "accounts_user_id_idx" ON "accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "accounts_provider_id_idx" ON "accounts" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX "accounts_access_token_expires_at_idx" ON "accounts" USING btree ("access_token_expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "sessions_public_id_idx" ON "sessions" USING btree ("public_id");--> statement-breakpoint
CREATE UNIQUE INDEX "sessions_token_idx" ON "sessions" USING btree ("token");--> statement-breakpoint
CREATE INDEX "sessions_user_id_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sessions_expires_at_idx" ON "sessions" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "sessions_is_revoked_idx" ON "sessions" USING btree ("is_revoked");--> statement-breakpoint
CREATE INDEX "sessions_user_id_is_revoked_idx" ON "sessions" USING btree ("user_id","is_revoked");--> statement-breakpoint
CREATE INDEX "sessions_user_id_expires_at_idx" ON "sessions" USING btree ("user_id","expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "users_public_id_idx" ON "users" USING btree ("public_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_email_verified_idx" ON "users" USING btree ("email_verified");--> statement-breakpoint
CREATE INDEX "users_is_2fa_enabled_idx" ON "users" USING btree ("is_2fa_enabled");--> statement-breakpoint
CREATE INDEX "users_name_lower_idx" ON "users" USING btree (LOWER("name"));--> statement-breakpoint
CREATE INDEX "users_email_lower_idx" ON "users" USING btree (LOWER("email"));--> statement-breakpoint
CREATE UNIQUE INDEX "verifications_public_id_idx" ON "verifications" USING btree ("public_id");--> statement-breakpoint
CREATE INDEX "verifications_identifier_idx" ON "verifications" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "verifications_value_idx" ON "verifications" USING btree ("value");--> statement-breakpoint
CREATE INDEX "verifications_expires_at_idx" ON "verifications" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "verifications_identifier_value_idx" ON "verifications" USING btree ("identifier","value");--> statement-breakpoint
CREATE UNIQUE INDEX "email_templates_public_id_idx" ON "email_templates" USING btree ("public_id");--> statement-breakpoint
CREATE UNIQUE INDEX "email_templates_key_version_idx" ON "email_templates" USING btree ("key","version");--> statement-breakpoint
CREATE INDEX "email_templates_key_is_active_version_idx" ON "email_templates" USING btree ("key","is_active","version");--> statement-breakpoint
INSERT INTO "email_templates" ("key", "subject", "html", "text", "version", "is_active")
VALUES (
	'auth_magic_link',
	'Your magic link to sign in',
	$html$
<p>Use the button below to sign in.</p>
<p><a href="{{verificationUrl}}">Sign in with magic link</a></p>
<p>This link expires in {{expiresInMinutes}} minutes.</p>
<p>You will be redirected to <strong>{{redirectUrl}}</strong> after verification.</p>
<p>&copy; {{year}}</p>
$html$,
	$text$
Sign in with your magic link:
{{verificationUrl}}

This link expires in {{expiresInMinutes}} minutes.

After verification you will be redirected to:
{{redirectUrl}}

(c) {{year}}
$text$,
	1,
	true
)
ON CONFLICT ("key", "version") DO UPDATE SET
	"subject" = EXCLUDED."subject",
	"html" = EXCLUDED."html",
	"text" = EXCLUDED."text",
	"is_active" = EXCLUDED."is_active",
	"updated_at" = now();
