/*
  Warnings:

  - You are about to drop the `Following` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Likes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Replies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Threads` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Following" DROP CONSTRAINT "Following_follower_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Following" DROP CONSTRAINT "Following_following_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Likes" DROP CONSTRAINT "Likes_thread_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Likes" DROP CONSTRAINT "Likes_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Replies" DROP CONSTRAINT "Replies_thread_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Replies" DROP CONSTRAINT "Replies_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Threads" DROP CONSTRAINT "Threads_created_by_fkey";

-- DropForeignKey
ALTER TABLE "public"."Threads" DROP CONSTRAINT "Threads_updated_by_fkey";

-- DropTable
DROP TABLE "public"."Following";

-- DropTable
DROP TABLE "public"."Likes";

-- DropTable
DROP TABLE "public"."Replies";

-- DropTable
DROP TABLE "public"."Threads";

-- DropTable
DROP TABLE "public"."Users";

-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profile_photo" TEXT,
    "bio" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" INTEGER,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."threads" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "image" TEXT,
    "number_of_replies" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" INTEGER,

    CONSTRAINT "threads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."replies" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "thread_id" INTEGER NOT NULL,
    "image" TEXT,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" INTEGER,

    CONSTRAINT "replies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."likes" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "thread_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" INTEGER,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."following" (
    "id" SERIAL NOT NULL,
    "following_id" INTEGER NOT NULL,
    "follower_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "following_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "threads_created_by_idx" ON "public"."threads"("created_by");

-- CreateIndex
CREATE INDEX "threads_updated_by_idx" ON "public"."threads"("updated_by");

-- CreateIndex
CREATE INDEX "replies_user_id_idx" ON "public"."replies"("user_id");

-- CreateIndex
CREATE INDEX "replies_thread_id_idx" ON "public"."replies"("thread_id");

-- CreateIndex
CREATE INDEX "likes_user_id_idx" ON "public"."likes"("user_id");

-- CreateIndex
CREATE INDEX "likes_thread_id_idx" ON "public"."likes"("thread_id");

-- CreateIndex
CREATE UNIQUE INDEX "likes_user_id_thread_id_key" ON "public"."likes"("user_id", "thread_id");

-- CreateIndex
CREATE INDEX "following_following_id_idx" ON "public"."following"("following_id");

-- CreateIndex
CREATE INDEX "following_follower_id_idx" ON "public"."following"("follower_id");

-- CreateIndex
CREATE UNIQUE INDEX "following_following_id_follower_id_key" ON "public"."following"("following_id", "follower_id");

-- AddForeignKey
ALTER TABLE "public"."threads" ADD CONSTRAINT "threads_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."threads" ADD CONSTRAINT "threads_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."replies" ADD CONSTRAINT "replies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."replies" ADD CONSTRAINT "replies_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "public"."threads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."likes" ADD CONSTRAINT "likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."likes" ADD CONSTRAINT "likes_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "public"."threads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."following" ADD CONSTRAINT "following_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."following" ADD CONSTRAINT "following_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
