CREATE TABLE "blog_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"content" text NOT NULL,
	"banner_image" text,
	"author_id" integer,
	"publish_date" timestamp DEFAULT now(),
	"published" boolean DEFAULT false,
	"category" text,
	"tags" text[],
	"slug" text NOT NULL,
	"excerpt" text,
	"read_time" text,
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"message" text NOT NULL,
	"type" text NOT NULL,
	"read" boolean DEFAULT false,
	"entity_id" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "staffing_inquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"company" text,
	"inquiry_type" text NOT NULL,
	"message" text NOT NULL,
	"marketing" boolean DEFAULT false,
	"status" text DEFAULT 'new',
	"submitted_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "vacancies" (
	"id" serial PRIMARY KEY NOT NULL,
	"company_name" text NOT NULL,
	"contact_name" text NOT NULL,
	"contact_email" text NOT NULL,
	"contact_phone" text NOT NULL,
	"job_title" text NOT NULL,
	"job_description" text NOT NULL,
	"location" text NOT NULL,
	"industry" text NOT NULL,
	"employment_type" text NOT NULL,
	"salary_range" text,
	"required_skills" text NOT NULL,
	"experience_level" text NOT NULL,
	"application_deadline" timestamp NOT NULL,
	"additional_information" text,
	"status" text DEFAULT 'new',
	"submitted_at" timestamp DEFAULT now(),
	"assigned_to" text,
	"assigned_name" text,
	"assigned_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;