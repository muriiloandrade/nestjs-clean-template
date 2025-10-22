ALTER TABLE "users" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "deleted_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "active" boolean DEFAULT true NOT NULL;