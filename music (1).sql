-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Sep 07, 2025 at 03:47 PM
-- Server version: 10.6.19-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `music`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_admin`
--

CREATE TABLE `tbl_admin` (
  `id` bigint(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_admin`
--

INSERT INTO `tbl_admin` (`id`, `email`, `password`, `is_active`, `is_deleted`, `created_at`, `updated_at`) VALUES
(1, 'shaikhsohail@gmail.com', '$2b$10$oJBFQ8wuxop7MaIIPnTjHOV/HgWtpZQF1sHf.pOXASwFE0tSWyqL6', 1, 0, '2025-06-18 09:38:03', '2025-06-18 09:38:03');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_artist`
--

CREATE TABLE `tbl_artist` (
  `id` bigint(20) NOT NULL,
  `name` varchar(128) NOT NULL,
  `bio` text NOT NULL,
  `profile_picture` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_artist`
--

INSERT INTO `tbl_artist` (`id`, `name`, `bio`, `profile_picture`, `is_active`, `is_deleted`, `created_at`, `updated_at`) VALUES
(1, 'Atif Aslam', 'Pakistani playback singer and songwriter', '1755178644683-profile_image.jpg', 1, 0, '2025-08-14 13:37:26', '2025-08-14 13:37:26'),
(2, 'Krishnakumar Kunnath (KK)', 'Krishnakumar Kunnath (August 23, 1968 – May 31, 2022), professionally known as KK, was an iconic Indian playback singer who left an indelible mark on Indian music. His soulful and versatile voice brought to life numerous songs primarily in Hindi, Tamil, Telugu, and Kannada. He garnered widespread popularity for his ability to infuse emotions into his renditions, making his voice instantly recognizable and deeply cherished by audiences across the nation.', '1755180816058-KKImage.jpg', 1, 0, '2025-08-14 14:13:38', '2025-08-14 14:13:38'),
(3, 'Shreya Ghoshal', 'Shreya Ghoshal is an Indian playback singer known for her melodious voice, wide vocal range, and versatility. \nShe was born on March 12, 1984, in Berhampore, West Bengal. Her parents are Bishwajit and Sarmistha Ghoshal, and she has a younger brother, Soumyadeep. Ghoshal began learning music at age four. She pursued English at SIES College in Mumbai. \nGhoshal won the All India Light Vocal Music Competition in 1995 and the TV show Sa Re Ga Ma in 2000. Her Bollywood debut was in Devdas (2002), for which she won a National Film Award and a Filmfare Award. She is a prominent playback singer in various Indian languages. Ghoshal has also served as a judge on TV shows and performed in concerts. ', '1755180941674-shreya ghosle.jpg', 1, 0, '2025-08-14 14:15:42', '2025-08-14 14:15:42'),
(4, 'Shirley Setia', 'Shirley Setia is an Indian singer and actress, born in Daman, India, and raised in Auckland, New Zealand. She gained popularity as a YouTube musician, known for her Bollywood covers, and was dubbed \"Bollywood\'s Next Big Singing Sensation\" by Forbes Magazine. She has since moved to Mumbai to pursue her Bollywood career, making her acting debut in the Netflix film Maska and her Bollywood debut in Nikamma. ', '1755192432402-download (1).jpg', 1, 0, '2025-08-14 17:27:12', '2025-08-14 17:27:12'),
(5, 'Palak Muchhal', 'Palak Muchhal (born 30 March 1992) is an Indian playback singer and lyricist. She and her younger brother Palash Muchhal perform stage shows across India', '1755193245979-images.webp', 1, 0, '2025-08-14 17:40:46', '2025-08-14 17:40:46'),
(6, 'Tulsi Kumar', 'Tulsi Kumar is an Indian playback singer, radio jockey, and actress, known for her work in Bollywood. She is the daughter of the late music baron Gulshan Kumar, founder of T-Series, and sister to producer Bhushan Kumar. Born on March 15, 1990, she has carved her own successful path in the music industry. ', '1755194981795-images.webp', 1, 0, '2025-08-14 18:09:41', '2025-08-14 18:09:41'),
(7, 'Pritam Chakraborty', 'Pritam Chakraborty, also known simply as Pritam, is an Indian music composer, record producer, and music director known for his work in Bollywood films', '1755241221653-download (1).jpg', 1, 0, '2025-08-15 07:00:22', '2025-08-15 07:00:22'),
(8, 'Tanishk Bagchi', 'Tanishk Bagchi is an Indian music composer, producer, singer, and lyricist known for his work in Bollywood. He was born in Kolkata on November 23, 1980. Bagchi gained prominence with his composition \"Banno\" from Tanu Weds Manu Returns (2015). He is recognized for both original compositions and recreated versions of classic songs', '1755248245982-download (1).jpg', 1, 0, '2025-08-15 08:57:26', '2025-08-15 08:57:26');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_artist_songs`
--

CREATE TABLE `tbl_artist_songs` (
  `id` bigint(20) NOT NULL,
  `artist_id` bigint(20) NOT NULL,
  `song_id` bigint(20) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_artist_songs`
--

INSERT INTO `tbl_artist_songs` (`id`, `artist_id`, `song_id`, `is_active`, `is_deleted`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, 0, '2025-08-14 16:18:26', '2025-08-14 16:18:26'),
(2, 1, 2, 1, 0, '2025-08-14 16:47:04', '2025-08-14 16:47:04'),
(3, 1, 3, 1, 0, '2025-08-14 17:08:19', '2025-08-14 17:08:19'),
(4, 1, 4, 1, 0, '2025-08-14 17:18:51', '2025-08-14 17:18:51'),
(5, 3, 4, 1, 0, '2025-08-14 17:18:51', '2025-08-14 17:18:51'),
(6, 1, 5, 1, 0, '2025-08-14 17:32:11', '2025-08-14 17:32:11'),
(7, 4, 5, 1, 0, '2025-08-14 17:32:11', '2025-08-14 17:32:11'),
(8, 5, 6, 1, 0, '2025-08-14 17:44:39', '2025-08-14 17:44:39'),
(9, 1, 6, 1, 0, '2025-08-14 17:44:39', '2025-08-14 17:44:39'),
(10, 1, 7, 1, 0, '2025-08-14 17:53:11', '2025-08-14 17:53:11'),
(11, 1, 8, 1, 0, '2025-08-14 18:03:43', '2025-08-14 18:03:43'),
(12, 1, 9, 1, 0, '2025-08-14 18:12:58', '2025-08-14 18:12:58'),
(13, 6, 9, 1, 0, '2025-08-14 18:12:58', '2025-08-14 18:12:58'),
(14, 1, 10, 1, 0, '2025-08-15 07:04:24', '2025-08-15 07:04:24'),
(15, 7, 10, 1, 0, '2025-08-15 07:04:24', '2025-08-15 07:04:24'),
(16, 1, 11, 1, 0, '2025-08-15 07:22:37', '2025-08-15 07:22:37'),
(17, 1, 12, 1, 0, '2025-08-15 07:31:18', '2025-08-15 07:31:18'),
(18, 1, 13, 1, 0, '2025-08-15 07:41:21', '2025-08-15 07:41:21'),
(19, 1, 14, 1, 0, '2025-08-15 07:51:33', '2025-08-15 07:51:33'),
(20, 1, 15, 1, 0, '2025-08-15 08:39:07', '2025-08-15 08:39:07'),
(21, 1, 16, 1, 0, '2025-08-15 08:45:49', '2025-08-15 08:45:49'),
(22, 1, 17, 1, 0, '2025-08-15 08:51:41', '2025-08-15 08:51:41'),
(23, 1, 18, 1, 0, '2025-08-15 09:03:24', '2025-08-15 09:03:24'),
(24, 8, 18, 1, 0, '2025-08-15 09:03:24', '2025-08-15 09:03:24'),
(25, 2, 19, 1, 0, '2025-08-17 13:23:31', '2025-08-17 13:23:31'),
(26, 3, 20, 1, 0, '2025-08-17 13:34:04', '2025-08-17 13:34:04');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_category`
--

CREATE TABLE `tbl_category` (
  `id` bigint(20) NOT NULL,
  `name` varchar(128) NOT NULL,
  `image` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_category`
--

INSERT INTO `tbl_category` (`id`, `name`, `image`, `is_active`, `is_deleted`, `created_at`, `updated_at`) VALUES
(1, 'Pop', '1755185625266-pop.jpg', 1, 0, '2025-08-14 15:33:49', '2025-08-14 15:33:49'),
(2, 'Rock', '1755185653494-rock.jpg', 1, 0, '2025-08-14 15:34:15', '2025-08-14 15:34:15'),
(3, 'Classic', '1755185681061-classic.png', 1, 0, '2025-08-14 15:34:41', '2025-08-14 15:34:41'),
(4, 'Sufi/Spiritual', '1755242093558-Sufi-Spiritual.png', 1, 0, '2025-08-15 07:14:53', '2025-08-15 07:14:53'),
(5, 'Filmi Romantic', '1755247016423-Filmi Romantic.png', 1, 0, '2025-08-15 08:36:56', '2025-08-15 08:36:56');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_comments`
--

CREATE TABLE `tbl_comments` (
  `id` bigint(20) NOT NULL,
  `song_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `message` text NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_comments`
--

INSERT INTO `tbl_comments` (`id`, `song_id`, `user_id`, `message`, `is_active`, `is_deleted`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'Nice Song', 1, 0, '2025-08-19 06:32:17', '2025-08-19 06:32:17'),
(2, 1, 1, 'Atif is a Good Singer', 1, 0, '2025-08-19 07:48:19', '2025-08-19 07:48:19'),
(3, 1, 1, 'he is a Legend', 1, 0, '2025-08-19 07:53:33', '2025-08-19 07:53:33'),
(4, 20, 3, 'Nice !', 1, 0, '2025-08-30 10:35:39', '2025-08-30 10:35:39'),
(5, 10, 3, 'Nice !', 1, 0, '2025-08-30 10:37:46', '2025-08-30 10:37:46');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_featured_playlist`
--

CREATE TABLE `tbl_featured_playlist` (
  `id` bigint(20) NOT NULL,
  `name` varchar(128) NOT NULL,
  `description` text NOT NULL,
  `image` text NOT NULL,
  `category_id` bigint(20) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_featured_playlist`
--

INSERT INTO `tbl_featured_playlist` (`id`, `name`, `description`, `image`, `category_id`, `is_active`, `is_deleted`, `created_at`, `updated_at`) VALUES
(1, 'PlayList 2023', 'etbhauehb suh f ', '1757064646527-consert3.jpg', 1, 1, 0, '2025-09-05 09:30:46', '2025-09-05 09:30:46'),
(2, 'PlayList 2024', 'wqejcjwec wuec ', '1757065004736-consert3.jpg', 1, 1, 0, '2025-09-05 09:36:45', '2025-09-05 09:36:45');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_featured_playlist_song`
--

CREATE TABLE `tbl_featured_playlist_song` (
  `id` bigint(20) NOT NULL,
  `featured_id` bigint(20) NOT NULL,
  `song_id` bigint(20) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_featured_playlist_song`
--

INSERT INTO `tbl_featured_playlist_song` (`id`, `featured_id`, `song_id`, `is_active`, `is_deleted`, `created_at`, `updated_at`) VALUES
(1, 2, 1, 1, 0, '2025-09-06 14:26:07', '2025-09-06 14:26:07'),
(2, 2, 3, 1, 1, '2025-09-06 15:33:20', '2025-09-06 15:33:20'),
(3, 2, 19, 1, 0, '2025-09-06 15:52:19', '2025-09-06 15:52:19'),
(4, 1, 9, 1, 0, '2025-09-06 16:01:31', '2025-09-06 16:01:31'),
(5, 2, 2, 1, 0, '2025-09-06 16:10:53', '2025-09-06 16:10:53');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_forget_password`
--

CREATE TABLE `tbl_forget_password` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `token` varchar(64) NOT NULL,
  `expire_at` datetime NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_forget_password`
--

INSERT INTO `tbl_forget_password` (`id`, `user_id`, `token`, `expire_at`, `is_active`, `is_deleted`, `created_at`, `updated_at`) VALUES
(4, 3, 'P1DwP8Y6XO4i1BwTMKbp', '2025-08-29 20:07:29', 1, 0, '2025-08-29 14:32:29', '2025-08-29 14:32:29'),
(9, 3, 'FDR9CymGNg3u1NpOTzuL', '2025-08-30 16:39:40', 1, 0, '2025-08-30 11:08:40', '2025-08-30 11:08:40');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_images`
--

CREATE TABLE `tbl_images` (
  `id` bigint(20) NOT NULL,
  `image` varchar(255) NOT NULL,
  `song_id` bigint(20) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_likes`
--

CREATE TABLE `tbl_likes` (
  `id` bigint(20) NOT NULL,
  `song_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_likes`
--

INSERT INTO `tbl_likes` (`id`, `song_id`, `user_id`, `is_active`, `is_deleted`, `created_at`, `updated_at`) VALUES
(2, 1, 1, 1, 0, '2025-08-19 09:05:59', '2025-08-19 09:05:59'),
(3, 13, 1, 1, 0, '2025-08-19 09:55:38', '2025-08-19 09:55:38'),
(4, 15, 1, 1, 0, '2025-08-19 14:14:06', '2025-08-19 14:14:06'),
(5, 20, 3, 1, 0, '2025-08-30 10:34:31', '2025-08-30 10:34:31'),
(6, 10, 3, 1, 0, '2025-08-30 10:37:37', '2025-08-30 10:37:37'),
(7, 17, 3, 1, 0, '2025-08-30 10:39:12', '2025-08-30 10:39:12'),
(10, 19, 1, 1, 0, '2025-09-07 08:34:33', '2025-09-07 08:34:33'),
(11, 19, 1, 1, 0, '2025-09-07 08:50:38', '2025-09-07 08:50:38');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_playlist`
--

CREATE TABLE `tbl_playlist` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_playlist`
--

INSERT INTO `tbl_playlist` (`id`, `user_id`, `title`, `image`, `is_active`, `is_deleted`, `created_at`, `updated_at`) VALUES
(1, 1, 'Sad Songs', '1755620628083-ada621f9-f8e7-44a9-90a1-3497c0a1a5e7.jpg', 1, 0, '2025-08-19 16:23:48', '2025-08-19 16:23:48'),
(2, 1, 'Gym', '1755775124092-21a6b462-3cc5-4575-8c10-45d88858ab38.jpg', 1, 0, '2025-08-21 11:18:47', '2025-08-21 11:18:47'),
(3, 2, 'Summer vibes 2023', '1756206632802-consert1.jpg', 1, 0, '2025-08-26 11:10:33', '2025-08-26 11:10:33'),
(4, 2, 'Focus Flow', '1756206697354-consert2.jpg', 1, 0, '2025-08-26 11:11:37', '2025-08-26 11:11:37'),
(5, 2, 'Throwback Hits', '1756206711898-consert3.jpg', 1, 0, '2025-08-26 11:11:52', '2025-08-26 11:11:52'),
(6, 3, 'Atif Aslam', '1756550428796-consert2.jpg', 1, 0, '2025-08-30 10:40:28', '2025-08-30 10:40:28'),
(7, 3, 'gym', '1756550481650-consert1.jpg', 1, 0, '2025-08-30 10:41:21', '2025-08-30 10:41:21');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_playlist_song`
--

CREATE TABLE `tbl_playlist_song` (
  `id` bigint(20) NOT NULL,
  `playlist_id` bigint(20) NOT NULL,
  `song_id` bigint(20) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_playlist_song`
--

INSERT INTO `tbl_playlist_song` (`id`, `playlist_id`, `song_id`, `is_active`, `is_deleted`, `created_at`, `updated_at`) VALUES
(1, 1, 20, 1, 0, '2025-08-20 13:30:46', '2025-08-20 13:30:46'),
(2, 1, 1, 1, 0, '2025-08-20 13:33:14', '2025-08-20 13:33:14'),
(3, 2, 15, 1, 0, '2025-08-21 11:35:52', '2025-08-21 11:35:52'),
(4, 2, 9, 1, 0, '2025-08-21 11:36:20', '2025-08-21 11:36:20'),
(5, 6, 20, 1, 0, '2025-08-30 10:42:43', '2025-08-30 10:42:43');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_song`
--

CREATE TABLE `tbl_song` (
  `id` bigint(20) NOT NULL,
  `category_id` bigint(20) NOT NULL,
  `title` varchar(128) NOT NULL,
  `album_name` varchar(255) NOT NULL,
  `song` text NOT NULL,
  `cover_image` text NOT NULL,
  `lyrics` text NOT NULL,
  `duration` bigint(20) NOT NULL,
  `BPM` bigint(20) NOT NULL,
  `language` varchar(255) NOT NULL,
  `release_date` date NOT NULL,
  `copyright_info` text NOT NULL,
  `mood` varchar(128) NOT NULL,
  `is_featured` tinyint(1) NOT NULL,
  `explicit` tinyint(1) NOT NULL,
  `play_count` bigint(20) NOT NULL,
  `download_count` bigint(20) NOT NULL,
  `total_likes` bigint(20) NOT NULL,
  `total_comments` bigint(20) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_song`
--

INSERT INTO `tbl_song` (`id`, `category_id`, `title`, `album_name`, `song`, `cover_image`, `lyrics`, `duration`, `BPM`, `language`, `release_date`, `copyright_info`, `mood`, `is_featured`, `explicit`, `play_count`, `download_count`, `total_likes`, `total_comments`, `is_active`, `is_deleted`, `created_at`, `updated_at`) VALUES
(1, 3, 'tera hone laga hoon', 'Ajab Prem Ki Ghazab Kahani', '1755188297547-ajab-prem-ki-ghazab-kahani--atif-aslam--ranbir-katrina-k--pritam.mp3', '1755188299707-artworks-000163969592-zhzowp-t500x500.jpg', 'Shining in the sand and sun like\nA pearl upon the ocean\nCome and feel me.. How feel me\n\nShining in the sand and sun like\nA pearl upon the ocean\nCome on heal me.. Go heal me\n\nThinking about the love n making\nAnd life sharing come and feel me\nHow feel me\n\nShining in the shade in sun like\nA pearl upon the ocean\nCome on feel me\nCome on heal me..\n\nHua jo tubhi mera mera\nTera jo ikraar hua\nTo kyun na main bhi keh doon keh doon\n\nHua mujhe bhi pyaar hua\n\nTera hone laga hoon, khone laga hoon\nJab se mila hoon\n\nTera hone laga hoon, khone laga hoon\nJab se mila hoon\n\n\nShining in the shade in sun like\nA pearl upon the ocean\nCome and feel me.. How feel me\n\nShining in the shade in sun like\nA pearl upon the ocean\nCome on heal me.. Go heal me\n\nWaise to mann mera,\npehli bhi raaton mein\nAksar hi chahat ke haan\nSapne sanjonta tha\n\nPehle bhi dhadkan ye, dhun koi gaati thi\nPar ab jo hota hai\nwoh, pehle na hota tha\n\n\nHua hai tujhe jo bhi jo bhi\nMujhe bhi is baar hua\nTo kyun na main bhi, keh doon keh doon\n\nHua mujhe bhi pyaar hua\n\nTera hone laga hoon, khone laga hoon\nJab se mila hoon\nTeri hone lagi hoon, khone lagi hoon\n\nJab se mili hoon :-)\n\nAankhon se choo lun ke\nbahein tarasti hain\nDil ne pukara hai haan, ab to chale aao\nAaoge shabnam ki boonde barasti hain\nMausam ishara hai haan, ab to chale aao\n\nBaahon mein dhalein, baahein.. Baahein..\nBaahon ka jaise haar hua\nHaa manaa maine mana mana\n\nHua mujhe bhi pyaar hua\n\nTera hone laga hoon, khone laga hoon\nJab se mila hoon\n\nTeri hone laga/i hoon, khone laga/i hoon\nJab se mila/i hoooooooooooon....\n\n\nShining in the shade in sun like\nA pearl upon the ocean\nCome and feel me.. How feel me\n\nShining in the shade in sun like\nA pearl upon the ocean\nCome on heal me.. Go heal me\n\n\nThinking about the lovin making\nAnd life sharing come and feel me\nHow feel me\n\nShining in the shade in sun like\nA pearl upon the ocean\nCome on feel me\nCome on heal me...', 298, 20, 'Hindi', '2012-10-16', 'All right Reseved by This App Owner', 'romantic', 1, 0, 11, 0, 1, 3, 1, 0, '2025-08-14 16:18:26', '2025-08-14 16:18:26'),
(2, 3, 'Dil Diyan Gallan', ' Tiger Zinda Hai (2017)', '1755190023446-videoplayback.m4a', '1755190023952-download.jpg', 'Kachchi doriyon, doriyon, doriyon se mainu tu baandh le\nPakki yaariyon, yaariyon, yaariyon mein honde na faasle\nEh naaraazgi kaagazi saari teri, mere sohneya, sun lai meri\nDil diyan gallan karange naal-naal beh ke\nAkh naale akh nu mila ke\nDil diyan gallan, haaye, karange roz-roz beh ke\nSachchiyan mohabbatan nibha ke\nSataye mainu kyun, dikhaye mainu kyun\nAivein jhooti-mooti russ ke, rusa ke?\nDil diyan gallan, haaye\nKarange naal-naal beh ke\nAkh naale akh nu mila ke\nTainu lakkhan ton chhupa ke\nRakkhan akkhan \'te saja ke\nTu hai meri wafa, rakh apna bana ke\nMain tere laiyan, tere laiyan, yaara\nNa paavi kade dooriyan, haaye\nTainu lakkhan ton chhupa ke\nRakkhan akkhan \'te saja ke\nTu hai meri wafa, rakh apna bana ke\nMain tere laiyan, tere laiyan, yaara\nNa paavi kade dooriyan\nMain jeena haan tera\nMain jeena haan tera, tu jeena hai mera\nDass, laina ki nakhra dikha ke?\nDil diyan gallan\nKarange naal-naal beh ke\nAkh naale akh nu mila ke\nDil diyan gallan\nRaatan kaaliyan, kaaliyan, kaaliyan ne, mere dil saanwle\nMere haaniya, haaniya, haaniya, je lagge tu na gale\nMera aasmaan mausaman di na sune, koi khwaab na poore bune\nDil diyan gallan\nKarange naal-naal beh ke\nAkh naale akh nu mila ke\nPata hai mainu kyun chhupa ke dekhe tu\nMere naam se naam mila ke\nDil diyan gallan\nKarange naal-naal beh ke\nAkh naale akh nu mila ke\nDil diyan gallan', 185, 20, 'Hindi', '2017-02-07', 'All right Reseved by This App Owner', 'romantic', 1, 0, 1, 0, 0, 0, 1, 0, '2025-08-14 16:47:04', '2025-08-14 16:47:04'),
(3, 3, 'Pehli Dafa', 'Atif Aslam', '1755191298844-videoplayback (1).m4a', '1755191299049-download.jpg', 'Dil kahe kahaniyan\nPehli Dafa\n\nArmano Me ramaniyan\nPehli Dafa..\n\nHo gya begana\nMai hosh se pehle\npehli dafa\n\nPyaar ko Pehchana\nAehsaas he ye naya\n\n\nSuna hai Suna hai\nYeh Rasm-e Vafa hai\n\nJo Dil pe Nasha hai\nVo Pehli Dafa Hai\n\nSuna hai Suna hai\nYeh Rasm-e Vafa hai\n\nJo Dil pe Nasha hai\n\nVo Pehli Dafa Hai\n\n\nKabhi Dard si\nKabhi zard si\nzindgi benaam thi.\n\nKahi chahatein\nHuyee mehrban\nHath parh ke thamti\n\nEk vo Nazar\nEk vo nigah\nRooh mai Shamil isi tarah\n\nBann geya fasana\nIs baat se Pehli Dafa\nPaa.. liya hai tikana\nBahon ki hai panna\n\n\nSuna hai Suna hai\nYeh Rasm-e Vafa hai\n\nJo Dil pe Nasha hai\n\nVo Pehli Dafa Hai\n\n\nLage bevajah\nAl’faaz jo\nVo zaroorat ho gaye..\n\nTaqdeer ke\nKush Faisle\nJo Khanimat ho gaye..\n\nBadla hua\nHar pal hai\nRehti khumari Har jagah\n\nPyaar tha anjana\nHua sath mai\n\nYeh sar abh jana\nKya rang hai yeh chada\n\n\nSuna hai Suna hai..\nYeh Rasm-e Vafa hai..\n\nJo Dil pe Nasha hai..\nVo Pehli Dafa Hai..\n\n(Suna hai Suna hai..\nYeh Rasm-e Vafa hai..\n\nJo Dil pe Nasha hai..\nVo Pehli Dafa Hai..', 283, 20, 'Hindi', '2017-02-10', 'All right Reseved by This App Owner', 'romantic', 1, 1, 1, 0, 0, 0, 1, 0, '2025-08-14 17:08:19', '2025-08-14 17:08:19'),
(4, 3, 'Jeene Laga Huu', 'Ramiya Vastavaiya', '1755191931455-Jeene Laga Hoon Ramaiya Vastavaiya 128 Kbps.mp3', '1755191931651-download.jpg', 'Jeene Laga Hoon Pehle Se Zyada\nPehle Se Zyada Tum Pe Marne Laga Hoon...\n\n\nMain Mera Dil Aur Tum Ho Yahaan...\nPhir Kyun Ho Palkein Jhukayein Wahan...\nTum Sa Haseen Pehle Dekha Nahin...\nTum Isse Pehle The Jane Kahaan...\n\nJeene Laga Hoon Pehle Se Zyada\nPehle Se Zyada Tum Pe Marne Laga...\n\n\nRehte Ho Aake Jo Tum Paas Mere\nTham Jaaye Pal Ye Wahin,\nBass Main Yeh Sochun...\n\nSochu Main Tham Jaaye Pal\nYeh Paas Mere Jab Ho Tum...\nSochu Main Tham Jaaye Pal\nYeh Paas Mere Jab Ho Tum...\n\nChalti Hai Saansein Pehle Se Zyada\nPehle Se Zyada Dil Theharne Laga...\n\nTanhaiyon Mein Tujhe Dhoondhe Mera Dil\nHar pal yeh tujhko hi soche bhala kyun\n\n\nTanhai Mein Dhoondhe Tujhe Dil\nHar pal tujhko soche...\nTanhai Mein Dhoondhe Tujhe Dil\nHar pal tujhko soche...\n\nMilne lage dil, pehle se zyada.\n\nPehle se zyada ishq hone laga...', 202, 20, 'Hindi', '2013-01-17', 'All right Reseved by This App Owner', 'romantic', 1, 0, 1, 0, 0, 0, 1, 0, '2025-08-14 17:18:51', '2025-08-14 17:18:51'),
(5, 3, 'Jab Koi Baat', 'Atif Aslam', '1755192731144-jabkoibaat.mp3', '1755192731275-download.jpg', 'Jab koi baat bigad jaaye\nJab koi mushkil pad jaaye\nTum dena saath mera o humnava\n\nJab koi baat bigad jaaye\nJab koi mushkil pad jaaye\nTum dena saath mera o humnava\n\n\n🌟🌟Interlude🌟🌟\n\n\nHo chandni jab tak raat\nDeta hai har koi saath\nTum magar andheron mein\nNa chhodna mera haath\n[Na chhodna mera haath]\n\n\nHo chandni jab tak raat\nDeta hai har koi saath\nTum magar andheron mein\nNa chhodna mera haath\n\nNa koi hai, na koi tha\nZindagi mein tumhare siva\nTum dena saath mera o humnava\n\nJab koi Baat Bigad jaaye\nJab Koi mushkil Padjaaye\n\nTum dena Saath mera O humnavaa\n', 253, 20, 'Hindi', '2018-08-10', 'All right Reseved by This App Owner', 'romantic', 1, 0, 0, 0, 0, 0, 1, 0, '2025-08-14 17:32:11', '2025-08-14 17:32:11'),
(6, 3, 'Musafir', 'Musafir', '1755193479061-videoplayback.m4a', '1755193479219-download.jpg', 'Kaise..Jiyunga kaise..\nBatade mujhko tere bina..Haan\nKaise..Jiyunga kaise..\nBatade mujhko tere bina..Haan\n\nTere mera jahaan\nLe chalun main wahan\nKoi tujhko naa mujhse churale\nRakh lun ankhon pe main\nKholun palkein na main\nKoi tujhko naa mujhse churale..\n\nMain andhero se ghira hoon\nAa dikhade tu mujhko savera mera\nMain bhatakta ikk musafir\nAa dilade tu mujhko basera mera…\n\n\nJaagi jaagi raatein meri\nRoshan tujhse hai savera\nTuhi mere jeene ki wazah\nJab tak hain yeh saansein meri\nInpe hai sadaa haq tera\nPoori hai tujhse meri duaa\n\nTere mera jahaan\nLe chalun main wahan\nKoi tujhko naa mujhse churale\nRakh lun ankon mei main\nKholun palkein na main\nKoi tujhko naa mujhse churale..\n\n\nMain andhero se ghira hoon\nAa dikhade tu mujhko savera mera\nMain bhatakta ikk musafir\n\nAa dilade tu mujhko basera mera…\n\n– Female Voice –\n\nKaise..Jiyungi kaise..\nBatade mujhko tere bina..Haan\nKaise..Jiyungi kaise..\nBatade mujhko tere bina..Haan\n\nTere mera jahaan\nLe chalun main wahan\nKoi tujhko naa mujhse churale\nRakh lun ankhon mei main\nKholun palkein na main\nKoi tujhko naa mujhse churale..\n\n\nMain andhero se ghira hoon\nAa dikhade tu mujhko savera mera\nMain bhatakta ik musafir\n\nAa dilade tu mujhko basera mera…', 281, 20, 'Hindi', '2004-08-13', 'All right Reseved by This App Owner', 'sad', 1, 0, 0, 0, 0, 0, 1, 0, '2025-08-14 17:44:39', '2025-08-14 17:44:39'),
(7, 3, 'Dekhte Dekhte', 'Humko Deewana Kar Gaye', '1755193991049-videoplayback.m4a', '1755193991192-download.jpg', 'Rajj ke rulaya, rajj ke hasaya\nMaine dil kho ke ishq kamaya\nManga jo usne ek sitaara\nHamne zameen pe chand bulaya\nWo jo ankhon se… Haaye\nWo jo ankhon se, ek pal na ojhal huye\nWo jo ankhon se, ek pal na ojhal huye\nLaapata ho gaye dekhte dekhte\nSochta hoon!\nSochta hoon ke woh kitne masoom the\nSochta hoon ke woh kitne masoom the\nKya se kya ho gaye dekhte dekhte\nSochta hoon ke woh kitne masoom the\nKya se kya ho gye dekhte dekhte\nSochta hoon ke woh kitne masoom the\nSochta hoon ke woh kitne masoom the\nKya se kya ho gaye dekhte dekhte\nWo jo kahte the bichhdege na hum kabhi\nWo jo kahte the bichhdege na hum kabhi\n\nAlvida ho gaye dekhte dekhte\nSochta hoon!\n\nEk main our ek wo, our shamein kayi\nChand roshan the tab aasmaan mein kayi\nEk main our ek wo, our shamein kayi\nChand roshan the tab aasmaan mein kayi\n\nYaariyon ka wo dariya uttar bhi gaya\nOur haathon mein bas rett hi rah gaye\nKoi puchhe ke… haaye\nKoi puchhe ke hamse khata kya huyi?\nKyun khafa ho gaye dekhte dekhte\nAate jaate the jo sans banke kabhi\nAate jaate the jo sans banke kabhi\n\nWo hawa ho gaye dekhte dekhte\nWo hawa ho gaye… haaye\nOh ho ho…\nOh ho ho…\n(Woh hawa ho gaye dekhte dekhte\nAlvida ho gaye dekhte dekhte\nLapata ho gaye dekhte dekhte\nKya se kya ho gaye dekhte dekhte)\nOh…\nJeene marne ki hum the wajah aur hum hi\nJeene marne ki hum the wajah aur hum hi\n\nBewajah ho gaye dekhte dekhte…\nSochta hoon!\nSochta hoon ke vo kitne masoom the\nKya se kya ho gaye dekhte dekhte\nKya se kya ho gaye dekhte dekhte\nKya se kya ho gaye…. Oo hoo ooo…', 476, 20, 'Hindi', '2018-06-05', 'All right Reseved by This App Owner', 'happy', 1, 0, 0, 0, 0, 0, 1, 0, '2025-08-14 17:53:11', '2025-08-14 17:53:11'),
(8, 3, 'Dil Meri Na Sune', 'Genius', '1755194622696-Dil Meri Na Sune Genius 128 Kbps.mp3', '1755194622934-size_m_1532677407.jpg', 'Ooo...Oo...Oo..\nOOo...ooo..Ooo...\nMaine Chaani Ishq Ki Gali,\nBas Teri Aahatein Mil,\nMaine Chaha Chahoon Na Tujhe,\nPar Meri Ek Na Chali...\nIshq Mein Nigahoon Ko,\nMilti Hai Baarishein,\nPhir Bhi Kyu Kar Rha,\nDil Teri Khwahishein...\nDil Meri Na Sunne,\nDil Ki Main Na Sunu,\nDil Meri Na Suune,\nDil Ka Main Kya Karoon...\nDil Meri Na Sunne,\nDil Ki Main Na Sunu,\nDil Meri Na Suune,\nDil Ka Main Kya Karoon...\nOoo...Oo...Oo..\nOOo...ooo..Ooo...\nLaaya Kaha Mujhko,\nYe Mohh Tera,\nRaatein Na Abb Meri,\nNa Mera Sabera...\nJaan Lega Meri,\nYe Ishq Mera...\nIshq Mein Nigahoon Ko,\nMilti Hai Baarishein\nPhir Bhi Kyu Kar Rha,\nDil Teri Khwahishein...\nDil Meri Na Sunne,\nDil Ki Main Na Sunu,\nDil Meri Na Suune,\nDil Ka Main Kya Karoon...\nDil Meri Na Sunne,\nDil Ki Main Na Sunu,\nDil Meri Na Suune,\nDil Ka Main Kya Karoon...\nDil To Hai Dil Ka Kya,\nGustakh Hai Ye,\nDarta Nahi Pagal,\nBebaak Hai Ye..\nHai Rakeeb Khuda Ka Ye,\nIttefaq Hai Ye...\nIshq Mein Nigahoon Ko,\nMilti Hai Baarishein,\nPhir Bhi Kyu Kar Rha,\nDil Teri Khwahishein...\nDil Meri Na Sunne,\nDil Ki Main Na Sunu,\nDil Meri Na Suune,\nDil Ka Main Kya Karoon...\nDil Meri Na Sunne,\nDil Ki Main Na Sunu,\nDil Meri Na Suune,\nDil Ka Main Kya Karoon...', 262, 19, 'Hindi', '2018-01-01', 'All right Reseved by This App Owner', 'romantic', 1, 0, 0, 0, 0, 0, 1, 0, '2025-08-14 18:03:42', '2025-08-14 18:03:42'),
(9, 3, 'Paniyon Sa', 'Satyameva Jayate', '1755195178150-videoplayback.m4a', '1755195178257-download.jpg', 'Jo tere sang laagi preet mohe\nRooh baar baar tera naam le\nKi Rab se hai maangi yehi duaa aa\nTu haathon ki laqeerien thaam le\n\nChup hai baatein\nDil kaise bayaan main karun\nTu hi kehde\nWo jo baat main keh na sakun\n\n\nKi sang tere paniyon sa, paniyon sa\nPaniyon sa behta rahoon\nTu sunti rahe main\nkahaniyaan si kehta rahun\nKi sang tere baadalon sa, baadalon sa\nBaadalon sa udta rahoon\nTere ek ishaare pe teri ore mudta rahun\nOo...Oo...Oo...Oo...\n\nOo...Oo...Oo...Oo...\n🎶🎼Instrumental 🎼🎶\n\nAaadhi zameen, aadha aasmaan tha\nAadhi manzilein, aadha raasta tha\nIkk tere aaane se, mukamaal hua sab ye\nBin tere jahaan bhi bewajah tha~\n\nTera dil banke main saath tere dhadkun\nKhudko tujhse ab door na jaane doon\n\n\nKi sang tere paniyon sa, paniyon sa\nPaniyon sa behta rahoon\nTu sunti rahe main\nkahaniyaan si kehta rahun\nKi sang tere baadalon sa, baadalon sa\nBaadalon sa udta rahoon\nTere ek ishaare pe teri ore mudta rahun\nOo...Oo...Oo...Oo...\n\nOo...Oo...Oo...Oo...', 257, 20, 'Hindi', '2018-06-05', 'All right Reseved by This App Owner', 'romantic', 1, 0, 4, 0, 0, 0, 1, 0, '2025-08-14 18:12:58', '2025-08-14 18:12:58'),
(10, 3, 'Tu Jaane Na', 'Ajab Prem Ki Ghazab Kahani', '1755241464500-videoplayback.m4a', '1755241464631-download.jpg', 'Kaise batayein kyun tujhko chaahein?\nYaara, bata na paayein\nBaatein dilon ki dekho jo baaki\nAankhein tujhe samjhayein\nTu jaane na, tu jaane na\nTu jaane na, tu jaane na\nMil ke bhi hum na mile tumse na jaane kyun\nMeelon ke hain faasle tumse na jaane kyun\nAnjaane hain silsile tumse na jaane kyun\nSapne hain palkon tale tumse na jaane kyun\nKaise batayein kyun tujhko chaahein?\nYaara, bata na paayein\nBaatein dilon ki dekho jo baaki\nAankhein tujhe samjhayein\nTu jaane na, tu jaane na\nTu jaane na, tu jaane na\nNigaahon mein dekho meri jo hai bas gaya\nWoh hai milta tumse hoo-ba-hoo\nOh, jaane teri aankhein thi ya baatein thi wajah\nHue tum jo dil ki aarzu\nTum paas hoke bhi, tum aas hoke bhi\nEhsaas hoke bhi apne nahi\nAise hain humko gile tumse na jaane kyun\nMeelon ke hain faasle tumse na jaane kyun\nTu jaane na, tu jaane na\nTu jaane na, tu jaane na\nHo, jaane na, jaane na, jaane na\nHaan, tu jaane na\nKhayalon mein lakhon baat yoon toh keh gaya\nBola kuch na tere saamne\nOh, hue na begaane bhi tum hoke aur ke\nDekho tum na mere hi bane\nAfsos hota hai, dil bhi ye rota hai\nSapne sanjota hai, pagla hua\nSoche ye, hum the tumse na jaane kyun\nMeelon ke hain faasle tumse na jaane kyun\nAnjaane hain silsile tumse na jaane kyun\nSapne hain palkon tale tumse na jaane kyun\nKaise batayein kyun tujhko chaahein?\nYaara, bata na paayein\nBaatein dilon ki dekho jo baaki\nAankhein tumhein samjhayein\nTu jaane na, tu jaane na\nTu jaane na, tu jaane na\nTu jaane na, tu jaane na\nTu jaane na, tu jaane na\nTu jaane na, tu jaane na\n', 338, 20, 'Hindi', '2009-02-05', 'All right Reseved by This App Owner', 'sad', 1, 0, 1, 0, 1, 1, 1, 0, '2025-08-15 07:04:24', '2025-08-15 07:04:24'),
(11, 4, 'Wohi Khuda Hai', 'Atif Aslam', '1755242556229-videoplayback.m4a', '1755242556370-images.jpg', '\nKoi toh hai jo Nizaam-e-Hasti\n\nChala raha hai\nWohi Khuda hai\nWohi Khuda hai\n\nWohi Khuda hai...\n\nKoi toh hai jo Nizaam-e-hasti\nChala raha hai\nWohi Khuda hai\nKoi toh hai jo nizaam-e-hasti\nChala raha hai\nWohi Khuda hai\n\n\nDikhaai bhi jo na de\nNazar bhi jo aa raha hai\nWohi Khuda hai..\nWohi Khuda hai..\nWohi Khudaa hai..\nWohi Khuda hai..\n\n\n🦚💚🦚\n👍\n🦚💚🦚\n\n\nNazar bhi rakhe,Samaa\'tein bhi\n\nWoh jaan leta hai,Neeyatein bhi\nJo Khana-e-La\'shaoor mein\njagmaga raha hai\nWohi Khuda hai..\nWohi Khuda hai..\nWohi Khudaa hai..\nWohi Khuda hai..\n\n\n🦚💚🦚\n👍\n🦚💚🦚\n\n\nTalash usko.. na kar butoun mein\nWoh hai badalti hoi rutoun mein\nJo din ko raat aur raat ko\nDin bana raha hai\nWohi Khuda hai..\nWohi Khuda hai..\nWohi Khudaa hai..\n\nWohi Khuda hai..\n\n\nKoi to hai jo (Koi to hai jo)\nNizaam-e-hasti (Nizaam-e-hasti)\nChala raha hai (Chala raha hai)\nWohi Khuda hai (Wohi Khuda hai)\n\n\nDikhaai bhi jo na de\nNazar bhi jo aa raha hai\nWohi Khuda hai..\nWohi Khuda hai..\nWohi Khudaa hai..\nWohi Khuda hai..\n\n', 417, 20, 'Hindi', '2019-01-30', 'wecywe qecgqwec wec ', 'Reflective & Meditative', 1, 0, 0, 0, 0, 0, 1, 0, '2025-08-15 07:22:36', '2025-08-15 07:22:36'),
(12, 3, 'Tere Sang Yaara', 'Rustom', '1755243078143-videoplayback (1).m4a', '1755243078262-download.jpg', 'Tere sang, yaara,\nKhush rannng, bahara…,\nTu raaaaat, diwani…~,\nMain zard, sitaraaaa,\n\n\nO karam khudaya hai,\nTujhe mujhse milaya hai..,\nTujhpe mar ke hi toh…,\nMujhe jeena aaya hai..,\n\nO tere sang yaara,\nKhush rang bahara,\nTu raat deewani,\nMain zard sitara,\n\nO tere sang yara,\nKhush rang bahara,\nMain tera ho jaun,\nJo tu karde ishaara,\n\nSinger : Atif Aslam\nLyrics : Manoj Muntashir\nMusic : Arko\nMovie: Rustom\nStarring: Akshay Kumar & Ileana D\'cruz\nUploaded by @Pradiman\n\n\nKahin kisi bhi galli mein jaun main,\nTeri khushboo se takraun main,\nHar raat jo aata hai mujhe,\nWo khwab tu,\n\nTera mera milna dastoor hai,\nTere hone se mujh mein, noor hai,\nMain hoon soona sa , ek aasman,\nMehtaab tu,\n\n\nO karam khudaya hai,\nTujhe maine jo paaya hai,\nTujhpe mar ke hi toh,\nMujhe jeena aaya hai,\n\nO tere sang yaara,\nKhush rang bahara,\nTu raat deewani,\nMain zard sitara,\n\nO tere sang yara,\nKhush rang bahara,\nTere bin ab toh,\nNa jeena gavara,\n\nUploaded by @Pradiman\n\n\nMaine chode hain baaki saare raste,\nBas aaya hoon tere pass re,\nMeri ankhon mein tera naam hai,\nPehchan le,\n\nSab kuch mere liye tere, baad hai,\nSau baaton ki, ek baat hai,\nMain na jaunga kabhi tujhe chod ke,\nYe jaan le,\n\n\nO karam khudaya hai,\nTera pyar jo paaya hai,\nTujhpe mar ke hi toh,\nMujhe jeena aaya hai,\n\nO tere sang yaara,\nKhush rang bahara,\nTu raat deewani,\nMain zard sitara,\n\nO tere sang yaara,\nKhush rang bahara,\nMain behta musafir,\nTu thehra kinara.', 295, 20, 'Hindi', '2016-02-04', 'All right Reseved by This App Owner', 'romantic', 1, 0, 0, 0, 0, 0, 1, 0, '2025-08-15 07:31:18', '2025-08-15 07:31:18'),
(13, 1, 'Chale To Kat Hi Jayega', 'Single (\"Chale To Kat Hi Jayega\")', '1755243681101-videoplayback.m4a', '1755243681207-download.jpg', 'Abhi Taaron Se Khelo\nChand Ki Kirno Se Ithlao\nAbhi Taaron Se Khelo\nChand Ki Kirno Se Ithlao\n\nMilegi Uske Chehre Ki\nSahar Aahista Aahista\nChale To Kat Hi Jayega Safar\nAahista Aahista\nAahista Aahista\n\nYun Hi Ek Roz Apne\nDil Ka Kissa Bhi Suna Dena\nYun Hi Ek Roz Apne\nDil Ka Kissa Bhi Suna Dena\n\nKhitab Aahista Aahista\nNazar Aahista Aahista\nChale To Kat Hi Jayega Safar\nAahista Aahista\nAahista Aahista\n\nChale..Hmm..\nHo Ho Ho..Chale..\nAahista Aahista Aahista\nChale To Kat Hi Jayega Safar\nAahista Aahista\n\nHum Us Ke Paas Jaate The Magar\nAahista Aahista\n\nChale.. Aahista.', 203, 105, 'Hindi', '2021-03-23', 'All right Reseved by This App Owner', 'romantic', 1, 0, 13, 0, 1, 0, 1, 0, '2025-08-15 07:41:21', '2025-08-15 07:41:21'),
(14, 1, 'Zindagi Aa Raha Hoon Main', 'Atif Aslam (Single)', '1755244293568-Zindagi Aa Raha Hoon Main (PenduJatt.Com.Se).mp3', '1755244293639-download (1).jpg', 'Main sarphira musafir Hawaaon pe chalun\n\nYaaron ka main yaar hoon Haan hans ke sab se milun\n\nInn khali khali jebon mein Iraade behisaab hain\n\nInn chhoti chhoti aankhon mein\n\nBade bade se khwab hain\n\nSajaa de meri raahein tu Khol de apni baahein tu\n\nAa raha hoon main Zindagi aa raha hoon main\n\nKar le aa mujhse dosti Zindagi aa raha hoon main\n\nAa raha hoon main Zindagi aa raha hoon main\n\nKar le aa mujhse dosti Zindagi aa raha hoon main\n\nDil ki suni hai maine toh Dil ki hai main sununga\n\nPaagal sa hi jiya hoon main Paagal sa hi jeeyunga\n\nMujhe kya jeet haar se Mujhe hai pyaar pyaar se\n\nHey\n\nAa raha hoon main Zindagi aa raha hoon main\n\nKar le aa mujhse dosti Zindagi aa raha hoon main\n\nAa raha   hoon main Zindagi aa raha hoon main\n\nKar le aa mujhse dosti Zindagi aa raha hoon main\n\n(aa raha hoon main..)\n\nUtha lo aasmaano ko Utha do aur bhi ooncha\n\nMain apne pankhon ko kholun\n\nMazaa toh aaye udne ka\n\nMujhme hausla bhara Mujhe tu aazmaa zaraa\n\nAa raha hoon main Zindagi aa raha hoon main\n\nKar le aa mujhse dosti Zindagi aa raha hoon main\n\nAa raha hoon main Zindagi aa raha hoon main\n\nKar le aa mujhse dosti Zindagi aa raha hoon main', 222, 100, 'Hindi', '2015-05-18', 'inspirational, pop-rock', 'Motivational / Uplifting', 1, 0, 3, 0, 0, 0, 1, 0, '2025-08-15 07:51:33', '2025-08-15 07:51:33'),
(15, 5, 'Toota Jo Kabhi Tara', 'A Flying Jatt OST', '1755247146620-videoplayback.m4a', '1755247146806-mqdefault.webp', 'Kisi shaam ki tarah\nTera rang hai khila\nMain raat ik tanha\nTu chand sa mila\n\nHaan tujhe dekhta raha\nKisi khaab ki tarah\nJo ab saamne hai tu\nHo kaise yaqeen bhala\n\n\nToota jo kabhi taara, sajna ve!\nTujhe Rabb se maanga\nRabb se jo maanga mileya ve…\n\nTu mileya to jaane na dunga main\n\n\nHaan maine suni hai\nPariyon ki kahani\nWaisa hi noor tera\nChehra hai tera ruhani\n\nAa tujhko main apni\n(aaja meri) Baahon mein chupa loon\nHaan apni iss zameen ko\nKar doon main aasmaan bhi…\n\nZindagi rok doon main ab tere saamne\nPal do pal jo ruke tu mere sath mein\n\n\nToota jo kabhi tara sajna ve\nTujhe Rabb se maanga\nRabb se jo maanga mileya ve…\n\nTu mileya to jaane na dunga main\n\nItni bhi haseen main nahi, o yaara ve!\nMujhse bhi haseen toh tera ye pyar hai\nHaan itni bhi haseen main nahi\nO yaara ve!\nMujhse bhi haseen tera pyar…\n\n\nKe tera mera pyar ye\nJaise khwab aur duaa\nHaan sach kar raha inhe\nDekho mera Khuda…\n\nToota jo kabhi taara sajna ve\nTujhe Rabb se maanga\nRabb se jo maanga, mileya ve…\n\nTu mileya to jaane na dungi main', 278, 95, 'Hindi', '2016-08-17', 'Zee Music Company', 'romantic', 1, 0, 1, 0, 1, 0, 1, 0, '2025-08-15 08:39:07', '2025-08-15 08:39:07'),
(16, 1, 'Baarishein', 'Atif Aslam', '1755247549034-videoplayback.m4a', '1755247549125-download.jpg', 'Baarishein yun achanak hui\nTo laga tum sheher mein ho\nRaat bhar phir woh jab naa ruki\nTo laga tum sheher mein ho\n\nKahin ek saaz hai gunji\nTeri awaaz hai gunji\nMeri khamoshiyon ko ab karde bayan\n\nTere bin bewajah sab hai\nTu agar hai to matlab hai\nNahi toh toota sa aadhura karwan\n\n\nEk tera rasta, ek mera rasta\nNaiyo rehna ve juda\nNaiyo rehna ve juda\n\nEk tera rasta, ek mera rasta\nNaiyo rehna ve juda\nNaiyo rehna ve juda\n\n\nOo..oo..ooo…\nOo..oo...oo..o...\nOo..oo..ooo…\nOo..oo...oo..o...\n\n\nShaam phir khoobsurat hui\nTo laga tum sheher mein ho\nDoor ho ke bhi Nazron se tum\nHar lamha, har pehar mein ho\n\nSirf teri yaad saathi hai\nMeri fariyad baki hai\nJism aur jaan ka mita de faasla\n\nMere khwabon mein jo rang hai\nWo khilte bas tere sang hai\nJudd ke tujhse mukammal hogi dastan\n\n\nEk tera rasta, ek mera rasta\nNaiyo rehna ve juda\nNaiyo rehna ve juda\n\nEk tera rasta, ek mera rasta\nNaiyo rehna ve juda\nNaiyo rehna ve juda\n\nOo..oo..ooo…\nOo..oo...oo..o...\n\n\nBaarishein yun achanak hui\nTo laga tum sheher mein ho\nRaat bhar phir woh jab naa ruki\nTo laga tum sheher mein ho...', 251, 75, 'Hindi', '2019-02-13', 'T-Series', 'romantic', 1, 0, 3, 0, 0, 0, 1, 0, '2025-08-15 08:45:49', '2025-08-15 08:45:49'),
(17, 5, 'Pehli Nazar Mein', 'Race OST', '1755247900942-videoplayback (1).m4a', '1755247901155-pheli nazar.jpg', 'Pehli nazar mein\nKaise jaado kar diya\nTera ban baita hai\nMera jiya\nJaane kya hoga\nKya hoga kya pata\nIs pal ko milke\nAa jee le zara\n\nMein hoon yahan\nTu hai yahan\nMeri bahon mein aa\nAa bhi ja\nO jaan-e-jaan\nDono jahan\nMeri bahon mein aa\nBhool Ja aa\n\nO jaan-e-jaan\nDono jahan\nMeri bahon mein aa\nBhool Ja aa\n\nBaby i love u, baby i love you, baby i love you, baby i love you ... so..\nBaby i love u\nOh i love u\nI love u\nI love u so\nBaby i love u\n\nHar dua mein shamil tera pyaar hai\nBin tere lamha bhi dushwar hai\nDhadhkon ko tujhe se hi darkar hai\nTujhse hai rahtein\nTujhse hai chahtein\n\nHar dua mein shamil tera pyaar hai\nBin tere lamha bhi dushwar hai\nDhadhkon ko tujhe se hi darkar hai\nTujhse hai rahtein\nTujhse hai chahtein\n\nTu jo mili ek din mujhe\nMein kahin ho gaya lapata\n\n(O jaan-e-jaan\nDono jahan\nMeri bahon mein aa\nBhool Ja aa ) ..... 2\n\n(Kar diya Deewana dard-e-Kash ne\nChain cheena isqh ke ehsaas ne\nBekhayali di hai tere pyaas ne\nChaya suroor hai\nKuch to zaroor hai) ..... 2\n\nYeh dooriyan\nJeene na de\nHal mera tujhe na pata\n\n(O jaan-e-jaan\nDono jahan\nMeri bahon mein aa\nBhool Ja aa) ..... 2\n\nBaby i love u, baby i love you, baby i love you, baby i love you ... so..\nBaby i love u\nOh i love u\nBaby I love u\nI love u...', 336, 85, 'Hindi', '2008-03-08', 'Tips Industries', 'romantic', 1, 0, 3, 0, 1, 0, 1, 0, '2025-08-15 08:51:41', '2025-08-15 08:51:41'),
(18, 5, 'Tera Hua', 'Loveyatri OST', '1755248603880-videoplayback.m4a', '1755248604010-download.jpg', 'Tere qareeb aa raha hoon\nKhud se main door jaa raha hoon\nYeh bewajah toh nahi hai\nTu jo mila...\n\nDheere dheere se tera hua\nHaule haule se tera hua\nRafta rafta tera hua\nTere bin main hoon be-nishaan\n\nDheere dheere se tera hua\nHaule haule se tera hua\nRafta rafta tera hua\nTere bin main hoon be-nishaan\n\nSamjho zara, samjho ishaara\nTera hoon main saara ka saara\nJaise mujhe tumse hua hai\nYeh pyar naa hoga dobara\n\nDil mein teri jo jagah hai\nUski koi toh wajah hai\nYeh bewajah toh nahi hai\nTu jo mila...\n\nDheere dheere se tera hua\nHaule haule se tera hua\nRafta rafta tera hua\nTere bin main hoon be-nishaan\n\nDheere.. dheere..\nDheere dheere se..\n\nDheere dheere se tera huaa\nHaule haule se tera huaa...', 219, 96, 'Hindi', '2016-09-21', 'T-Series', 'romantic', 1, 0, 0, 0, 0, 0, 1, 0, '2025-08-15 09:03:24', '2025-08-15 09:03:24'),
(19, 1, 'Laboo ko Laboo se', 'Bhulbhulaiyya', '1755437010579-Labon Ko - Bhool Bhulaiyaa 320 Kbps.mp3', '1755437010915-download.jpg', 'Labon ko Labon pe sajao\nKya ho tum mujhe abb batao\nLabon ko Labon pe sajao\nKya ho tum mujhe abb batao\n\nTod do khud ko tum\nBanhon mein meri\nBanhon mein meri\nBanhon mein meri\nBanhon mein\nBanhon mein meri\nBanhon mein meri\nBanhon mein meri\nBanhon mein meri\n\n\naa aa aa aa\nLabon ko Labon pe sajao\n\nKya ho tum mujhe abb batao\n\n\nTere ehsaasson mein Bheege lamhato mein\nMujhko doobati tishnagi si hain\nTeri adao se dilkash khatao se\nIn lamho mein zindagi si hai\nHaya ko zara bhool jao\nMere hi tarah pesh aao\n\n\nkho bhi do khud ko tum\nRaaton mein meri\nRaaton mein meri\nRaaton mein meri\nRaaton mein\n\n\naa aa aa aa\n\n\nLabon ko Labon pe sajao\nKya ho tum mujhe abb batao\n\n\nTere zajbaaton mein mehki si saason mein\nYeh to mehek Sangali si hai\nDil ki panahon mein bekhri si aahon mein\nSone ki khwasish jagi si hai\nChehre se chehra chupao\nSene ki dhadkan sunao\nDekh lo khud ko tum\nAnnkhon mein meri\nAankhon mein meri\nAankhon mein meri\nAankhon mein\n\naa aa aa aa\n\n\nLabon ko Labon pe sajao\nKya ho tum mujhe abb batao', 341, 90, 'Hindi', '2025-08-11', 'T-Series', 'romantic', 1, 0, 5, 0, 2, 0, 1, 0, '2025-08-17 13:23:30', '2025-08-17 13:23:30'),
(20, 1, 'Agar tum Mil Jaaoo', 'Zeher (2005)', '1755437644265-videoplayback.m4a', '1755437644415-artworks-AdDV6ekNTZ3vrigw-X9GhyQ-t1080x1080.webp', 'Agar Tum Mil Jao\nZamana Chodd Denge Hum\n\nAgar Tum Mil Jao\nZamana Chodd Denge Hum\n\n\nAgar Tum Mil Jao\nZamana Chodd Denge Hum\n\nTumhe Paakar Zamane Bhar Se\nRishta Tod Denge Hum\nAgar Tum Mil Jao\nZamana Chodd Denge Hum ...\n\nAgar Tum Mil Jao\nZamana Chodd Denge Hum ...\n\n\n\nBina Tere Koi Dil Kash\nNazara Hum Na Dekhenge ...\n\nBina Tere Koi Dil Kash\nNazara Hum Na Dekhenge ...\n\nTumhe Na Ho Pasand Usko\nDobara Hum Na Dekhenge\n\n\nTeri Surat Na Ho Jis Mein...\nHm hm hm..Teri Surat Na Ho Jis Mein\nWo Sheesha Tod Denge Hum\n\nAgar Tum Mil Jao\nZamana Chodd Denge Hum\n\n\n\nTere Dil Mein Rahenge,\nTujhko apna ghar banayenge ...\n\nTere Dil Mein Rahenge,\nTujhko Apna Ghar Banayege...\n\nTere Khwaabon Ko Gehno Ki\nTarha Khud Par Sajaye Gein\n\nKasam Teri Kasam...\nHmm hm hm\nKasam Teri Kasam taqdeer ka\nRukh Mod Denge Hum\n\nAgar Tum Mil Jao\nZamana Chod Denge Hum\n\n\nTumhe Hum Apne Jism-Jaan mein\nKuch Aise Basa Lenge...\n\nTumhe Hum Apne Jism-Jaan mein\nKuch Aise Basa Lenge..\n\nTeri Khusboo ko Apni Jism Ki\nKhusboo Bana Lenge\n\nKhuda Se Bhi Na Jo Toote...\nhm hm hm\nKhuda Se Bhi Na Jo Toote\nWo Rishta Jod Lenge Hum\n\nAgar Tum Mil Jao\nZamana Chod Denge Hum\n\nTumhe Paakar Zamane Bhar Se\nRishta Tod Denge Hum\n\nAgar Tum Mil Jao\nZamana Chod Denge Hum )...\n\nAgar Tum Mil Jao\nZamana Chod Denge Hum )...', 360, 158, 'Hindi', '2005-03-25', 'Sa Re Ga Ma (Saregama)', 'romantic', 1, 0, 10, 0, 1, 1, 1, 0, '2025-08-17 13:34:04', '2025-08-17 13:34:04');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_tags`
--

CREATE TABLE `tbl_tags` (
  `id` bigint(20) NOT NULL,
  `tag` varchar(128) NOT NULL,
  `song_id` bigint(20) NOT NULL,
  `is_active` int(11) NOT NULL DEFAULT 1,
  `is_deleted` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_tags`
--

INSERT INTO `tbl_tags` (`id`, `tag`, `song_id`, `is_active`, `is_deleted`, `created_at`, `updated_at`) VALUES
(1, 'atifaslam', 1, 1, 0, '2025-08-14 16:18:26', '2025-08-14 16:18:26'),
(2, 'atif', 1, 1, 0, '2025-08-14 16:18:27', '2025-08-14 16:18:27'),
(3, 'aslam', 1, 1, 0, '2025-08-14 16:18:27', '2025-08-14 16:18:27'),
(4, 'atifaslam', 2, 1, 0, '2025-08-14 16:47:04', '2025-08-14 16:47:04'),
(5, 'atif', 2, 1, 0, '2025-08-14 16:47:04', '2025-08-14 16:47:04'),
(6, 'aslam', 2, 1, 0, '2025-08-14 16:47:04', '2025-08-14 16:47:04'),
(7, 'salmankhan', 2, 1, 0, '2025-08-14 16:47:04', '2025-08-14 16:47:04'),
(8, 'tigerzindahai', 2, 1, 0, '2025-08-14 16:47:04', '2025-08-14 16:47:04'),
(9, 'tiger', 2, 1, 0, '2025-08-14 16:47:05', '2025-08-14 16:47:05'),
(10, 'zinda', 2, 1, 0, '2025-08-14 16:47:05', '2025-08-14 16:47:05'),
(11, 'atifaslam', 3, 1, 0, '2025-08-14 17:08:19', '2025-08-14 17:08:19'),
(12, 'atif', 3, 1, 0, '2025-08-14 17:08:19', '2025-08-14 17:08:19'),
(13, 'aslam', 3, 1, 0, '2025-08-14 17:08:19', '2025-08-14 17:08:19'),
(14, 'atifaslam', 4, 1, 0, '2025-08-14 17:18:51', '2025-08-14 17:18:51'),
(15, 'atif', 4, 1, 0, '2025-08-14 17:18:51', '2025-08-14 17:18:51'),
(16, 'aslam', 4, 1, 0, '2025-08-14 17:18:51', '2025-08-14 17:18:51'),
(17, 'shreya', 4, 1, 0, '2025-08-14 17:18:51', '2025-08-14 17:18:51'),
(18, 'shreyaghosle', 4, 1, 0, '2025-08-14 17:18:51', '2025-08-14 17:18:51'),
(19, 'ghosle', 4, 1, 0, '2025-08-14 17:18:51', '2025-08-14 17:18:51'),
(20, 'atifaslam', 5, 1, 0, '2025-08-14 17:32:11', '2025-08-14 17:32:11'),
(21, 'atif', 5, 1, 0, '2025-08-14 17:32:11', '2025-08-14 17:32:11'),
(22, 'aslam', 5, 1, 0, '2025-08-14 17:32:11', '2025-08-14 17:32:11'),
(23, 'shirley', 5, 1, 0, '2025-08-14 17:32:11', '2025-08-14 17:32:11'),
(24, 'setia', 5, 1, 0, '2025-08-14 17:32:11', '2025-08-14 17:32:11'),
(25, 'shirleysetia', 5, 1, 0, '2025-08-14 17:32:11', '2025-08-14 17:32:11'),
(26, 'atifaslam', 6, 1, 0, '2025-08-14 17:44:39', '2025-08-14 17:44:39'),
(27, 'atif', 6, 1, 0, '2025-08-14 17:44:39', '2025-08-14 17:44:39'),
(28, 'aslam', 6, 1, 0, '2025-08-14 17:44:39', '2025-08-14 17:44:39'),
(29, 'palak', 6, 1, 0, '2025-08-14 17:44:39', '2025-08-14 17:44:39'),
(30, 'palakmuchhal', 6, 1, 0, '2025-08-14 17:44:39', '2025-08-14 17:44:39'),
(31, 'atifaslam', 7, 1, 0, '2025-08-14 17:53:11', '2025-08-14 17:53:11'),
(32, 'atif', 7, 1, 0, '2025-08-14 17:53:11', '2025-08-14 17:53:11'),
(33, 'aslam', 7, 1, 0, '2025-08-14 17:53:11', '2025-08-14 17:53:11'),
(34, 'atifaslam', 8, 1, 0, '2025-08-14 18:03:43', '2025-08-14 18:03:43'),
(35, 'atif', 8, 1, 0, '2025-08-14 18:03:43', '2025-08-14 18:03:43'),
(36, 'aslam', 8, 1, 0, '2025-08-14 18:03:43', '2025-08-14 18:03:43'),
(37, 'atifaslam', 9, 1, 0, '2025-08-14 18:12:58', '2025-08-14 18:12:58'),
(38, 'atif', 9, 1, 0, '2025-08-14 18:12:58', '2025-08-14 18:12:58'),
(39, 'aslam', 9, 1, 0, '2025-08-14 18:12:58', '2025-08-14 18:12:58'),
(40, 'Paniyonsa', 9, 1, 0, '2025-08-14 18:12:58', '2025-08-14 18:12:58'),
(41, 'tulsi', 9, 1, 0, '2025-08-14 18:12:58', '2025-08-14 18:12:58'),
(42, 'tulsikumar', 9, 1, 0, '2025-08-14 18:12:58', '2025-08-14 18:12:58'),
(43, 'atifaslam', 10, 1, 0, '2025-08-15 07:04:24', '2025-08-15 07:04:24'),
(44, 'atif', 10, 1, 0, '2025-08-15 07:04:24', '2025-08-15 07:04:24'),
(45, 'aslam', 10, 1, 0, '2025-08-15 07:04:24', '2025-08-15 07:04:24'),
(46, 'tujanenaa', 10, 1, 0, '2025-08-15 07:04:24', '2025-08-15 07:04:24'),
(47, 'atifaslam', 11, 1, 0, '2025-08-15 07:22:37', '2025-08-15 07:22:37'),
(48, 'atif', 11, 1, 0, '2025-08-15 07:22:37', '2025-08-15 07:22:37'),
(49, 'aslam', 11, 1, 0, '2025-08-15 07:22:37', '2025-08-15 07:22:37'),
(50, 'atifaslam', 12, 1, 0, '2025-08-15 07:31:18', '2025-08-15 07:31:18'),
(51, 'atif', 12, 1, 0, '2025-08-15 07:31:18', '2025-08-15 07:31:18'),
(52, 'aslam', 12, 1, 0, '2025-08-15 07:31:18', '2025-08-15 07:31:18'),
(53, 'atifaslam', 13, 1, 0, '2025-08-15 07:41:21', '2025-08-15 07:41:21'),
(54, 'atif', 13, 1, 0, '2025-08-15 07:41:21', '2025-08-15 07:41:21'),
(55, 'aslam', 13, 1, 0, '2025-08-15 07:41:21', '2025-08-15 07:41:21'),
(56, 'inspirational', 14, 1, 0, '2025-08-15 07:51:33', '2025-08-15 07:51:33'),
(57, 'pop-rock', 14, 1, 0, '2025-08-15 07:51:33', '2025-08-15 07:51:33'),
(58, 'atif', 14, 1, 0, '2025-08-15 07:51:33', '2025-08-15 07:51:33'),
(59, 'ove', 15, 1, 0, '2025-08-15 08:39:07', '2025-08-15 08:39:07'),
(60, 'ballad', 15, 1, 0, '2025-08-15 08:39:07', '2025-08-15 08:39:07'),
(61, 'atifaslam', 15, 1, 0, '2025-08-15 08:39:07', '2025-08-15 08:39:07'),
(62, 'atif', 15, 1, 0, '2025-08-15 08:39:07', '2025-08-15 08:39:07'),
(63, 'atifaslam', 16, 1, 0, '2025-08-15 08:45:49', '2025-08-15 08:45:49'),
(64, 'atif', 16, 1, 0, '2025-08-15 08:45:49', '2025-08-15 08:45:49'),
(65, 'aslam', 16, 1, 0, '2025-08-15 08:45:49', '2025-08-15 08:45:49'),
(66, 'breakup', 16, 1, 0, '2025-08-15 08:45:49', '2025-08-15 08:45:49'),
(67, 'rain', 16, 1, 0, '2025-08-15 08:45:49', '2025-08-15 08:45:49'),
(68, 'love', 16, 1, 0, '2025-08-15 08:45:49', '2025-08-15 08:45:49'),
(69, 'atifaslam', 17, 1, 0, '2025-08-15 08:51:41', '2025-08-15 08:51:41'),
(70, 'atif', 17, 1, 0, '2025-08-15 08:51:41', '2025-08-15 08:51:41'),
(71, 'aslam', 17, 1, 0, '2025-08-15 08:51:41', '2025-08-15 08:51:41'),
(72, 'romantic', 17, 1, 0, '2025-08-15 08:51:41', '2025-08-15 08:51:41'),
(73, 'bollywood', 17, 1, 0, '2025-08-15 08:51:41', '2025-08-15 08:51:41'),
(74, 'atifaslam', 18, 1, 0, '2025-08-15 09:03:24', '2025-08-15 09:03:24'),
(75, 'atif', 18, 1, 0, '2025-08-15 09:03:24', '2025-08-15 09:03:24'),
(76, 'aslam', 18, 1, 0, '2025-08-15 09:03:24', '2025-08-15 09:03:24'),
(77, 'love', 18, 1, 0, '2025-08-15 09:03:24', '2025-08-15 09:03:24'),
(78, 'bollywood', 18, 1, 0, '2025-08-15 09:03:24', '2025-08-15 09:03:24'),
(79, 'kk', 19, 1, 0, '2025-08-17 13:23:31', '2025-08-17 13:23:31'),
(80, 'Laboo', 19, 1, 0, '2025-08-17 13:23:31', '2025-08-17 13:23:31'),
(81, 'shreyaghoshal', 20, 1, 0, '2025-08-17 13:34:04', '2025-08-17 13:34:04');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_user`
--

CREATE TABLE `tbl_user` (
  `id` bigint(20) NOT NULL,
  `email` varchar(128) NOT NULL,
  `password` varchar(128) NOT NULL,
  `name` varchar(128) NOT NULL,
  `username` varchar(255) NOT NULL,
  `login_type` enum('S','G') NOT NULL,
  `social_id` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_user`
--

INSERT INTO `tbl_user` (`id`, `email`, `password`, `name`, `username`, `login_type`, `social_id`, `is_active`, `is_deleted`, `created_at`, `updated_at`) VALUES
(1, 'shaikhsohail1050@gmail.com', '', 'Sohail Shaikh', 'shaikhsohail1050', 'G', '107857402788406698785', 1, 0, '2025-08-14 13:28:46', '2025-08-14 13:28:46'),
(2, 'shaikhsohail1131@gmail.com', '', 'Sohel Shaikh', 'shaikhsohail1131', 'G', '103578493547461279779', 1, 0, '2025-08-16 07:49:19', '2025-08-16 07:49:19'),
(3, 'cartoonmaniya1121@gmail.com', '$2b$10$c7AyhRf.yU24HuA/rP9L9uOBl6pJde00kiADaM.rz4EUT1kzloyiO', 'Adnan', 'cartoonmaniya1121', 'S', '', 1, 0, '2025-08-29 13:17:44', '2025-08-29 13:17:44'),
(4, 'anas1212@gmail.com', '$2b$10$ptk1Mz8A6i7j/b.ZkDnr.uonolWKmJ3snKqEJFgVPLDKghwaZXSQO', 'Anas', 'anas1212', 'S', '', 1, 0, '2025-08-29 14:39:32', '2025-08-29 14:39:32');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_admin`
--
ALTER TABLE `tbl_admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_artist`
--
ALTER TABLE `tbl_artist`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_artist_songs`
--
ALTER TABLE `tbl_artist_songs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_category`
--
ALTER TABLE `tbl_category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_comments`
--
ALTER TABLE `tbl_comments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_featured_playlist`
--
ALTER TABLE `tbl_featured_playlist`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_featured_playlist_song`
--
ALTER TABLE `tbl_featured_playlist_song`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_forget_password`
--
ALTER TABLE `tbl_forget_password`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_images`
--
ALTER TABLE `tbl_images`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_likes`
--
ALTER TABLE `tbl_likes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_playlist`
--
ALTER TABLE `tbl_playlist`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_playlist_song`
--
ALTER TABLE `tbl_playlist_song`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_song`
--
ALTER TABLE `tbl_song`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_tags`
--
ALTER TABLE `tbl_tags`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_user`
--
ALTER TABLE `tbl_user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_admin`
--
ALTER TABLE `tbl_admin`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tbl_artist`
--
ALTER TABLE `tbl_artist`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `tbl_artist_songs`
--
ALTER TABLE `tbl_artist_songs`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `tbl_category`
--
ALTER TABLE `tbl_category`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `tbl_comments`
--
ALTER TABLE `tbl_comments`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `tbl_featured_playlist`
--
ALTER TABLE `tbl_featured_playlist`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tbl_featured_playlist_song`
--
ALTER TABLE `tbl_featured_playlist_song`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `tbl_forget_password`
--
ALTER TABLE `tbl_forget_password`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `tbl_images`
--
ALTER TABLE `tbl_images`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_likes`
--
ALTER TABLE `tbl_likes`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `tbl_playlist`
--
ALTER TABLE `tbl_playlist`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `tbl_playlist_song`
--
ALTER TABLE `tbl_playlist_song`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `tbl_song`
--
ALTER TABLE `tbl_song`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `tbl_tags`
--
ALTER TABLE `tbl_tags`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;

--
-- AUTO_INCREMENT for table `tbl_user`
--
ALTER TABLE `tbl_user`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
