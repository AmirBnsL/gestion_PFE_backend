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
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,'Admin','Admin',1);
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `announcements`
--

LOCK TABLES `announcements` WRITE;
/*!40000 ALTER TABLE `announcements` DISABLE KEYS */;
/*!40000 ALTER TABLE `announcements` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `file_upload`
--

LOCK TABLES `file_upload` WRITE;
/*!40000 ALTER TABLE `file_upload` DISABLE KEYS */;
/*!40000 ALTER TABLE `file_upload` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `parameter`
--

LOCK TABLES `parameter` WRITE;
/*!40000 ALTER TABLE `parameter` DISABLE KEYS */;
INSERT INTO `parameter` VALUES (1,5,1,1,1,'1st preparatory class'),(2,5,1,1,1,'2nd preparatory class'),(3,5,1,1,1,'1st superior class'),(4,5,1,1,1,'2nd superior class'),(5,5,1,1,1,'3rd superior class');
/*!40000 ALTER TABLE `parameter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `presentation_day`
--

DROP TABLE IF EXISTS `presentation_day`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `presentation_day` (
  `status` varchar(255) NOT NULL DEFAULT 'draft',
  `academicYear` enum('1st preparatory class','2nd preparatory class','1st superior class','2nd superior class','3rd superior class') NOT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `presentation_day`
--

LOCK TABLES `presentation_day` WRITE;
/*!40000 ALTER TABLE `presentation_day` DISABLE KEYS */;
INSERT INTO `presentation_day` VALUES ('draft','1st preparatory class',26,'2025-05-26');
/*!40000 ALTER TABLE `presentation_day` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `presentation_slot`
--

DROP TABLE IF EXISTS `presentation_slot`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `presentation_slot` (
  `endTime` varchar(255) NOT NULL,
  `room` varchar(255) NOT NULL,
  `teamId` int DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  `presentationDayId` int DEFAULT NULL,
  `startTime` time NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_437e1230a51d032647b027f31f` (`teamId`),
  KEY `FK_6092f4a1953b45cd972552c83c6` (`presentationDayId`),
  CONSTRAINT `FK_437e1230a51d032647b027f31fa` FOREIGN KEY (`teamId`) REFERENCES `team` (`id`),
  CONSTRAINT `FK_6092f4a1953b45cd972552c83c6` FOREIGN KEY (`presentationDayId`) REFERENCES `presentation_day` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `presentation_slot`
--

LOCK TABLES `presentation_slot` WRITE;
/*!40000 ALTER TABLE `presentation_slot` DISABLE KEYS */;
INSERT INTO `presentation_slot` VALUES ('10:00','tp11',1,8,26,'08:00:00');
/*!40000 ALTER TABLE `presentation_slot` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `presentation_slot_judges_teacher`
--

DROP TABLE IF EXISTS `presentation_slot_judges_teacher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `presentation_slot_judges_teacher` (
  `teacherId` int NOT NULL,
  `presentationSlotId` int NOT NULL,
  PRIMARY KEY (`teacherId`,`presentationSlotId`),
  KEY `IDX_4876c4201954ae750d1a5aa3c0` (`teacherId`),
  KEY `IDX_710e6ea40562302b0cd9d33e02` (`presentationSlotId`),
  CONSTRAINT `FK_4876c4201954ae750d1a5aa3c0b` FOREIGN KEY (`teacherId`) REFERENCES `teacher` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_710e6ea40562302b0cd9d33e023` FOREIGN KEY (`presentationSlotId`) REFERENCES `presentation_slot` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `presentation_slot_judges_teacher`
--

LOCK TABLES `presentation_slot_judges_teacher` WRITE;
/*!40000 ALTER TABLE `presentation_slot_judges_teacher` DISABLE KEYS */;
INSERT INTO `presentation_slot_judges_teacher` VALUES (1,8);
/*!40000 ALTER TABLE `presentation_slot_judges_teacher` ENABLE KEYS */;
UNLOCK TABLES;

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
  `academicYear` enum('1st preparatory class','2nd preparatory class','1st superior class','2nd superior class','3rd superior class') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_b58f2370913c9e243d0c878f78b` (`proposedById`),
  CONSTRAINT `FK_b58f2370913c9e243d0c878f78b` FOREIGN KEY (`proposedById`) REFERENCES `teacher` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project`
--

LOCK TABLES `project` WRITE;
/*!40000 ALTER TABLE `project` DISABLE KEYS */;
INSERT INTO `project` VALUES (1,'ai in medicine','app that tracks patients health','2025-05-24 15:29:44','2025-05-24 15:29:44','Informations Systems and Internet','approved','2025-05-24 15:29:44','2025-05-24 15:29:44',NULL,1,''),(2,'chill guys','nigga waht','2025-05-24 23:43:02','2025-05-24 23:43:02','Information Systems and Web','proposed','2025-05-24 23:43:02','2025-05-24 23:43:02',NULL,1,'1st preparatory class'),(3,'dqdqdq','dqdqdqdqdqdqdqdq','2025-05-25 00:10:34','2025-05-25 00:10:34','Information Systems and Web','proposed','2025-05-25 00:10:34','2025-05-25 00:10:34',NULL,1,'2nd preparatory class'),(4,'dqdq','dqdqdqdqdq','2025-05-25 00:22:12','2025-05-25 00:22:12','Information Systems and Web','proposed','2025-05-25 00:22:12','2025-05-25 00:22:12',NULL,1,'2nd preparatory class'),(5,'amir hydra','amir hydra is the best guy aver','2025-05-25 00:22:39','2025-05-25 00:22:39','Artificial intelligence and Data Sciences','proposed','2025-05-25 00:22:39','2025-05-25 00:22:39',NULL,1,'2nd superior class'),(6,'insane gains','workout ai ','2025-05-25 00:26:07','2025-05-25 00:26:07','Artificial intelligence and Data Sciences','proposed','2025-05-25 00:26:07','2025-05-25 00:26:07',NULL,1,'3rd superior class');
/*!40000 ALTER TABLE `project` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `project_settings`
--

LOCK TABLES `project_settings` WRITE;
/*!40000 ALTER TABLE `project_settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `project_settings` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `sprint`
--

LOCK TABLES `sprint` WRITE;
/*!40000 ALTER TABLE `sprint` DISABLE KEYS */;
/*!40000 ALTER TABLE `sprint` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
INSERT INTO `student` VALUES (1,'ACTIVE','Front-end','LAMIA','ABDENNEBI','2025-05-24 12:02:03',2023,'1st superior class',7,'Informations Systems and Internet',1),(2,'ACTIVE','Front-end','ZINEDDINE','ABDERRAHIM','2025-05-24 12:02:03',2023,'1st superior class',4,'Informations Systems and Internet',2),(3,'ACTIVE','Front-end','AIMEN','ABDESSELAM','2025-05-24 12:02:03',2023,'1st superior class',6,'Informations Systems and Internet',3),(4,'ACTIVE','Front-end','YOUCEF','ISLEM ACHOURI','2025-05-24 12:02:03',2023,'1st superior class',7,'Informations Systems and Internet',4),(5,'ACTIVE','Front-end','NOUR','EL HOUDA ADJENEG','2025-05-24 12:02:03',2023,'1st superior class',4,'Informations Systems and Internet',5),(6,'ACTIVE','Front-end','MOHAMED','HOUSSAM AHMED','2025-05-24 12:02:03',2023,'1st superior class',3,'Informations Systems and Internet',6),(7,'ACTIVE','Front-end','RIHAM','AIMER','2025-05-24 12:02:03',2023,'1st superior class',2,'Informations Systems and Internet',7),(8,'ACTIVE','Front-end','INES','AINI','2025-05-24 12:02:03',2023,'1st superior class',8,'Informations Systems and Internet',8),(9,'ACTIVE','Front-end','AKRAM','MEHDI AMAMRA','2025-05-24 12:02:03',2023,'1st superior class',3,'Informations Systems and Internet',9),(10,'ACTIVE','Front-end','SOUMIA','AMARI','2025-05-24 12:02:04',2023,'1st superior class',1,'Informations Systems and Internet',10),(11,'ACTIVE','Front-end','DOUNIA','BOUCHRA AMAROUCHE','2025-05-24 12:02:04',2023,'1st superior class',4,'Informations Systems and Internet',11),(12,'ACTIVE','Front-end','MOHAMMED','MENOUER AMEUR','2025-05-24 12:02:04',2023,'1st superior class',5,'Informations Systems and Internet',12),(13,'ACTIVE','Front-end','Maissara','AMMI','2025-05-24 12:02:04',2023,'1st superior class',8,'Informations Systems and Internet',13),(14,'ACTIVE','Front-end','WALID','NEDJMEDDINE AYACHE','2025-05-24 12:02:04',2023,'1st superior class',6,'Informations Systems and Internet',14),(15,'ACTIVE','Front-end','MOUHAMED','AYOUB AZIBA','2025-05-24 12:02:04',2023,'1st superior class',4,'Informations Systems and Internet',15),(16,'ACTIVE','Front-end','MOUSSA','BALLOU','2025-05-24 12:02:04',2023,'1st superior class',4,'Informations Systems and Internet',16),(17,'ACTIVE','Front-end','YASSER','ABDELOUAHED BECHIRI','2025-05-24 12:02:04',2023,'1st superior class',3,'Informations Systems and Internet',17),(18,'ACTIVE','Front-end','EL','BARAA BELAID','2025-05-24 12:02:04',2023,'1st superior class',6,'Informations Systems and Internet',18),(19,'ACTIVE','Front-end','KHADHRA','BELHOUARI','2025-05-24 12:02:04',2023,'1st superior class',5,'Informations Systems and Internet',19),(20,'ACTIVE','Front-end','ABDERRAHMANE','YASSINE HAMZA BELKAID','2025-05-24 12:02:04',2023,'1st superior class',3,'Informations Systems and Internet',20),(21,'ACTIVE','Front-end','Soundes','BELKHARCHOUCHE','2025-05-24 12:02:04',2023,'1st superior class',7,'Informations Systems and Internet',21),(22,'ACTIVE','Front-end','ROUMAISSA','BELLAHOUEL','2025-05-24 12:02:04',2023,'1st superior class',6,'Informations Systems and Internet',22),(23,'ACTIVE','Front-end','ANTRI','WALID BELLAL','2025-05-24 12:02:04',2023,'1st superior class',6,'Informations Systems and Internet',23),(24,'ACTIVE','Front-end','SOUHAIB','BELMAKSENE','2025-05-24 12:02:04',2023,'1st superior class',2,'Informations Systems and Internet',24),(25,'ACTIVE','Front-end','MOHAMED','SEDDIK BEN BAIT','2025-05-24 12:02:04',2023,'1st superior class',4,'Informations Systems and Internet',25),(26,'ACTIVE','Front-end','AMIR','BEN SLAIMI','2025-05-24 12:02:04',2023,'1st superior class',1,'Informations Systems and Internet',26),(27,'ACTIVE','Front-end','ABDEL-OUAKIL','BEN TERKI','2025-05-24 12:02:04',2023,'1st superior class',5,'Informations Systems and Internet',27),(28,'ACTIVE','Front-end','ILYES','BENABBOU','2025-05-24 12:02:04',2023,'1st superior class',3,'Informations Systems and Internet',28),(29,'ACTIVE','Front-end','MOHAMMED','ZAKARIA BENAISSA','2025-05-24 12:02:04',2023,'1st superior class',5,'Informations Systems and Internet',29),(30,'ACTIVE','Front-end','MOHAMMED','AMDJED BENAYAD','2025-05-24 12:02:04',2023,'1st superior class',8,'Informations Systems and Internet',30),(31,'ACTIVE','Front-end','MOHAMMED','ADEM BADREDDINE BENBLAL','2025-05-24 12:02:04',2023,'1st superior class',5,'Informations Systems and Internet',31),(32,'ACTIVE','Front-end','HAMZA','BENCHEHIDA','2025-05-24 12:02:04',2023,'1st superior class',1,'Informations Systems and Internet',32),(33,'ACTIVE','Front-end','OUALID','MOUATEZ BENCHEIKH LEHOCINE','2025-05-24 12:02:04',2023,'1st superior class',2,'Informations Systems and Internet',33),(34,'ACTIVE','Front-end','ABDERRAHMANE','BENDAIA','2025-05-24 12:02:04',2023,'1st superior class',8,'Informations Systems and Internet',34),(35,'ACTIVE','Front-end','MOHAMED','AMINE BENGHERABI','2025-05-24 12:02:04',2023,'1st superior class',2,'Informations Systems and Internet',35),(36,'ACTIVE','Front-end','LOKMANE','BENHAMMADI','2025-05-24 12:02:04',2023,'1st superior class',1,'Informations Systems and Internet',36),(37,'ACTIVE','Front-end','FODHIL','BENHIBA','2025-05-24 12:02:04',2023,'1st superior class',3,'Informations Systems and Internet',37),(38,'ACTIVE','Front-end','Houssam','eddine BENIKHLEF','2025-05-24 12:02:04',2023,'1st superior class',4,'Informations Systems and Internet',38),(39,'ACTIVE','Front-end','CHAMSEDDINE','BENMERIOUMA','2025-05-24 12:02:04',2023,'1st superior class',1,'Informations Systems and Internet',39),(40,'ACTIVE','Front-end','LILYA','BENSAHA','2025-05-24 12:02:04',2023,'1st superior class',6,'Informations Systems and Internet',40),(41,'ACTIVE','Front-end','MERWANE','BENSALAH','2025-05-24 12:02:04',2023,'1st superior class',2,'Informations Systems and Internet',41),(42,'ACTIVE','Front-end','SOUFIANE','BENSETALLAH','2025-05-24 12:02:04',2023,'1st superior class',2,'Informations Systems and Internet',42),(43,'ACTIVE','Front-end','MOHAMMED','ISLAM BENYAHKEM','2025-05-24 12:02:04',2023,'1st superior class',1,'Informations Systems and Internet',43),(44,'ACTIVE','Front-end','MERIEM','BERRAHOU','2025-05-24 12:02:04',2023,'1st superior class',8,'Informations Systems and Internet',44),(45,'ACTIVE','Front-end','Chahrazed','Amina BEZZOUDJI','2025-05-24 12:02:04',2023,'1st superior class',3,'Informations Systems and Internet',45),(46,'ACTIVE','Front-end','HAITEM','BLIZAK','2025-05-24 12:02:04',2023,'1st superior class',7,'Informations Systems and Internet',46),(47,'ACTIVE','Front-end','AHMED','BOUACHERI','2025-05-24 12:02:04',2023,'1st superior class',1,'Informations Systems and Internet',47),(48,'ACTIVE','Front-end','HOUDAIFA','BOUAMINE','2025-05-24 12:02:04',2023,'1st superior class',3,'Informations Systems and Internet',48),(49,'ACTIVE','Front-end','MOHAMED','DHIA EDDINE BOUAOUADJA','2025-05-24 12:02:04',2023,'1st superior class',7,'Informations Systems and Internet',49),(50,'ACTIVE','Front-end','MOUHAMED','BOUCHEMELLA','2025-05-24 12:02:04',2023,'1st superior class',1,'Informations Systems and Internet',50),(51,'ACTIVE','Front-end','DHIKRA','BOUDELIA','2025-05-24 12:02:04',2023,'1st superior class',5,'Informations Systems and Internet',51),(52,'ACTIVE','Front-end','AHMED','BOUDJEDIENE','2025-05-24 12:02:04',2023,'1st superior class',1,'Informations Systems and Internet',52),(53,'ACTIVE','Front-end','ABDESSAMED','BOUDJRIS','2025-05-24 12:02:04',2023,'1st superior class',2,'Informations Systems and Internet',53),(54,'ACTIVE','Front-end','DJAWAD','SOUFYANE BOUFELGHED','2025-05-24 12:02:05',2023,'1st superior class',4,'Informations Systems and Internet',54),(55,'ACTIVE','Front-end','AHMED','YASSINE BOUGUESSA','2025-05-24 12:02:05',2023,'1st superior class',2,'Informations Systems and Internet',55),(56,'ACTIVE','Front-end','ESMA','BOUHOUCHE','2025-05-24 12:02:05',2023,'1st superior class',2,'Informations Systems and Internet',56),(57,'ACTIVE','Front-end','YOUSRA','BOUHRIZ DAIDJ','2025-05-24 12:02:05',2023,'1st superior class',1,'Informations Systems and Internet',57),(58,'ACTIVE','Front-end','ISHAQ','BOUKADEH','2025-05-24 12:02:05',2023,'1st superior class',7,'Informations Systems and Internet',58),(59,'ACTIVE','Front-end','Mohammed','BOUKHATEB','2025-05-24 12:02:05',2023,'1st superior class',4,'Informations Systems and Internet',59),(60,'ACTIVE','Front-end','ANIS','BOULFOUL','2025-05-24 12:02:05',2023,'1st superior class',1,'Informations Systems and Internet',60),(61,'ACTIVE','Front-end','NAWAL','BOUNAB','2025-05-24 12:02:05',2023,'1st superior class',1,'Informations Systems and Internet',61),(62,'ACTIVE','Front-end','MOHAMED','ISLEM BOUNOUALA','2025-05-24 12:02:05',2023,'1st superior class',4,'Informations Systems and Internet',62),(63,'ACTIVE','Front-end','ADEL','BOURAS','2025-05-24 12:02:05',2023,'1st superior class',2,'Informations Systems and Internet',63),(64,'ACTIVE','Front-end','ACHRAF','BOUSSAHI','2025-05-24 12:02:05',2023,'1st superior class',3,'Informations Systems and Internet',64),(65,'ACTIVE','Front-end','SARAH','KAOUTHER BRAHMI','2025-05-24 12:02:05',2023,'1st superior class',8,'Informations Systems and Internet',65),(66,'ACTIVE','Front-end','SALIH','CHIALI','2025-05-24 12:02:05',2023,'1st superior class',8,'Informations Systems and Internet',66),(67,'ACTIVE','Front-end','YOUCEF','CHIHAB EDDINE CHIKHAOUI','2025-05-24 12:02:05',2023,'1st superior class',8,'Informations Systems and Internet',67),(68,'ACTIVE','Front-end','RIHANA','ACHOUAKE DAAMACHE','2025-05-24 12:02:05',2023,'1st superior class',6,'Informations Systems and Internet',68),(69,'ACTIVE','Front-end','ABDERRAHMEN','DELLA','2025-05-24 12:02:05',2023,'1st superior class',4,'Informations Systems and Internet',69),(70,'ACTIVE','Front-end','AMRO','ABDELLAH DENNAI','2025-05-24 12:02:05',2023,'1st superior class',2,'Informations Systems and Internet',70),(71,'ACTIVE','Front-end','MUSTAPHA','DERRAH','2025-05-24 12:02:05',2023,'1st superior class',5,'Informations Systems and Internet',71),(72,'ACTIVE','Front-end','DJAMEL','EDDINE DIB','2025-05-24 12:02:05',2023,'1st superior class',7,'Informations Systems and Internet',72),(73,'ACTIVE','Front-end','MEHDI','DIB','2025-05-24 12:02:05',2023,'1st superior class',1,'Informations Systems and Internet',73),(74,'ACTIVE','Front-end','YACINE','DJAARAOUI','2025-05-24 12:02:05',2023,'1st superior class',5,'Informations Systems and Internet',74),(75,'ACTIVE','Front-end','ZAKARIA','DJEBBAR','2025-05-24 12:02:05',2023,'1st superior class',4,'Informations Systems and Internet',75),(76,'ACTIVE','Front-end','Mohamed','amine DJENADI','2025-05-24 12:02:05',2023,'1st superior class',6,'Informations Systems and Internet',76),(77,'ACTIVE','Front-end','REKIA','FADLA','2025-05-24 12:02:05',2023,'1st superior class',4,'Informations Systems and Internet',77),(78,'ACTIVE','Front-end','MOHAMMED','ADEL FARDEHEB','2025-05-24 12:02:05',2023,'1st superior class',7,'Informations Systems and Internet',78),(79,'ACTIVE','Front-end','MOHAMMED','ALI FERAOUN','2025-05-24 12:02:05',2023,'1st superior class',2,'Informations Systems and Internet',79),(80,'ACTIVE','Front-end','AYOUB','FERGAG','2025-05-24 12:02:05',2023,'1st superior class',5,'Informations Systems and Internet',80),(81,'ACTIVE','Front-end','MARWA','FERGANI','2025-05-24 12:02:05',2023,'1st superior class',8,'Informations Systems and Internet',81),(82,'ACTIVE','Front-end','AMINA',' KHADIDJA FEZAZI','2025-05-24 12:02:05',2023,'1st superior class',5,'Informations Systems and Internet',82),(83,'ACTIVE','Front-end','MALEK','GADIRI','2025-05-24 12:02:05',2023,'1st superior class',8,'Informations Systems and Internet',83),(84,'ACTIVE','Front-end','RAYANE','YASSINE GHILANE','2025-05-24 12:02:05',2023,'1st superior class',8,'Informations Systems and Internet',84),(85,'ACTIVE','Front-end','KHOULOUD','GHRIB','2025-05-24 12:02:05',2023,'1st superior class',2,'Informations Systems and Internet',85),(86,'ACTIVE','Front-end','AHMED','YACINE GUERFI','2025-05-24 12:02:05',2023,'1st superior class',3,'Informations Systems and Internet',86),(87,'ACTIVE','Front-end','KHALED','GUESSAOUI','2025-05-24 12:02:05',2023,'1st superior class',6,'Informations Systems and Internet',87),(88,'ACTIVE','Front-end','KHOULOUD','GUESSI','2025-05-24 12:02:05',2023,'1st superior class',5,'Informations Systems and Internet',88),(89,'ACTIVE','Front-end','MOHAMED','NIZAR GUESSOUM','2025-05-24 12:02:05',2023,'1st superior class',7,'Informations Systems and Internet',89),(90,'ACTIVE','Front-end','NASSIM','HADJEBAR','2025-05-24 12:02:05',2023,'1st superior class',8,'Informations Systems and Internet',90),(91,'ACTIVE','Front-end','DIAA','NEJME EDDINE HADROUGA','2025-05-24 12:02:05',2023,'1st superior class',2,'Informations Systems and Internet',91),(92,'ACTIVE','Front-end','NAFISSA','HALLALBI','2025-05-24 12:02:05',2023,'1st superior class',8,'Informations Systems and Internet',92),(93,'ACTIVE','Front-end','Mohammed','HAMMADI','2025-05-24 12:02:05',2023,'1st superior class',3,'Informations Systems and Internet',93),(94,'ACTIVE','Front-end','Manar','HAMMADOUCHE','2025-05-24 12:02:05',2023,'1st superior class',8,'Informations Systems and Internet',94),(95,'ACTIVE','Front-end','Mohamed','HAOUARI','2025-05-24 12:02:05',2023,'1st superior class',1,'Informations Systems and Internet',95),(96,'ACTIVE','Front-end','SARA','HOUARI','2025-05-24 12:02:05',2023,'1st superior class',4,'Informations Systems and Internet',96),(97,'ACTIVE','Front-end','MOHAMMED','KATIB KACHI','2025-05-24 12:02:06',2023,'1st superior class',3,'Informations Systems and Internet',97),(98,'ACTIVE','Front-end','AKRAM','KAID','2025-05-24 12:02:06',2023,'1st superior class',4,'Informations Systems and Internet',98),(99,'ACTIVE','Front-end','Nouha','KAMBOUZ','2025-05-24 12:02:06',2023,'1st superior class',2,'Informations Systems and Internet',99),(100,'ACTIVE','Front-end','AHMED','KAOUADJI','2025-05-24 12:02:06',2023,'1st superior class',6,'Informations Systems and Internet',100),(101,'ACTIVE','Front-end','ABDERRAHMANE','KENNOUCHE','2025-05-24 12:02:06',2023,'1st superior class',1,'Informations Systems and Internet',101),(102,'ACTIVE','Front-end','ANISS','KETTROUSSI','2025-05-24 12:02:06',2023,'1st superior class',3,'Informations Systems and Internet',102),(103,'ACTIVE','Front-end','Mouad','KHALED','2025-05-24 12:02:06',2023,'1st superior class',5,'Informations Systems and Internet',103),(104,'ACTIVE','Front-end','ABDELKARIM','KHALFAOUI','2025-05-24 12:02:06',2023,'1st superior class',1,'Informations Systems and Internet',104),(105,'ACTIVE','Front-end','YOUCEF','KHEDIM','2025-05-24 12:02:06',2023,'1st superior class',7,'Informations Systems and Internet',105),(106,'ACTIVE','Front-end','ALAA','KHELLADI','2025-05-24 12:02:06',2023,'1st superior class',8,'Informations Systems and Internet',106),(107,'ACTIVE','Front-end','Sara','nadjet KHITER','2025-05-24 12:02:06',2023,'1st superior class',6,'Informations Systems and Internet',107),(108,'ACTIVE','Front-end','ABDERRAHMANE','KHOUDOUR','2025-05-24 12:02:06',2023,'1st superior class',3,'Informations Systems and Internet',108),(109,'ACTIVE','Front-end','AMIRA','LAICHAOUI','2025-05-24 12:02:06',2023,'1st superior class',3,'Informations Systems and Internet',109),(110,'ACTIVE','Front-end','MOHAMED','AYMENE LAIDANI','2025-05-24 12:02:06',2023,'1st superior class',7,'Informations Systems and Internet',110),(111,'ACTIVE','Front-end','ANIS','CHARAF EDDINE LAKHDARI','2025-05-24 12:02:06',2023,'1st superior class',8,'Informations Systems and Internet',111),(112,'ACTIVE','Front-end','ABDELKADER','AMINE LAZEREG CHALABI','2025-05-24 12:02:06',2023,'1st superior class',1,'Informations Systems and Internet',112),(113,'ACTIVE','Front-end','ZAKARIA','LOURGHI','2025-05-24 12:02:06',2023,'1st superior class',5,'Informations Systems and Internet',113),(114,'ACTIVE','Front-end','MOHAMMED','ELHASSEN MAAZI','2025-05-24 12:02:06',2023,'1st superior class',6,'Informations Systems and Internet',114),(115,'ACTIVE','Front-end','MERIEM','MADENE','2025-05-24 12:02:06',2023,'1st superior class',2,'Informations Systems and Internet',115),(116,'ACTIVE','Front-end','DADNA','FATMA ZAHRAA MADHOUI','2025-05-24 12:02:06',2023,'1st superior class',2,'Informations Systems and Internet',116),(117,'ACTIVE','Front-end','BILAL','MAMOUN','2025-05-24 12:02:06',2023,'1st superior class',3,'Informations Systems and Internet',117),(118,'ACTIVE','Front-end','FATIMA','ZOHRA MANSOURI','2025-05-24 12:02:06',2023,'1st superior class',2,'Informations Systems and Internet',118),(119,'ACTIVE','Front-end','MOHAMED','NASSIM MANSOURI','2025-05-24 12:02:06',2023,'1st superior class',5,'Informations Systems and Internet',119),(120,'ACTIVE','Front-end','ZOHRA','MAROUF','2025-05-24 12:02:06',2023,'1st superior class',3,'Informations Systems and Internet',120),(121,'ACTIVE','Front-end','Abdennour','MATOUK','2025-05-24 12:02:06',2023,'1st superior class',2,'Informations Systems and Internet',121),(122,'ACTIVE','Front-end','AMINE','MAZARI ABDESSAMEUD','2025-05-24 12:02:06',2023,'1st superior class',1,'Informations Systems and Internet',122),(123,'ACTIVE','Front-end','FERIEL','MECHAIA','2025-05-24 12:02:06',2023,'1st superior class',5,'Informations Systems and Internet',123),(124,'ACTIVE','Front-end','SOUNDOUSS','LEILA SAADIA MEDDAH','2025-05-24 12:02:06',2023,'1st superior class',5,'Informations Systems and Internet',124),(125,'ACTIVE','Front-end','MOHAMMED','SAFOUANE MEDJAHRI','2025-05-24 12:02:06',2023,'1st superior class',6,'Informations Systems and Internet',125),(126,'ACTIVE','Front-end','YACINE','MEGHAR','2025-05-24 12:02:06',2023,'1st superior class',7,'Informations Systems and Internet',126),(127,'ACTIVE','Front-end','NESRINE','MEHDA','2025-05-24 12:02:06',2023,'1st superior class',7,'Informations Systems and Internet',127),(128,'ACTIVE','Front-end','MOHAMED','AMDJAD MEHDI','2025-05-24 12:02:06',2023,'1st superior class',7,'Informations Systems and Internet',128),(129,'ACTIVE','Front-end','Imane','MEKSALI','2025-05-24 12:02:06',2023,'1st superior class',7,'Informations Systems and Internet',129),(130,'ACTIVE','Front-end','TAREK','MELIANI','2025-05-24 12:02:06',2023,'1st superior class',1,'Informations Systems and Internet',130),(131,'ACTIVE','Front-end','ANESS','ABDELRAHIM MELLEL','2025-05-24 12:02:06',2023,'1st superior class',3,'Informations Systems and Internet',131),(132,'ACTIVE','Front-end','NABAHAT','IMANE MERZOUK','2025-05-24 12:02:06',2023,'1st superior class',8,'Informations Systems and Internet',132),(133,'ACTIVE','Front-end','RIHAM','MESSAOUDI','2025-05-24 12:02:06',2023,'1st superior class',2,'Informations Systems and Internet',133),(134,'ACTIVE','Front-end','SEYF','EDDINE MAROUANE METIDJI','2025-05-24 12:02:06',2023,'1st superior class',1,'Informations Systems and Internet',134),(135,'ACTIVE','Front-end','BADIS','MOHAMMED ALI MIHI','2025-05-24 12:02:06',2023,'1st superior class',1,'Informations Systems and Internet',135),(136,'ACTIVE','Front-end','AHMED','ABOUBAKEUR ESSEDDIK MILOUDI','2025-05-24 12:02:06',2023,'1st superior class',3,'Informations Systems and Internet',136),(137,'ACTIVE','Front-end','AHLEM','MOHAMMED OUSAID','2025-05-24 12:02:06',2023,'1st superior class',7,'Informations Systems and Internet',137),(138,'ACTIVE','Front-end','ANAS','NEDJMEDDINE MOKHTARI','2025-05-24 12:02:06',2023,'1st superior class',8,'Informations Systems and Internet',138),(139,'ACTIVE','Front-end','MANEL','MOSTEFAOUI','2025-05-24 12:02:06',2023,'1st superior class',6,'Informations Systems and Internet',139),(140,'ACTIVE','Front-end','ZAKARIA','RACHID NESSAL','2025-05-24 12:02:06',2023,'1st superior class',1,'Informations Systems and Internet',140),(141,'ACTIVE','Front-end','MOHAMMED','ELHAFNAOUI NOUAR','2025-05-24 12:02:06',2023,'1st superior class',4,'Informations Systems and Internet',141),(142,'ACTIVE','Front-end','Mohamed','fouad RABAHI','2025-05-24 12:02:07',2023,'1st superior class',8,'Informations Systems and Internet',142),(143,'ACTIVE','Front-end','MUSTAPHA','BAHA EDDINE RAHAL','2025-05-24 12:02:07',2023,'1st superior class',2,'Informations Systems and Internet',143),(144,'ACTIVE','Front-end','Akram','RAHALI','2025-05-24 12:02:07',2023,'1st superior class',4,'Informations Systems and Internet',144),(145,'ACTIVE','Front-end','Narjes','RAHO','2025-05-24 12:02:07',2023,'1st superior class',5,'Informations Systems and Internet',145),(146,'ACTIVE','Front-end','AHMED','ABDELAAZIZ RECHIDI','2025-05-24 12:02:07',2023,'1st superior class',6,'Informations Systems and Internet',146),(147,'ACTIVE','Front-end','AYA','SIRINE REFSI','2025-05-24 12:02:07',2023,'1st superior class',7,'Informations Systems and Internet',147),(148,'ACTIVE','Front-end','LABIBA','REGAB','2025-05-24 12:02:07',2023,'1st superior class',1,'Informations Systems and Internet',148),(149,'ACTIVE','Front-end','MOHAMED','RIAD','2025-05-24 12:02:07',2023,'1st superior class',6,'Informations Systems and Internet',149),(150,'ACTIVE','Front-end','MALAK','SAADI','2025-05-24 12:02:07',2023,'1st superior class',8,'Informations Systems and Internet',150),(151,'ACTIVE','Front-end','MOHAMED','EL AMINE SAIDANE','2025-05-24 12:02:07',2023,'1st superior class',1,'Informations Systems and Internet',151),(152,'ACTIVE','Front-end','Wassim','djillali SEBAA','2025-05-24 12:02:07',2023,'1st superior class',1,'Informations Systems and Internet',152),(153,'ACTIVE','Front-end','ABDELMONCEF','SELLOUM','2025-05-24 12:02:07',2023,'1st superior class',6,'Informations Systems and Internet',153),(154,'ACTIVE','Front-end','ABDELDJALIL','SENOUCI','2025-05-24 12:02:07',2023,'1st superior class',5,'Informations Systems and Internet',154),(155,'ACTIVE','Front-end','SARA','HAFIDA SID LAKHDAR','2025-05-24 12:02:07',2023,'1st superior class',6,'Informations Systems and Internet',155),(156,'ACTIVE','Front-end','Soundous','erraihene SIDHOUM','2025-05-24 12:02:07',2023,'1st superior class',5,'Informations Systems and Internet',156),(157,'ACTIVE','Front-end','FARES','SLIMANI','2025-05-24 12:02:07',2023,'1st superior class',1,'Informations Systems and Internet',157),(158,'ACTIVE','Front-end','RANIA','SLIMANI','2025-05-24 12:02:07',2023,'1st superior class',6,'Informations Systems and Internet',158),(159,'ACTIVE','Front-end','INAS','SOUMMAR','2025-05-24 12:02:07',2023,'1st superior class',8,'Informations Systems and Internet',159),(160,'ACTIVE','Front-end','HOUARI','IMAD TABAI','2025-05-24 12:02:07',2023,'1st superior class',7,'Informations Systems and Internet',160),(161,'ACTIVE','Front-end','ABD','ERRAHIM TAFAT','2025-05-24 12:02:07',2023,'1st superior class',6,'Informations Systems and Internet',161),(162,'ACTIVE','Front-end','ZINE','EDDINE TAHRI','2025-05-24 12:02:07',2023,'1st superior class',3,'Informations Systems and Internet',162),(163,'ACTIVE','Front-end','ABDERRAHMEN','TALBI','2025-05-24 12:02:07',2023,'1st superior class',8,'Informations Systems and Internet',163),(164,'ACTIVE','Front-end','MOHAMED','NADJIB TALEB','2025-05-24 12:02:07',2023,'1st superior class',6,'Informations Systems and Internet',164),(165,'ACTIVE','Front-end','HATEM','TALEB','2025-05-24 12:02:07',2023,'1st superior class',8,'Informations Systems and Internet',165),(166,'ACTIVE','Front-end','YASSER','TIOURSI','2025-05-24 12:02:07',2023,'1st superior class',5,'Informations Systems and Internet',166),(167,'ACTIVE','Front-end','MOHAMMED','SEGHIR TOUATI TLIBA','2025-05-24 12:02:07',2023,'1st superior class',4,'Informations Systems and Internet',167),(168,'ACTIVE','Front-end','ABDALLAH','YETTOU','2025-05-24 12:02:07',2023,'1st superior class',8,'Informations Systems and Internet',168),(169,'ACTIVE','Front-end','NAOAUFIL','YOUSFI','2025-05-24 12:02:07',2023,'1st superior class',1,'Informations Systems and Internet',169),(170,'ACTIVE','Front-end','MOHAEMD','RAYAN ZAARIR','2025-05-24 12:02:07',2023,'1st superior class',6,'Informations Systems and Internet',170),(171,'ACTIVE','Front-end','ABDELDJALLIL','ZENNIR','2025-05-24 12:02:07',2023,'1st superior class',2,'Informations Systems and Internet',171),(172,'ACTIVE','Front-end','KHAYRA','SARRA ZERGUERRAS','2025-05-24 12:02:07',2023,'1st superior class',6,'Informations Systems and Internet',172),(173,'ACTIVE','Front-end','Amdjed','ZERROUGUI','2025-05-24 12:02:07',2023,'1st superior class',1,'Informations Systems and Internet',173),(174,'ACTIVE','Front-end','ILYES','ZIANI','2025-05-24 12:02:07',2023,'1st superior class',7,'Informations Systems and Internet',174),(175,'ACTIVE','Front-end','Ahmed','ZITOUNI','2025-05-24 12:02:07',2023,'1st superior class',5,'Informations Systems and Internet',175),(176,'ACTIVE','Front-end','HIBA','ZOUBIR','2025-05-24 12:02:07',2023,'1st superior class',5,'Informations Systems and Internet',176);
/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supervise_team_request`
--

DROP TABLE IF EXISTS `supervise_team_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supervise_team_request` (
  `id` int NOT NULL AUTO_INCREMENT,
  `direction` enum('TEAM_TO_SUPERVISOR','SUPERVISOR_TO_TEAM') NOT NULL,
  `status` enum('pending','accepted','rejected','validated_by_proposer') NOT NULL DEFAULT 'pending',
  `decidedBy` varchar(255) DEFAULT NULL,
  `decidedAt` datetime DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `teamId` int NOT NULL,
  `supervisorId` int NOT NULL,
  `projectId` int NOT NULL,
  `projectProposerId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_978c25a0d1268732fbbd0d47ac` (`teamId`,`supervisorId`,`projectId`,`status`),
  KEY `IDX_6133508bfcf7d4b0ba4610435e` (`status`),
  KEY `FK_d9488dd41fa749595e1f4d92847` (`supervisorId`),
  KEY `FK_81584ebbb32637ce49e38befd35` (`projectId`),
  KEY `FK_b5b403e7962aa6d1d76685fb1ce` (`projectProposerId`),
  CONSTRAINT `FK_5df063532cf569d69b949be4dd6` FOREIGN KEY (`teamId`) REFERENCES `team` (`id`),
  CONSTRAINT `FK_81584ebbb32637ce49e38befd35` FOREIGN KEY (`projectId`) REFERENCES `project` (`id`),
  CONSTRAINT `FK_b5b403e7962aa6d1d76685fb1ce` FOREIGN KEY (`projectProposerId`) REFERENCES `teacher` (`id`),
  CONSTRAINT `FK_d9488dd41fa749595e1f4d92847` FOREIGN KEY (`supervisorId`) REFERENCES `teacher` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supervise_team_request`
--

LOCK TABLES `supervise_team_request` WRITE;
/*!40000 ALTER TABLE `supervise_team_request` DISABLE KEYS */;
INSERT INTO `supervise_team_request` VALUES (1,'TEAM_TO_SUPERVISOR','validated_by_proposer','string','2025-05-24 22:12:06','2025-05-24 21:25:27.898000','2025-05-24 22:12:06.024000',1,2,1,1);
/*!40000 ALTER TABLE `supervise_team_request` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `supervisor_invite`
--

LOCK TABLES `supervisor_invite` WRITE;
/*!40000 ALTER TABLE `supervisor_invite` DISABLE KEYS */;
INSERT INTO `supervisor_invite` VALUES (1,'proposer','2025-05-24 16:24:56','accepted',2,1);
/*!40000 ALTER TABLE `supervisor_invite` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `task`
--

LOCK TABLES `task` WRITE;
/*!40000 ALTER TABLE `task` DISABLE KEYS */;
/*!40000 ALTER TABLE `task` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `task_assigned_to_student`
--

LOCK TABLES `task_assigned_to_student` WRITE;
/*!40000 ALTER TABLE `task_assigned_to_student` DISABLE KEYS */;
/*!40000 ALTER TABLE `task_assigned_to_student` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `teacher`
--

LOCK TABLES `teacher` WRITE;
/*!40000 ALTER TABLE `teacher` DISABLE KEYS */;
INSERT INTO `teacher` VALUES (1,'Systems','Brandyn','Cassin','1962-04-23 14:08:17','Assistant','INSTRUCTOR',177),(2,'Systems','Elsie','Quigley','1960-10-14 06:15:14','Professor','LECTURER',178),(3,'Analyse','Weldon','Rau','2007-04-02 16:20:11','Associate','LECTURER',179),(4,'Analyse','Tracy','Krajcik','1991-08-18 00:36:19','Assistant','LECTURER',180),(5,'Architecture','Casper','Mayert','2003-01-13 01:09:10','Professor','INSTRUCTOR',181);
/*!40000 ALTER TABLE `teacher` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `teacher_supervised_projects_project`
--

LOCK TABLES `teacher_supervised_projects_project` WRITE;
/*!40000 ALTER TABLE `teacher_supervised_projects_project` DISABLE KEYS */;
INSERT INTO `teacher_supervised_projects_project` VALUES (2,1);
/*!40000 ALTER TABLE `teacher_supervised_projects_project` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `team`
--

LOCK TABLES `team` WRITE;
/*!40000 ALTER TABLE `team` DISABLE KEYS */;
INSERT INTO `team` VALUES (1,'Informations Systems and Internet','chillguys',26,1);
/*!40000 ALTER TABLE `team` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `team_invite`
--

LOCK TABLES `team_invite` WRITE;
/*!40000 ALTER TABLE `team_invite` DISABLE KEYS */;
/*!40000 ALTER TABLE `team_invite` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `team_join_project_request`
--

LOCK TABLES `team_join_project_request` WRITE;
/*!40000 ALTER TABLE `team_join_project_request` DISABLE KEYS */;
INSERT INTO `team_join_project_request` VALUES (1,'accepted','2025-05-24 17:34:02','2025-05-24 19:17:22','student',0,1,1);
/*!40000 ALTER TABLE `team_join_project_request` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `team_join_request`
--

LOCK TABLES `team_join_request` WRITE;
/*!40000 ALTER TABLE `team_join_request` DISABLE KEYS */;
/*!40000 ALTER TABLE `team_join_request` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `team_membership`
--

LOCK TABLES `team_membership` WRITE;
/*!40000 ALTER TABLE `team_membership` DISABLE KEYS */;
INSERT INTO `team_membership` VALUES (1,'2025-05-24 17:16:09.458000',1,26);
/*!40000 ALTER TABLE `team_membership` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin@gmail.com','admin','$2b$08$oRV2LQ124BXU9Jx0xfvWDuDCeEsQg7mjEFHC7N0wMW4gfZ08F1n/C'),(2,'z.abderrahim@esi-sba.dz','student','$2b$08$E3Qntlg0DIpzVFooAdb3cu9xkDzzFyjMqCiknVWUPHVfvge/9MORi'),(3,'a.abdesselam@esi-sba.dz','student','$2b$08$zXTkfTVGcOdiDp588Q0DcO4qKxmlmZcwaSz0yKMbotAblPqiV5rma'),(4,'yi.achouri@esi-sba.dz','student','$2b$08$fh3SKa2LaXE8JiPPt3lRuer.PG0OF8BMZyG3Ey4HCjlGyEb/Pv.9S'),(5,'neh.adjeneg@esi-sba.dz','student','$2b$08$gGo4S6PHMuvtJ1noTs.8M./a/EnCuFysq01T9ZbkFDr2Ja5gte6wS'),(6,'mh.ahmed@esi-sba.dz','student','$2b$08$9jvoNngeGADkteP2eUOeTOVsgctO58vrHcTg2L3xjgdqJXZplauwS'),(7,'r.aimer@esi-sba.dz','student','$2b$08$vret/FSqQPXJ1zJoZK4.dOSGdKR67hY33l/0U4dRH3Fs7m2NN25Da'),(8,'i.aini@esi-sba.dz','student','$2b$08$SdTlLLBalZk2Gxtg3WVoZekZi2eHk.goe.z9Iy5gQsmxUEKRibWf2'),(9,'am.amamra@esi-sba.dz','student','$2b$08$Tshny.pFq4Imf/wgIpOGrudalgISMgKNgoDTup7okLeOozILd800e'),(10,'s.amari@esi-sba.dz','student','$2b$08$Er14/d3cnKLKBPSffXFCpuCK.N9fN524OLyW.TwRo5j4Ddz6fhsFe'),(11,'db.amarouche@esi-sba.dz','student','$2b$08$YUaWbSBfgeZ7ANeu2s.eF.ObKo7lJhIb8Fun/x/W4ddu1ALy/5l7a'),(12,'mm.ameur@esi-sba.dz','student','$2b$08$Yn9muK84Htq1TkHa9oA0f.aMho.ixku1VRCFnE7ym.F.3vMdgOZx6'),(13,'m.ammi@esi-sba.dz','student','$2b$08$owMM11CKVZoZWX7GYlMaFOyqxCLE5cPByypZB1FZDVPQI/41Tfdze'),(14,'wn.ayache@esi-sba.dz','student','$2b$08$2iHDufVI4YBRkgE4L/5yIeruD2BbULZmVcUDtAmh0JH85dG4nrDje'),(15,'ma.aziba@esi-sba.dz','student','$2b$08$Y8zTe.8crS9zV4S7wd6NfOW1FDXRoA6st/NWqZcFYiOIpVxfumQZK'),(16,'m.ballou@esi-sba.dz','student','$2b$08$mEsL00z5QqMYnpLr9VJKvueV6bnr7tmqkyQ0r3YyqZusbf2ho2AeG'),(17,'ya.bechiri@esi-sba.dz','student','$2b$08$FQiBP.D7Fn6PLGHLJHZg4ugxmxJ7LfhXWuBKSTgNLATFZIaonWmTG'),(18,'eb.belaid@esi-sba.dz','student','$2b$08$Qo2FgiaizvHUT2Ke95o83u8kLHAHZqYkGcmK9sV9UWrF6M4KNbJM6'),(19,'k.belhouari@esi-sba.dz','student','$2b$08$jp.Ri3zN4miZl7RYUEUotea2r72qMtNdYDcRy8inWZ0kLI57TmBZi'),(20,'ayh.belkaid@esi-sba.dz','student','$2b$08$T/KsIiM2rm9D0TD5vLXhPeShYJb.ZAITFiRMcKIH1db3lgm3.bmdm'),(21,'s.belkharchouche@esi-sba.dz','student','$2b$08$QWVR9grQH4yJ3ZneFG0tNe6gLAZW7L5ZLsgAvCfvS3kmXwO3lrrEu'),(22,'r.bellahouel@esi-sba.dz','student','$2b$08$FCaFX4tKA0/Rh1GHBaEVkehl7oEyG.yv17uPpmXeIydny9olxpz66'),(23,'aw.bellal@esi-sba.dz','student','$2b$08$6emnkMUdZO2C0/n55hNnrOmiO9DrnuhJt3JVN7sGpXT198jq.zyXu'),(24,'s.belmaksene@esi-sba.dz','student','$2b$08$5U4NvjTxsFwrNKo6v7W9Bu/jU6z80N/MHCV1odI1dooHxFoiNrEpq'),(25,'msb.bait@esi-sba.dz','student','$2b$08$YZx.RDNFJmCCwLnHxZFZRulsOhYzdLSF1oVi9T6Q8CYfvCYt0AWti'),(26,'a.benslaimi@esi-sba.dz','student','$2b$08$/uiANYPf2HKO23bxTmIczeGngQ.ndJuuXBZH6BfSpabYwSgnhVWC.'),(27,'ao.benterki@esi-sba.dz','student','$2b$08$CXgqPlhzr5LE5hfTy/vU6.NixayfJ1aL3K67nn4rGHpqvqXNaCLgO'),(28,'i.benabbou@esi-sba.dz','student','$2b$08$FoUtIrLuL02JG.03l6ICZ.uy8H.T6a9bKA6K8Q6BMNtdJN.4m0VGa'),(29,'mz.benaissa@esi-sba.dz','student','$2b$08$cNBdeNplNazD8bxvNmYQ.e.hIwcd/gyDpPPz5dHc/lhAYMDEPmR7u'),(30,'ma.benayad@esi-sba.dz','student','$2b$08$hxQhB1VO1VW4bGIgXRCNmuyX.O9sVxvJqi4wNvC7Wx9So2KfxDMzm'),(31,'mab.benblal@esi-sba.dz','student','$2b$08$3GYF.Q9SrI78y3hUOU/B5eflMh7.BQgqsXy3m4wvL9WcwlUL4eDzq'),(32,'h.benchehida@esi-sba.dz','student','$2b$08$rXrIAW/QOMpISjFo8.Q/b.KSGAfWIlTda2K9dZPbEG0wjDzgVPqAu'),(33,'omb.lehocine@esi-sba.dz','student','$2b$08$S6nBC2nyk7zAXYz1sggxK.OWsw8gZUZxEYJciE1IOxoHRl4qo4Ym2'),(34,'a.bendaia@esi-sba.dz','student','$2b$08$6PZ8uiiobxZEw2i5OES28ONLKLGzCFJHFvwzs7ad2P9UA1XAiubFi'),(35,'ma.bengherabi@esi-sba.dz','student','$2b$08$vuxwarquIBURCYfOSS/C5u2y/sO3K7eAyXNnTNcLKLO7AplYqExoq'),(36,'l.benhammadi@esi-sba.dz','student','$2b$08$LhZ3pmknm0QBvbfEwy9ro.DkyGRfSGyJUfu6dacmB50ZaMQqWU99C'),(37,'f.benhiba@esi-sba.dz','student','$2b$08$7zdcFSRKLFnJ3FveoOZfDOPKQe5cZl.8atBkR9w95eroI1h321bmi'),(38,'he.benikhlef@esi-sba.dz','student','$2b$08$wt/Els6DI1LSUJYYStsTEePW7FQ8sMkr.xhpjZc7SPXfiO8.HXj2m'),(39,'c.benmeriouma@esi-sba.dz','student','$2b$08$EH7kilWX1H07tD9gf0tJAOo07h3UIpswSViXrFLdV4/cYfE3nSTZC'),(40,'l.bensaha@esi-sba.dz','student','$2b$08$bCcbFL1knyTmQxTdJQ2HoOMhT8Epvy/uNIzaDjEhqfsV9oUGRWfyO'),(41,'m.bensalah@esi-sba.dz','student','$2b$08$aaWh.6Egkw/XQH8fAKrJM.DvQKvNMz/VZ2SHJpp.oJTj2odUgCVPq'),(42,'s.bensetallah@esi-sba.dz','student','$2b$08$0w5xtW7YD/5TC1far7VrueTaGa/eVaH2nPCFqdD1.xv0evmqO37Eu'),(43,'mi.benyahkem@esi-sba.dz','student','$2b$08$9hxKnsqqKIgtiQ2MfizwUuWrcfaoQaaPw/aSmnHOokTFCeUayw4gm'),(44,'m.berrahou@esi-sba.dz','student','$2b$08$s/W5prC/Pd63wc/oSmMLJOB5kgAQ28u0SZdIavmV3KWIUJgNo.k5O'),(45,'ca.bezzoudji@esi-sba.dz','student','$2b$08$8etuYPpG6vApAHkDTmBB1uCZgKDDwGxaWyFQIL6x2t0h6I7GSyHvy'),(46,'h.blizak@esi-sba.dz','student','$2b$08$UO2aLkqG/ortH/rK41VimeS2GpZlNm6ZdG6xBjAYzT6OsqUUvh/tK'),(47,'a.bouacheri@esi-sba.dz','student','$2b$08$eO.BHg7OcQZTWImQtiqxkeAQDSSgq5wiObXIb.fvD7WQzfWEp9xbK'),(48,'h.bouamine@esi-sba.dz','student','$2b$08$D/969YSDLdgpmf9oDUNyJ.IYUy5vR7g.7yFLDg79wMR3FDuQR7ibi'),(49,'mde.bouaouadja@esi-sba.dz','student','$2b$08$iQn.fzKxMdX/GFyzvT1X7emKbNFBKw6STuMg4ugKa3etrQdZlFZbm'),(50,'m.bouchemella@esi-sba.dz','student','$2b$08$2lFSUcpRjfAu345M9U0UVOmZjoYJdRiaxcXShyxN0rKoExrKTX8xi'),(51,'d.boudelia@esi-sba.dz','student','$2b$08$WkqI4gLZKUGmE/l2su3H6e8I28OO1Rmee7zSd6xMPNMyYKXwE7nl2'),(52,'a.boudjediene@esi-sba.dz','student','$2b$08$mcaEUeY3RO9l7ONSyh4dD.IqNNZS6.MepcrWDXvT1YJgPe8PXiJSq'),(53,'a.boudjris@esi-sba.dz','student','$2b$08$qaxO1D7lJZaRiQ0dySwJqOAn7ItIS0D0xgC5e6PGnvJRVoOLQmDIW'),(54,'ds.boufelghed@esi-sba.dz','student','$2b$08$5L.yZCe5zgimSY/s7RacT.sO5z6QnMBUDnrPyjRXngVN03ZjQno.2'),(55,'ay.bouguessa@esi-sba.dz','student','$2b$08$qXJ9/Q1ldy1Sb//RxjTHHedeJTD4XOwYoB8MCEhdfzLnTOJuopvNK'),(56,'e.bouhouche@esi-sba.dz','student','$2b$08$rAgUD3uayv3EyqAF1j0wzOkOF0RAgh2/b9fvBe3nw2PftUNBkGpeK'),(57,'yb.daidj@esi-sba.dz','student','$2b$08$uO8nJ8HViV.G80IhMnKBFeTOJ5gedTEy0qzXbBN7JAOzqFx9TmTPG'),(58,'i.boukadeh@esi-sba.dz','student','$2b$08$WGaYwwUea2cNdHdSwH3asOjLiq4guXzISrT.22NlpTx/NvZPfvdNq'),(59,'m.boukhateb@esi-sba.dz','student','$2b$08$X2oK84PhiWkWqlrwxql4U.I.iyqwu2NEkX2rxH6vfPIrc1Kp4Us7.'),(60,'a.boulfoul@esi-sba.dz','student','$2b$08$z5ECpGlKoO9vvhFb7U/RsuARNAS.IlZ1x80KfvgbKTJkMrgjWl64K'),(61,'n.bounab@esi-sba.dz','student','$2b$08$cHPnVxgk9agBCchGPxMGMuJl/v9PcWwFQpV5zN2E/XBZDXGgW7I5G'),(62,'mi.bounouala@esi-sba.dz','student','$2b$08$PjWABuwemomgko8Gm4LcmeMig.BcbUW1SpRr9ZckpxtTU0K9k/XpC'),(63,'a.bouras@esi-sba.dz','student','$2b$08$ZLpYzz2Wxg23t7NiPbp4q.McVqs4A8hMLRc0cf7l0bW9DYfstXq9K'),(64,'a.boussahi@esi-sba.dz','student','$2b$08$XygTo9DSUi4AxbfgTBGCwu5ZgzOMrdW2l8JOADZSAJlF9xoMNasPC'),(65,'sk.brahmi@esi-sba.dz','student','$2b$08$oFMQCfMX26//giowU9DjeOdjDlKnf8ebfmHBnCdA1unvJrZcnuWN.'),(66,'s.chiali@esi-sba.dz','student','$2b$08$/tRJwZTo8lqcyZmsSat7TeyVgdKzD07rhTP0GpGEfZ1H/Tkd2w0J.'),(67,'yce.chikhaoui@esi-sba.dz','student','$2b$08$EkJ3G22E2NBHyw1Spbkm3OWS8mRgFscwIc.SrM5HCjjKK9yUtGEsK'),(68,'ra.daamache@esi-sba.dz','student','$2b$08$Whi9hn/Hir/sIeim5eKa/eM8KW6tdfwHfGIH5n87dEzbvSLj/kfZi'),(69,'a.della@esi-sba.dz','student','$2b$08$YbKiLWipKmDifXWlqiuEQu/q5IUdO4osehLrfFg6wXHiqBe7I6zJC'),(70,'aa.dennai@esi-sba.dz','student','$2b$08$XqeIKAW2zeWtmkQFNcX1eekwdRaZyLDORd1ltzi48XTveuUN3.4h.'),(71,'m.derrah@esi-sba.dz','student','$2b$08$73qs7TkXSHt2dpbPD7iSXucdXAlSmRCh5t73krv0URadLzGfkPn1i'),(72,'de.dib@esi-sba.dz','student','$2b$08$6YvrfePvWo1ezlQ4HBIqSOzqUwkjVJEkge2MQJekP9lGgS9nGj2CW'),(73,'m.dib@esi-sba.dz','student','$2b$08$II1J8X1Mo7jyTd9NNH7VLu8hQGS.F0Q7sWSfBo2BU97/Vj2jlIuNm'),(74,'y.djaaraoui@esi-sba.dz','student','$2b$08$QdbGoMcE5j5q2KcPK9oEduloi2F729hBQ1ZNA4vATjryTj5NhbgVC'),(75,'z.djebbar@esi-sba.dz','student','$2b$08$sJAxuUIm.vDxmsH3jxB6G.VXzMSw2BE26YR9XVHh9zP.88eZKc2k.'),(76,'ma.djenadi@esi-sba.dz','student','$2b$08$V2LQ4rzBRCgAFZeZMoo.0ubQwA50vjgpAzOwZUN1VSqdZZ1hSauHm'),(77,'r.fadla@esi-sba.dz','student','$2b$08$efOBuEDShPPRJFzHu1PBI.jQiui5IEBZMTuz2JkZgAGaqr4RR/2e2'),(78,'ma.fardeheb@esi-sba.dz','student','$2b$08$Sz5QPwueoMuvlEp2dNe.T.CMEb3RcEyOTtLkNpZvcnHsoGCZCHE0i'),(79,'ma.feraoun@esi-sba.dz','student','$2b$08$4liEj8SbpOgm.9VbACyVF.9hggklbpeWRb0uJ810oG3NvlEt0tOnW'),(80,'a.fergag@esi-sba.dz','student','$2b$08$uFO8eYJ4ovC3HN0q1wNHpO/wcxEr5i1JJDduO8a7bS/GCUaGPWMkW'),(81,'m.fergani@esi-sba.dz','student','$2b$08$pk0o/N1t5vxuk7e0kIRBpe1WGpT2EmLMivgoIFmyhsjBeo5CxthMS'),(82,'ak.fezazi@esi-sba.dz','student','$2b$08$P.NF1FsDKPCPOfXPLSp89uAsLuZ/0zCcPJHMc2/hrQyacwyg2Y7za'),(83,'m.gadiri@esi-sba.dz','student','$2b$08$G7fczZX/a0Mt.yNk5GE1d.g.jeVNoSa/uyKgw3V9jeJtD1/lGNgJi'),(84,'ry.ghilane@esi-sba.dz','student','$2b$08$j/tjWMk5IHytklOb1DfHYef1mVmV6KWASpxOoXKKbynXW0B7of482'),(85,'k.ghrib@esi-sba.dz','student','$2b$08$0E4ilQmU54XvVPN/8cX01.ohOEIGDgz6mH8lMj9NlTaQjim9wsGaO'),(86,'ay.guerfi@esi-sba.dz','student','$2b$08$nMdFmLQmBrbNbeSZ4sk.ru4s0Fs7VBqBYQmXUe0azIeZ/bVNk5YMa'),(87,'k.guessaoui@esi-sba.dz','student','$2b$08$4V94EteeIPlognzDi76Od.HUgqCkujClkD.jH8dxkTftbD5cYDXJ6'),(88,'k.guessi@esi-sba.dz','student','$2b$08$LE/6RtyfLDWO0EB1kIVPgONhFDq/conhhm2aRSNxrEru0zOvp01/G'),(89,'mn.guessoum@esi-sba.dz','student','$2b$08$ETH8tZz2nXJLDAltXcBhC.mYzdPW.1jrFc.S9dRG127dNMLC8WJHa'),(90,'n.hadjebar@esi-sba.dz','student','$2b$08$.Gdj6fphfR4titO/OTfEx.BS5hp1YMfjoEh3.6UOWyqA3g0ru68Py'),(91,'dne.hadrouga@esi-sba.dz','student','$2b$08$pTqPeH6c5N/hyTxKVlc4huCjVbg3tXncSv9ruSlmV5fynukt3lcRC'),(92,'n.hallalbi@esi-sba.dz','student','$2b$08$Sf1m8MVFRo7GMXn4vVW9vOEF/y5wz6avuoP1rrUSo55ybxEJEus.C'),(93,'m.hammadi@esi-sba.dz','student','$2b$08$cpJnRCe/U5umenEFRfirUuir8Jqo2fsQo2B9NaIx3GZdEvnlzv4/O'),(94,'m.hammadouche@esi-sba.dz','student','$2b$08$i9QlKjqDiV.A3C9yYbxNWejMbyE/dt17jtGarhUuVBsP93EvUGwUy'),(95,'m.haouari@esi-sba.dz','student','$2b$08$pV251Y0Q/o2t3/AyqyaFReJiYVzlbY3YQCCRgAAFuM0zIzDHHvabu'),(96,'s.houari@esi-sba.dz','student','$2b$08$zHT6E846.PK2W3tFYOtRkuVb.EU.9N9SEUB3aLIMYRI630sMsUWSa'),(97,'mk.kachi@esi-sba.dz','student','$2b$08$5JBgyvl/EUfw5goEqeYTgu1E49bvls82MmRVSpV0Ahx/GUfxoIwb.'),(98,'a.kaid@esi-sba.dz','student','$2b$08$uWqPldTvFrnL0oc.EJy7/.S3O.vq0V736SdsTjEICXRjS5xDfPUoy'),(99,'n.kambouz@esi-sba.dz','student','$2b$08$yxKNZiAZSqvUMMqFBXyG6OO68sSyREE0ClKpNiyXTtFnYAJJ0vX/u'),(100,'a.kaouadji@esi-sba.dz','student','$2b$08$DPknkxQvaqvFj6GBmxXjj.7LoQc87j12HXkBRxkmD5WiSVzGLLAUy'),(101,'a.kennouche@esi-sba.dz','student','$2b$08$rqKQgdPmnTFh6KdOJqe8tueYMDxQLnyqfbdaAKHcGxqCc0IHbAk.K'),(102,'a.kettroussi@esi-sba.dz','student','$2b$08$HYl4p/TvfXKIO50UcvfUyuS4e9tXB5OTy2cv6iAT7bqQkli/TM0GG'),(103,'m.khaled@esi-sba.dz','student','$2b$08$4Z4N/FKsbo/gEuAhW3Qui.DKpfikGr3BkSs7hD/gZy0aR2kYL/HJW'),(104,'a.khalfaoui@esi-sba.dz','student','$2b$08$8oEwloZIxpi5s6xHEBPvDeYeuggG6rIcAWj9xOzPpKNze2gn.SSqO'),(105,'y.khedim@esi-sba.dz','student','$2b$08$PKZgxCasO10j/NvwBdvvK.N/FelvBuyahfYHxOtgKLO20fh0qpVNS'),(106,'a.khelladi@esi-sba.dz','student','$2b$08$bvwoIpuIKcljXF3L8jCBh.bpTkYcw8Sb.vL9CXffqx4DKAW3mpwjq'),(107,'sn.khiter@esi-sba.dz','student','$2b$08$EycHzs8RFHjnoEGhUqnKk.rVgy3u27WaEF2h9sLhR2eOpsVOFDFVu'),(108,'a.khoudour@esi-sba.dz','student','$2b$08$yLPKnQodNoye6b3.iB/L/OEj5.5v.Pp21vMqXd.3aAny2o3otpGDe'),(109,'a.laichaoui@esi-sba.dz','student','$2b$08$ZBunx0EQbBCmYzZWbeFg..EVjfo941EHXxytYhvQg6I9y0BwnLeim'),(110,'ma.laidani@esi-sba.dz','student','$2b$08$a82lzUonrrg5zDJ3EKQd7e21RtVHRKU3X..1rdRrYyrabRSMMSQ8q'),(111,'ace.lakhdari@esi-sba.dz','student','$2b$08$YeOHZ23TcL3tsMnAubPmEeBkPz7.7Tuc9GDTLZT9RSp1A5aViQQnm'),(112,'aal.chalabi@esi-sba.dz','student','$2b$08$I4WSWto/Vx0yokrQYEiKjumR68A3pVw910XWOxmghWwPQXkqo81wG'),(113,'z.lourghi@esi-sba.dz','student','$2b$08$GdtQH8fmY1xVqH9q8XvX6uxnBL4ij9zVrCaG336xKfs2MloTS0hr.'),(114,'me.maazi@esi-sba.dz','student','$2b$08$9ruR9V9oHhXPr0/zB6eIl./9u530jETr5183VeeJrb7Q.hoRsITk6'),(115,'m.madene@esi-sba.dz','student','$2b$08$OdecDwbjPl1fJGxtzVlHy.KDCXADm.bagrI.EorKKI3VHXCq87rgC'),(116,'dfz.madhoui@esi-sba.dz','student','$2b$08$o2/L3OAQzItnvazxtfAhT.iArQorSgpi2Y.qsbq7eIeo5SjDTNGcS'),(117,'b.mamoun@esi-sba.dz','student','$2b$08$.rJl.723SofBy0tKRDDflO4Q2rEQeHBnpoS27p1xVsJr0YlYjaNhC'),(118,'fz.mansouri@esi-sba.dz','student','$2b$08$a7BhJ1M6hGChv1h.4jMZMOAX3CVUtG7BXXAVE5NQCbNzHsAohCYYy'),(119,'mn.mansouri@esi-sba.dz','student','$2b$08$bhf3pPmUh0TjOBG.nv8xUuuuGndeCI2lLBHn0lhUgzdXWPo2rrE/2'),(120,'z.marouf@esi-sba.dz','student','$2b$08$c7NQ0.thwEqEjaeZ9wlUQ.XJOtKF4BBJqUYT3eA1MQmtDwtb2faBS'),(121,'a.matouk@esi-sba.dz','student','$2b$08$CzHrrE0Xd.iualFRRypTJup8l492oaXrTn0SFOGnijMnTGl0bxasG'),(122,'am.abdessameud@esi-sba.dz','student','$2b$08$0Fw1De/CejL.Glf8B96Lau.qF5uPrsDlhoc842ukaKZbn7pVILN4C'),(123,'f.mechaia@esi-sba.dz','student','$2b$08$sPLY0ZjXZn.PBr6gSZggF.F3Dd.RSw11rJOOrhFqOTJ.pFwAP9jNW'),(124,'sls.meddah@esi-sba.dz','student','$2b$08$6uf38NNXIrj4QXzAyWBkHOPb2vzz1zaAZLJw7PteBtzauqT2dL2qy'),(125,'ms.medjahri@esi-sba.dz','student','$2b$08$ypSFnxx2AIh6HfsgOtXvoOPOW0a/k1uilBuXkFjiXm6/BwKnoWCtO'),(126,'y.meghar@esi-sba.dz','student','$2b$08$vyKo6JKj01YMRDXLmqQ6F.ug/Wm/sHiRteP16cDOwIAXUTZYnAoma'),(127,'n.mehda@esi-sba.dz','student','$2b$08$fQRrlz2iTBAp2maaFj.bROaXRYMIC.5ph/faKCtXS8ZtpVCRw7mw.'),(128,'ma.mehdi@esi-sba.dz','student','$2b$08$dL0xZbrd4rEDEJ27r1UNh.RjLBemIvoOytJ2RaVb09uLnjT2be6P6'),(129,'i.meksali@esi-sba.dz','student','$2b$08$olElMnGssvrZWOE3hwt1jev3erYxDzlJkmOQIhwIBDBHYZ1G.9lM.'),(130,'t.meliani@esi-sba.dz','student','$2b$08$PVqjAkzR5SliofXyOziqXuaQKtRa1q5xj5qZBht7iIidRgnGMgUzy'),(131,'aa.mellel@esi-sba.dz','student','$2b$08$8YXo9ISea47YzEDsMKfh0uAzUUX.ZrtZFGB0xgsTzg.rqsmI569IC'),(132,'ni.merzouk@esi-sba.dz','student','$2b$08$91LMpXGnUH5feB5HSbNpa.NAFRbBKbQ0c4mDGgpXvvA9az3ikY95q'),(133,'r.messaoudi@esi-sba.dz','student','$2b$08$K1WjlWP/cWKcJMGMfjlQC.y//b3DeNoWXhSncxLpjd2FCRalbsJSy'),(134,'sem.metidji@esi-sba.dz','student','$2b$08$Pj7boklSSgQDpH0wEzuaveB9y3DNzIZzbPnxppsgaqTQJxeiArdG6'),(135,'bma.mihi@esi-sba.dz','student','$2b$08$WWuTchhkiExW5.CjyF7TcOIZeDUY5ixU180lNEUlqhtLlAg9jfmye'),(136,'aae.miloudi@esi-sba.dz','student','$2b$08$jgI/FLoA/LhbkXNxpOKjL..mfDR2/Pl2SgWDzZQQC61QWwNkOI6Ou'),(137,'am.ousaid@esi-sba.dz','student','$2b$08$LI.t9hmt7RsOSYinWB4hf.iG.YzApD7wuh3.URsdiIZHW6eL6ThLW'),(138,'an.mokhtari@esi-sba.dz','student','$2b$08$gnyw.SEcGiKBwwFQmKq6ae/IaXwAWUTnkJUzkzUl6zrJxfTK0CTGa'),(139,'m.mostefaoui@esi-sba.dz','student','$2b$08$GtnbFXOpl.4bRu7FfFs0zus35l5hXzZTir6VnyCC5fKhsvx0Ppz8u'),(140,'zr.nessal@esi-sba.dz','student','$2b$08$g5l/xCEEx3XmuE23hx70bej3OZt7RvFfiuAupLUUDW.qzgaQx1tAW'),(141,'me.nouar@esi-sba.dz','student','$2b$08$CDzucIsAmGVWPZoCbpFJfeOiZvYH1PasnHPki726OMwX2K67mjDVS'),(142,'mf.rabahi@esi-sba.dz','student','$2b$08$uqv4MAX13pMkDS0QI05EhurTRQQgUpi7p4byT1lOKhODxGMWQYOcq'),(143,'mbe.rahal@esi-sba.dz','student','$2b$08$CkFuD67HRafvDfbpoGX1q.nu27fK5gYqo8dsdmISBCF5REG8QQ9fa'),(144,'a.rahali@esi-sba.dz','student','$2b$08$.u3EeFwheUDSOaiGc6mrBOCnVZx8rZ38CXXT2veVG493WUd6XFnFa'),(145,'n.raho@esi-sba.dz','student','$2b$08$vrUx6QOHlBKA0cjT7frf.e2xQ0kGqW5ncgQbqj/4UYx7crcTP2dvO'),(146,'aa.rechidi@esi-sba.dz','student','$2b$08$GTonsCwYXTXRNWSkyNo1q.EJPWC4NCd.ueKSWYB6xnwexx7x4a4ii'),(147,'as.refsi@esi-sba.dz','student','$2b$08$S9j260.GuUKXXsMniKqPzuAIqNI4wgmseytm.QWbh7ynchsUZ0TIy'),(148,'l.regab@esi-sba.dz','student','$2b$08$goC43TMjaj6dWx03yyQTu.lksd1MKFrDKpKeu/5Azb3.pSOSJWV2q'),(149,'m.riad@esi-sba.dz','student','$2b$08$0eWDEB5vr5jOEbq045r/h.xgmxdedjH494foGkaRmnoVbITJ0kJ6e'),(150,'m.saadi@esi-sba.dz','student','$2b$08$Z43.5fOyx1Rc5CaO1MRd4Ope42PhopgkppfBXtFZ.1yHWiBybIWx2'),(151,'mea.saidane@esi-sba.dz','student','$2b$08$wv0nIxYte5IR.nfljIKy/.CUx.uhXhKmhPZp8YmffDDTIy18XPwdq'),(152,'wd.sebaa@esi-sba.dz','student','$2b$08$EyhHp3Iecn7iwQuuWwRMQexPIXadGgCm685earRjzujuOBfJMqPRi'),(153,'a.selloum@esi-sba.dz','student','$2b$08$M3dJRbbSokDf7aw3ywBBaeQFRoXmui4yTet4VMQbWrjhgUkueVK8.'),(154,'a.senouci@esi-sba.dz','student','$2b$08$XUZslOX.WPQp0S0Jo2dUQOQSOeHzTSDOfzDEtOhQajPOPbhP7mnH2'),(155,'shs.lakhdar@esi-sba.dz','student','$2b$08$Gc6DdU/Mwt2zBObRFND93uuOMMuWiqtlLppBYt8Y/I4sgdg4i27da'),(156,'se.sidhoum@esi-sba.dz','student','$2b$08$.RhslZ.RAHOySKiNyL2ChO05o.iWXniVmnn8gCJlt5B7Aq8dKvit.'),(157,'f.slimani@esi-sba.dz','student','$2b$08$vVgIDa749kVkNAQTZ0Y8H.FdNPPsIUA4V74cMNKYU2lk6wDKHHDIa'),(158,'r.slimani@esi-sba.dz','student','$2b$08$VLP8uMNfMlyFHiFZ53CQw.MoTWl.yOfoJdeBJgpgmhVz083V3SIj.'),(159,'i.soummar@esi-sba.dz','student','$2b$08$GtCYeHCDxc4QZq/bKD6JduucHyc6U2E3KUcoGxc.jSpQxQCAvkukW'),(160,'hi.tabai@esi-sba.dz','student','$2b$08$CSF7fj.4Vcbfb3Q9wltPSuMRoDrQOAZ0O7/7q48pMq2.jzpWo0Eea'),(161,'ae.tafat@esi-sba.dz','student','$2b$08$DFNMhPt4edqvvKVl1aJhNO1tZzVah5IjZfHPiJrL8jrEX0Sw1fTQW'),(162,'ze.tahri@esi-sba.dz','student','$2b$08$7hi34rAim/WgNU3YnSW.x.7OtOBxLRUVkLZeILmIVV8KVixgp.qq2'),(163,'a.talbi@esi-sba.dz','student','$2b$08$UTVu9vDuS1gpVNXchas2f.CALy2M949kY0i4HQubutXP7P0Bm4wUa'),(164,'mn.taleb@esi-sba.dz','student','$2b$08$aWjPnu47wZUkclU4MEkJuekp7bINz6fN20WzI5gXudPY1Iu4CQ056'),(165,'h.taleb@esi-sba.dz','student','$2b$08$MK8SMd5bSALIQ2ljKLMUqu6gffZKFVPFOYai7EXmeSAGRWK1OEBIi'),(166,'y.tioursi@esi-sba.dz','student','$2b$08$L.8K5HMb6JOsTTN9Bg5JwuMs8SK4n1GRpmhBS2TS7H4zbZAGFON1y'),(167,'mst.tliba@esi-sba.dz','student','$2b$08$6lGHcZGNGpsBjNNxQUgx/.y6ZqSmKkNdoOH3.rn2./JJ0KwHy.Zla'),(168,'a.yettou@esi-sba.dz','student','$2b$08$8Ojye.TFxaaoAQ99nlIgt.Ayo4tp3yhN1z4.ShZ1ddcozub1v45L.'),(169,'n.yousfi@esi-sba.dz','student','$2b$08$MKQH3SDI/o92BAYQozNP1uXb.IciC.qv0DNd8OwmzFM6fTvzkFGWO'),(170,'mr.zaarir@esi-sba.dz','student','$2b$08$9vx5JFDUoYqoGpG2/c65Zuf3qugKEqjBOUOpu2wOOB/mi63hvz.FC'),(171,'a.zennir@esi-sba.dz','student','$2b$08$boT3sxx7LE5aLHlLKqbEv.vZZV5f4WsAfYRtZzaDcfmItAZeXabn2'),(172,'ks.zerguerras@esi-sba.dz','student','$2b$08$Tj3OM6ebznjEI1mxaVpJFeJuwgA9vvaVOvYBBXxBe8hyR7cCrt4Nq'),(173,'a.zerrougui@esi-sba.dz','student','$2b$08$Tt0GVzhvC1yAkx7IAL/nx.9MXJkGmees7UUhGVTECNJsar0wlm0Te'),(174,'i.ziani@esi-sba.dz','student','$2b$08$26qPH76.FZAo.gFlG40tFO5TLrbr0aQQwZBsFYh7ga/pLuwYYJJoS'),(175,'a.zitouni@esi-sba.dz','student','$2b$08$6zC6bHKrIxyI4NvXHuHh6e8bILjzOqI0dTn7b6wnW07HibEM0LnaG'),(176,'h.zoubir@esi-sba.dz','student','$2b$08$KrimSqzz3rSAzkVMV/M9cuPNnlZj8xZVrWD3jdt78za4LDFEJ7KFm'),(177,'Thora.Konopelski@hotmail.com','teacher','$2b$08$XV4BZO.54MlAWbrbqSVBu.pSp8Y9nIdNhCObwSCzOO3RKAY4NJDSa'),(178,'Chance_Mertz@hotmail.com','teacher','$2b$08$avw7.VAqraUXs5un1au0kuZsTgPay/Nfv2jsAZPvqGVPNdhEe2pBe'),(179,'Amani_Krajcik41@gmail.com','teacher','$2b$08$FlMatCDBpTWEzAUFNoTeceSU1XYQDaHQyh8dRxwx9bHZWxV0YISMu'),(180,'Cleveland_Klein75@yahoo.com','teacher','$2b$08$ULLx3ob5D4uz7Xyi1x7Ec.o9n6GPp8LFfFSOP2FV5gRBdDhmzGjNO'),(181,'Anastasia.Daugherty@gmail.com','teacher','$2b$08$c58JeXEmwVsid/kl9afJY.oPf1lY4dRo79Xjqss12Ygbvlt.JQXG6');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `wish_list`
--

LOCK TABLES `wish_list` WRITE;
/*!40000 ALTER TABLE `wish_list` DISABLE KEYS */;
/*!40000 ALTER TABLE `wish_list` ENABLE KEYS */;
UNLOCK TABLES;

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

--
-- Dumping data for table `wish_list_entry`
--

LOCK TABLES `wish_list_entry` WRITE;
/*!40000 ALTER TABLE `wish_list_entry` DISABLE KEYS */;
/*!40000 ALTER TABLE `wish_list_entry` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-26 22:02:07
