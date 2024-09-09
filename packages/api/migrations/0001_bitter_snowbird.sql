ALTER TABLE "AuthMethod" RENAME TO "authMethod";--> statement-breakpoint
ALTER TABLE "Car" RENAME TO "car";--> statement-breakpoint
ALTER TABLE "Session" RENAME TO "session";--> statement-breakpoint
ALTER TABLE "User" RENAME TO "user";--> statement-breakpoint
ALTER TABLE "authMethod" DROP CONSTRAINT "AuthMethod_user_id_User_id_fk";
--> statement-breakpoint
ALTER TABLE "session" DROP CONSTRAINT "Session_user_id_User_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "authMethod" ADD CONSTRAINT "authMethod_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
