-- ═════════════════════════════════════════════════════════════════════
-- Forever Us — MySQL Database Schema & Migration SQL
-- ═════════════════════════════════════════════════════════════════════
-- Target Database: forever_us_db
-- Engine: InnoDB (with UTF-8 / utf8mb4 character set for emoji support)
-- 
-- This file contains the complete MySQL CREATE TABLE and ALTER TABLE statements
-- generated for our Django models: Memory, GalleryCategory, GalleryImage,
-- LoveReason, LoveLetter, and CountdownSetting.
-- ═════════════════════════════════════════════════════════════════════

CREATE DATABASE IF NOT EXISTS `forever_us_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `forever_us_db`;

SET FOREIGN_KEY_CHECKS = 0;

-- ─────────────────────────────────────────────────────────────────────
-- 1. Table: love_memory (Our Story Timeline Memories)
-- ─────────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS `love_memory`;
CREATE TABLE `love_memory` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(200) NOT NULL COMMENT 'Title of the memory milestone',
    `subtitle` VARCHAR(300) NOT NULL DEFAULT '' COMMENT 'Short romantic subtitle',
    `date_label` VARCHAR(100) NOT NULL COMMENT 'Display label for the date',
    `date_occurred` DATE NULL COMMENT 'Exact calendar date of this memory for sorting',
    `description` LONGTEXT NOT NULL COMMENT 'Brief summary shown on timeline card',
    `expanded_content` LONGTEXT NOT NULL COMMENT 'Extended heartfelt story revealed on click',
    `icon` VARCHAR(100) NOT NULL DEFAULT 'fa-solid fa-heart' COMMENT 'Font Awesome icon class',
    `emoji` VARCHAR(10) NOT NULL DEFAULT '💕' COMMENT 'Decorative emoji',
    `image` VARCHAR(100) NULL COMMENT 'Media upload path (media/memories/)',
    `order` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Display order on timeline',
    `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Active display toggle',
    `created_at` DATETIME(6) NOT NULL,
    `updated_at` DATETIME(6) NOT NULL,
    INDEX `love_memory_order_date_idx` (`order`, `date_occurred`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────────────────
-- 2. Table: love_gallerycategory (Photo Gallery Filter Categories)
-- ─────────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS `love_gallerycategory`;
CREATE TABLE `love_gallerycategory` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL COMMENT 'Category name displayed on filter buttons',
    `slug` VARCHAR(50) NOT NULL UNIQUE COMMENT 'URL-friendly identifier',
    `icon` VARCHAR(100) NOT NULL DEFAULT 'fa-solid fa-heart' COMMENT 'Font Awesome icon class',
    `order` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Display order for filter buttons',
    `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Active category toggle',
    `created_at` DATETIME(6) NOT NULL,
    INDEX `love_gallerycategory_order_idx` (`order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────────────────
-- 3. Table: love_galleryimage (Photo Gallery with Foreign Keys)
-- ─────────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS `love_galleryimage`;
CREATE TABLE `love_galleryimage` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(200) NOT NULL COMMENT 'Title of photo',
    `image` VARCHAR(100) NOT NULL COMMENT 'Main photo upload path in media/gallery/',
    `thumbnail` VARCHAR(100) NULL COMMENT 'Optional smaller thumbnail upload path',
    `category_id` BIGINT NULL COMMENT 'ForeignKey -> love_gallerycategory.id',
    `memory_id` BIGINT NULL COMMENT 'ForeignKey -> love_memory.id',
    `caption` LONGTEXT NOT NULL COMMENT 'Romantic caption displayed in lightbox',
    `date_taken` DATE NULL COMMENT 'Date photo was taken',
    `is_featured` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Featured masonry grid flag',
    `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Active photo toggle',
    `order` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Display order',
    `created_at` DATETIME(6) NOT NULL,
    `updated_at` DATETIME(6) NOT NULL,
    INDEX `love_galleryimage_category_idx` (`category_id`),
    INDEX `love_galleryimage_memory_idx` (`memory_id`),
    INDEX `love_galleryimage_order_idx` (`order`, `created_at`),
    CONSTRAINT `fk_galleryimage_category` FOREIGN KEY (`category_id`) REFERENCES `love_gallerycategory` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_galleryimage_memory` FOREIGN KEY (`memory_id`) REFERENCES `love_memory` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────────────────
-- 4. Table: love_lovereason (20 Reasons Why Flip Cards)
-- ─────────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS `love_lovereason`;
CREATE TABLE `love_lovereason` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(100) NOT NULL COMMENT 'Reason title (e.g., Your Smile)',
    `description` LONGTEXT NOT NULL COMMENT 'Detailed message revealed when card flips',
    `icon` VARCHAR(100) NOT NULL DEFAULT 'fa-solid fa-heart' COMMENT 'Font Awesome icon class',
    `emoji` VARCHAR(10) NOT NULL DEFAULT '💖' COMMENT 'Decorative emoji',
    `gradient_class` VARCHAR(50) NOT NULL DEFAULT 'gradient-card-1' COMMENT 'CSS gradient style class',
    `order` INT UNSIGNED NOT NULL DEFAULT 1 COMMENT 'Display order (1 to 20)',
    `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Active card toggle',
    `created_at` DATETIME(6) NOT NULL,
    `updated_at` DATETIME(6) NOT NULL,
    INDEX `love_lovereason_order_idx` (`order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────────────────
-- 5. Table: love_loveletter (Handwritten Love Letters)
-- ─────────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS `love_loveletter`;
CREATE TABLE `love_loveletter` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(200) NOT NULL DEFAULT 'My Eternal Promise to You' COMMENT 'Title of letter',
    `date_label` VARCHAR(100) NOT NULL DEFAULT 'August 1st — Girlfriend''s Day' COMMENT 'Display date label',
    `salutation` VARCHAR(100) NOT NULL DEFAULT 'My Dearest Love,' COMMENT 'Opening greeting',
    `body` LONGTEXT NOT NULL COMMENT 'Main letter paragraphs separated by blank lines',
    `closing` VARCHAR(100) NOT NULL DEFAULT 'Forever and always yours,' COMMENT 'Closing phrase',
    `signature` VARCHAR(100) NOT NULL DEFAULT 'Your Forever Love 💕' COMMENT 'Cursive signature name',
    `postscript` VARCHAR(300) NOT NULL DEFAULT '' COMMENT 'Optional P.S. note at bottom',
    `memory_id` BIGINT NULL COMMENT 'ForeignKey -> love_memory.id (Optional milestone dedication)',
    `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Active letter toggle',
    `created_at` DATETIME(6) NOT NULL,
    `updated_at` DATETIME(6) NOT NULL,
    INDEX `love_loveletter_memory_idx` (`memory_id`),
    INDEX `love_loveletter_created_idx` (`created_at`),
    CONSTRAINT `fk_loveletter_memory` FOREIGN KEY (`memory_id`) REFERENCES `love_memory` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────────────────
-- 6. Table: love_countdownsetting (Girlfriend's Day Timer Config)
-- ─────────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS `love_countdownsetting`;
CREATE TABLE `love_countdownsetting` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(200) NOT NULL DEFAULT 'Counting Down to Girlfriend''s Day 💕' COMMENT 'Title above timer',
    `subtitle` VARCHAR(300) NOT NULL DEFAULT '' COMMENT 'Subtitle below title',
    `target_date` DATETIME(6) NOT NULL COMMENT 'Exact date/time countdown reaches zero',
    `celebration_title` VARCHAR(200) NOT NULL DEFAULT 'Happy Girlfriend''s Day! 💖✨' COMMENT 'Title displayed at zero',
    `celebration_message` LONGTEXT NOT NULL COMMENT 'Message displayed during fireworks celebration',
    `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Active timer config toggle',
    `created_at` DATETIME(6) NOT NULL,
    `updated_at` DATETIME(6) NOT NULL,
    INDEX `love_countdownsetting_created_idx` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────────────────
-- 7. Table: love_secretpagesetting (Private Love Sanctuary Password & Message)
-- ─────────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS `love_secretpagesetting`;
CREATE TABLE `love_secretpagesetting` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `password` VARCHAR(100) NOT NULL DEFAULT 'forever0801' COMMENT 'Secret password to unlock sanctuary',
    `title` VARCHAR(200) NOT NULL DEFAULT 'My Deepest Secret 💖' COMMENT 'Title inside unlocked page',
    `message` LONGTEXT NOT NULL COMMENT 'Primary romantic confession message',
    `extended_message` LONGTEXT NOT NULL COMMENT 'Extended note below main message',
    `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Active sanctuary config toggle',
    `created_at` DATETIME(6) NOT NULL,
    `updated_at` DATETIME(6) NOT NULL,
    INDEX `love_secretpagesetting_created_idx` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────────────────
-- 8. Table: love_finalsurprisesetting (The Proposal / Final Climax)
-- ─────────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS `love_finalsurprisesetting`;
CREATE TABLE `love_finalsurprisesetting` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `hero_title` VARCHAR(200) NOT NULL DEFAULT 'One Last Question... 🌹' COMMENT 'Title shown before clicking',
    `hero_subtitle` VARCHAR(300) NOT NULL DEFAULT 'We have walked through our story, our memories, and our deepest reasons. Now, there is only one thing left to ask.' COMMENT 'Subtitle before clicking',
    `trigger_button_text` VARCHAR(100) NOT NULL DEFAULT 'Click Here ❤️' COMMENT 'Trigger button label',
    `love_message` VARCHAR(200) NOT NULL DEFAULT 'I Love You ❤️' COMMENT 'Giant love message',
    `question_message` VARCHAR(300) NOT NULL DEFAULT 'Will You Stay With Me Forever?' COMMENT 'Proposal question',
    `yes_button_text` VARCHAR(100) NOT NULL DEFAULT 'YES ❤️' COMMENT 'First affirmative button label',
    `always_yes_button_text` VARCHAR(100) NOT NULL DEFAULT 'ALWAYS YES ❤️' COMMENT 'Second affirmative button label',
    `no_button_text` VARCHAR(100) NOT NULL DEFAULT 'NO 💔' COMMENT 'Runaway button label',
    `success_message` LONGTEXT NOT NULL COMMENT 'Message displayed after clicking YES',
    `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Active surprise config toggle',
    `created_at` DATETIME(6) NOT NULL,
    `updated_at` DATETIME(6) NOT NULL,
    INDEX `love_finalsurprisesetting_created_idx` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────────────────
-- 9. Table: love_backgroundmusic (Website-Wide Background Music)
-- ─────────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS `love_backgroundmusic`;
CREATE TABLE `love_backgroundmusic` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(150) NOT NULL DEFAULT 'Our Romantic Symphony' COMMENT 'Music track title',
    `artist` VARCHAR(150) NOT NULL DEFAULT 'Forever Us Orchestra' COMMENT 'Artist or composer name',
    `audio_file` VARCHAR(100) NULL COMMENT 'Uploaded MP3/WAV file path',
    `audio_url` VARCHAR(500) NULL COMMENT 'External direct audio URL',
    `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Active track toggle',
    `order` INT UNSIGNED NOT NULL DEFAULT 1 COMMENT 'Playback order priority',
    `created_at` DATETIME(6) NOT NULL,
    `updated_at` DATETIME(6) NOT NULL,
    INDEX `love_backgroundmusic_order_idx` (`order`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;



