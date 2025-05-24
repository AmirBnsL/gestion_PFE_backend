-- MySQL dump 10.13  Distrib 8.4.5, for Linux (x86_64)
--
-- Host: localhost    Database: gestion_pfe
-- ------------------------------------------------------
-- Server version	8.4.5

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_f8a889c4362d78f056960ca6da` (`userId`),
  CONSTRAINT `FK_f8a889c4362d78f056960ca6dad` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `announcements`
--

DROP TABLE IF EXISTS `announcements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `announcements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `body` varchar(255) NOT NULL,
  `audience` enum('STUDENTS','TEACHERS','ALL') NOT NULL,
  `priority` enum('LOW','MEDIUM','HIGH') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `file_upload`
--

DROP TABLE IF EXISTS `file_upload`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `file_upload` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `link` varchar(255) NOT NULL,
  `projectId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_01d6bcd7864880f5e860ad57295` (`projectId`),
  CONSTRAINT `FK_01d6bcd7864880f5e860ad57295` FOREIGN KEY (`projectId`) REFERENCES `project` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `parameter`
--

DROP TABLE IF EXISTS `parameter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parameter` (
  `id` int NOT NULL AUTO_INCREMENT,
  `maxTeamSize` int NOT NULL,
  `allowTeamCreation` tinyint NOT NULL,
  `allowTeamJoining` tinyint NOT NULL,
  `allowWishListCreation` tinyint NOT NULL,
  `year` enum('1st preparatory class','2nd preparatory class','1st superior class','2nd superior class','3rd superior class') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `project`
--

DROP TABLE IF EXISTS `project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `startDate` datetime NOT NULL,
  `endDate` datetime NOT NULL,
  `specialty` enum('Informations Systems and Internet','Information Systems and Web','Artificial intelligence and Data Sciences') NOT NULL,
  `status` enum('proposed','approved','rejected','in_progress','completed','cancelled') NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `rejectionReason` varchar(255) DEFAULT NULL,
  `proposedById` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_b58f2370913c9e243d0c878f78b` (`proposedById`),
  CONSTRAINT `FK_b58f2370913c9e243d0c878f78b` FOREIGN KEY (`proposedById`) REFERENCES `teacher` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `project_settings`
--

DROP TABLE IF EXISTS `project_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `maxTeams` int NOT NULL,
  `maxSupervisors` int NOT NULL,
  `maxTeamPerSupervisor` int NOT NULL,
  `projectId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_fcdef2438667203eadf5936320` (`projectId`),
  CONSTRAINT `FK_fcdef2438667203eadf5936320b` FOREIGN KEY (`projectId`) REFERENCES `project` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sprint`
--

DROP TABLE IF EXISTS `sprint`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sprint` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `status` enum('On going','Not started','Completed') NOT NULL,
  `projectId` int NOT NULL,
  `teamId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_0b512ef3fa72b5afa40db28e4b7` (`projectId`),
  KEY `FK_a075246e2ee59a81a2e241c0f10` (`teamId`),
  CONSTRAINT `FK_0b512ef3fa72b5afa40db28e4b7` FOREIGN KEY (`projectId`) REFERENCES `project` (`id`),
  CONSTRAINT `FK_a075246e2ee59a81a2e241c0f10` FOREIGN KEY (`teamId`) REFERENCES `team` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student` (
  `id` int NOT NULL AUTO_INCREMENT,
  `status` enum('ACTIVE','INACTIVE','GRADUATED') NOT NULL DEFAULT 'ACTIVE',
  `job` enum('Front-end','Back-end','Full-stack','DevOps','Data Scientist','Data Analyst','Game Developer','Mobile Developer','Quality Assurance','UI/UX Designer') NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `birthdate` datetime NOT NULL,
  `promotionalYear` int NOT NULL,
  `academicYear` varchar(255) NOT NULL,
  `group` int NOT NULL,
  `specialty` enum('Informations Systems and Internet','Information Systems and Web','Artificial intelligence and Data Sciences') NOT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_b35463776b4a11a3df3c30d920` (`userId`),
  CONSTRAINT `FK_b35463776b4a11a3df3c30d920a` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=177 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `supervisor_invite`
--

DROP TABLE IF EXISTS `supervisor_invite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supervisor_invite` (
  `id` int NOT NULL AUTO_INCREMENT,
  `initiator` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `supervisorId` int DEFAULT NULL,
  `projectId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_1f8c7af93879c1a8410e722e77c` (`supervisorId`),
  KEY `FK_639289e01b2b030c756bdad9141` (`projectId`),
  CONSTRAINT `FK_1f8c7af93879c1a8410e722e77c` FOREIGN KEY (`supervisorId`) REFERENCES `teacher` (`id`),
  CONSTRAINT `FK_639289e01b2b030c756bdad9141` FOREIGN KEY (`projectId`) REFERENCES `project` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `task`
--

DROP TABLE IF EXISTS `task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `status` enum('TODO','IN PROGRESS','DONE') NOT NULL,
  `priority` enum('LOW','MEDIUM','HIGH') NOT NULL,
  `dueDate` datetime NOT NULL,
  `sprintId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_5ad8a047b8f023bf36b2a232a42` (`sprintId`),
  CONSTRAINT `FK_5ad8a047b8f023bf36b2a232a42` FOREIGN KEY (`sprintId`) REFERENCES `sprint` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `task_assigned_to_student`
--

DROP TABLE IF EXISTS `task_assigned_to_student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_assigned_to_student` (
  `taskId` int NOT NULL,
  `studentId` int NOT NULL,
  PRIMARY KEY (`taskId`,`studentId`),
  KEY `IDX_65e8d61efcd0f487fd4ed9532e` (`taskId`),
  KEY `IDX_64718956c722ea597bb5c3a907` (`studentId`),
  CONSTRAINT `FK_64718956c722ea597bb5c3a9074` FOREIGN KEY (`studentId`) REFERENCES `student` (`id`),
  CONSTRAINT `FK_65e8d61efcd0f487fd4ed9532e2` FOREIGN KEY (`taskId`) REFERENCES `task` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `teacher`
--

DROP TABLE IF EXISTS `teacher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacher` (
  `id` int NOT NULL AUTO_INCREMENT,
  `subject` varchar(255) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `birthdate` datetime NOT NULL,
  `rank` enum('Assistant','Associate','Professor') NOT NULL,
  `role` enum('LECTURER','INSTRUCTOR') NOT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_4f596730e16ee49d9b081b5d8e` (`userId`),
  CONSTRAINT `FK_4f596730e16ee49d9b081b5d8e5` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `teacher_supervised_projects_project`
--

DROP TABLE IF EXISTS `teacher_supervised_projects_project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacher_supervised_projects_project` (
  `teacherId` int NOT NULL,
  `projectId` int NOT NULL,
  PRIMARY KEY (`teacherId`,`projectId`),
  KEY `IDX_a586a51de2df10a59af99aba7e` (`teacherId`),
  KEY `IDX_a7f16ec09d33b8ee84e9e251e2` (`projectId`),
  CONSTRAINT `FK_a586a51de2df10a59af99aba7e4` FOREIGN KEY (`teacherId`) REFERENCES `teacher` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_a7f16ec09d33b8ee84e9e251e2e` FOREIGN KEY (`projectId`) REFERENCES `project` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `team`
--

DROP TABLE IF EXISTS `team`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team` (
  `id` int NOT NULL AUTO_INCREMENT,
  `specialty` enum('Informations Systems and Internet','Information Systems and Web','Artificial intelligence and Data Sciences') NOT NULL,
  `name` varchar(255) NOT NULL,
  `teamLeaderId` int DEFAULT NULL,
  `projectId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_cf461f5b40cf1a2b8876011e1e` (`name`),
  UNIQUE KEY `REL_751735d9d1ba28612ff36ab7a9` (`teamLeaderId`),
  KEY `FK_2defea9edb26358ff53c172ee28` (`projectId`),
  CONSTRAINT `FK_2defea9edb26358ff53c172ee28` FOREIGN KEY (`projectId`) REFERENCES `project` (`id`),
  CONSTRAINT `FK_751735d9d1ba28612ff36ab7a90` FOREIGN KEY (`teamLeaderId`) REFERENCES `student` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `team_invite`
--

DROP TABLE IF EXISTS `team_invite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team_invite` (
  `id` int NOT NULL AUTO_INCREMENT,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `initiator` varchar(255) DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `teamId` int DEFAULT NULL,
  `toUserId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_dec64033827ee287d0863a1b180` (`teamId`),
  KEY `FK_5b64a73a7da907b3b524424c1a5` (`toUserId`),
  CONSTRAINT `FK_5b64a73a7da907b3b524424c1a5` FOREIGN KEY (`toUserId`) REFERENCES `student` (`id`),
  CONSTRAINT `FK_dec64033827ee287d0863a1b180` FOREIGN KEY (`teamId`) REFERENCES `team` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `team_join_project_request`
--

DROP TABLE IF EXISTS `team_join_project_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team_join_project_request` (
  `id` int NOT NULL AUTO_INCREMENT,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `initiator` varchar(255) NOT NULL,
  `approved` tinyint NOT NULL DEFAULT '0',
  `projectId` int DEFAULT NULL,
  `teamId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_4cc2b4d9fde3a454d5cfe7862b1` (`projectId`),
  KEY `FK_d4dffd2c6918d3009058d119d59` (`teamId`),
  CONSTRAINT `FK_4cc2b4d9fde3a454d5cfe7862b1` FOREIGN KEY (`projectId`) REFERENCES `project` (`id`),
  CONSTRAINT `FK_d4dffd2c6918d3009058d119d59` FOREIGN KEY (`teamId`) REFERENCES `team` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `team_join_request`
--

DROP TABLE IF EXISTS `team_join_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team_join_request` (
  `id` int NOT NULL AUTO_INCREMENT,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `teamId` int DEFAULT NULL,
  `fromUserId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_cacc6db88063c82b6df3ba72178` (`teamId`),
  KEY `FK_128f57d965582a3b34207fc6c49` (`fromUserId`),
  CONSTRAINT `FK_128f57d965582a3b34207fc6c49` FOREIGN KEY (`fromUserId`) REFERENCES `student` (`id`),
  CONSTRAINT `FK_cacc6db88063c82b6df3ba72178` FOREIGN KEY (`teamId`) REFERENCES `team` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `team_membership`
--

DROP TABLE IF EXISTS `team_membership`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team_membership` (
  `id` int NOT NULL AUTO_INCREMENT,
  `joinedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `teamId` int DEFAULT NULL,
  `studentId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_e916e9b68b55832365766a6a51` (`studentId`),
  UNIQUE KEY `REL_e916e9b68b55832365766a6a51` (`studentId`),
  KEY `FK_603b30a6836a0963b49639fd40f` (`teamId`),
  CONSTRAINT `FK_603b30a6836a0963b49639fd40f` FOREIGN KEY (`teamId`) REFERENCES `team` (`id`),
  CONSTRAINT `FK_e916e9b68b55832365766a6a512` FOREIGN KEY (`studentId`) REFERENCES `student` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `role` enum('admin','teacher','student') NOT NULL,
  `passwordHash` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=182 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wish_list`
--

DROP TABLE IF EXISTS `wish_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wish_list` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` datetime NOT NULL,
  `teamId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_3394ff743f44b35ab2c9ba2b3c` (`teamId`),
  CONSTRAINT `FK_3394ff743f44b35ab2c9ba2b3ca` FOREIGN KEY (`teamId`) REFERENCES `team` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wish_list_entry`
--

DROP TABLE IF EXISTS `wish_list_entry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wish_list_entry` (
  `id` int NOT NULL AUTO_INCREMENT,
  `priority` int NOT NULL,
  `wishListId` int NOT NULL,
  `projectId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_940b64328ab7c825983c4234830` (`wishListId`),
  KEY `FK_96e53ebbf5d13709359c2c7878d` (`projectId`),
  CONSTRAINT `FK_940b64328ab7c825983c4234830` FOREIGN KEY (`wishListId`) REFERENCES `wish_list` (`id`),
  CONSTRAINT `FK_96e53ebbf5d13709359c2c7878d` FOREIGN KEY (`projectId`) REFERENCES `project` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-24 21:19:03
