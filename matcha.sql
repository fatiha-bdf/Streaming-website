CREATE TABLE `conversations` (
  `id` int(11) NOT NULL,
  `from_id` int(11) NOT NULL,
  `to_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `likes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `liked_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `seen` BOOLEAN(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `username` varchar(20) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `last_login` datetime NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `users_accounts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `biography` text NOT NULL,
  `tags` text NOT NULL,
  `gender` enum('men','women') NOT NULL,
  `sexual_orientation` enum('hetero','homo','bi') NOT NULL,
  `age` int(11) NOT NULL,
  `location` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `users_blocked` (
  `id` int(11) NOT NULL,
  `blocker_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `users_reports` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `report_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `users_tokens` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` enum('EMAIL','RESET_PW') NOT NULL,
  `token` varchar(36) NOT NULL,
  `used_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `users_uploads` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `is_profile_pic` BOOLEAN(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `users_visits` (
  `id` int(11) NOT NULL,
  `visited_id` int(11) NOT NULL,
  `visitor_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
