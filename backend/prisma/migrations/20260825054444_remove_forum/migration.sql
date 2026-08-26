/*
  Warnings:

  - You are about to drop the `forum_likes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `forum_posts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "forum_likes" DROP CONSTRAINT "forum_likes_post_id_fkey";

-- DropForeignKey
ALTER TABLE "forum_likes" DROP CONSTRAINT "forum_likes_user_id_fkey";

-- DropForeignKey
ALTER TABLE "forum_posts" DROP CONSTRAINT "forum_posts_author_id_fkey";

-- DropTable
DROP TABLE "forum_likes";

-- DropTable
DROP TABLE "forum_posts";
