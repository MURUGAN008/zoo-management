-- AlterTable
ALTER TABLE "public"."Invitation" ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'ADMIN';
