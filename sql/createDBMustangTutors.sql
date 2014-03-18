#First make the database using the command below, and then import this file
#CREATE DATABASE MustangTutors;
USE MustangTutors;

CREATE TABLE `users` (
  `user_id` int(20) NOT NULL AUTO_INCREMENT,
  `smu_id` int(20) NOT NULL,
  `fName` varchar(30) NOT NULL,
  `lName` varchar(30) NOT NULL,
  `available` int(1) NOT NULL,
  `active` int(20) NOT NULL,
  `tutor` int(20) NOT NULL,
  `admin` int(20) NOT NULL,
  `email` varchar(30) NOT NULL,
  `pswd` varchar(200) NOT NULL,
  `codeword` varchar(30) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `smu_id` (`smu_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `codeword` (`codeword`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `rating` (
  `rating_id` int(20) NOT NULL AUTO_INCREMENT,
  `user_id` int(20) NOT NULL,
  `tutor_id` int(20) NOT NULL,
  `rating` int(1) NOT NULL,
  PRIMARY KEY (`rating_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `rating_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `courses` (
  `course_id` int(20) NOT NULL AUTO_INCREMENT,
  `course_name` varchar(30) NOT NULL,
  `course_number` int(20) NOT NULL,
  `subject` varchar(30) NOT NULL,
  PRIMARY KEY (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `schedule` (
  `schedule_id` int(20) NOT NULL AUTO_INCREMENT,
  `user_id` int(20) NOT NULL,
  `day` varchar(30) NOT NULL,
  `start_time` int(20) NOT NULL,
  `end_time` int(20) NOT NULL,
  PRIMARY KEY (`schedule_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `schedule_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `courses_tutored` (
  `courses_tutored_id` int(20) NOT NULL AUTO_INCREMENT,
  `course_id` int(20) NOT NULL,
  `user_id` int(20) NOT NULL,
  PRIMARY KEY (`courses_tutored_id`),
  KEY `course_id` (`course_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `courses_tutored_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`),
  CONSTRAINT `courses_tutored_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `comments` (
  `user_id` int(20) NOT NULL,
  `tutor_id` int(20) NOT NULL,
  `comment` varchar(500) NOT NULL,
  `timeStamp` datetime NOT NULL,
  KEY `user_id` (`user_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `records` (
  `report_id` int(20) NOT NULL AUTO_INCREMENT,
  `user_id` int(20) NOT NULL,
  `tutor_user_id` int(20) NOT NULL,
  `Date` datetime NOT NULL,
  `Summary` varchar(500) NOT NULL DEFAULT '',
  `course_name` varchar(30) NOT NULL DEFAULT '',
  PRIMARY KEY (`report_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `records_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `applications` (
  `application_id` int(20) NOT NULL AUTO_INCREMENT,
  `user_id` int(20) NOT NULL,
  `pending` int(1) NOT NULL,
  PRIMARY KEY (`application_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `applications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;