CREATE TABLE IF NOT EXISTS "AuthMethod" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"hashed_password" text,
	"hash_method" text,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"totp_secret" text,
	"totp_expires" timestamp,
	"timeout_until" timestamp,
	"timeout_seconds" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Car" (
	"id" text PRIMARY KEY NOT NULL,
	"make" text NOT NULL,
	"model" text NOT NULL,
	"year" integer NOT NULL,
	"color" text NOT NULL,
	"price" double precision NOT NULL,
	"mileage" integer NOT NULL,
	"fuelType" text NOT NULL,
	"transmission" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "User" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_userKey_userId" ON "AuthMethod" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_session_userId" ON "Session" ("user_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "AuthMethod" ADD CONSTRAINT "AuthMethod_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Session" ADD CONSTRAINT "Session_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
