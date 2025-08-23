-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'STAFF');

-- CreateEnum
CREATE TYPE "public"."PassType" AS ENUM ('ONE_TIME', 'MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "public"."UserType" AS ENUM ('INDIVIDUAL', 'GROUP');

-- CreateEnum
CREATE TYPE "public"."PassStatus" AS ENUM ('NORMAL', 'VIP');

-- CreateTable
CREATE TABLE "public"."Admin" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Animal" (
    "id" TEXT NOT NULL,
    "species" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "isChild" BOOLEAN NOT NULL DEFAULT false,
    "age" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Animal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Ticket" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dateOfVisit" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "passType" "public"."PassType" NOT NULL,
    "userType" "public"."UserType" NOT NULL,
    "passStatus" "public"."PassStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "public"."Admin"("email");
