CREATE TABLE IF NOT EXISTS "documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"blob_url" text NOT NULL,
	"blob_path" text NOT NULL,
	"mime_type" text,
	"file_size" integer,
	"deal_id" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
