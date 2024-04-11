-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: filemanagerdb
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb3_czech_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_czech_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_czech_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb3_czech_ci NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) COLLATE utf8mb3_czech_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=109 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_czech_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add user',4,'add_user'),(14,'Can change user',4,'change_user'),(15,'Can delete user',4,'delete_user'),(16,'Can view user',4,'view_user'),(17,'Can add content type',5,'add_contenttype'),(18,'Can change content type',5,'change_contenttype'),(19,'Can delete content type',5,'delete_contenttype'),(20,'Can view content type',5,'view_contenttype'),(21,'Can add session',6,'add_session'),(22,'Can change session',6,'change_session'),(23,'Can delete session',6,'delete_session'),(24,'Can view session',6,'view_session'),(25,'Can add auth group',7,'add_authgroup'),(26,'Can change auth group',7,'change_authgroup'),(27,'Can delete auth group',7,'delete_authgroup'),(28,'Can view auth group',7,'view_authgroup'),(29,'Can add auth group permissions',8,'add_authgrouppermissions'),(30,'Can change auth group permissions',8,'change_authgrouppermissions'),(31,'Can delete auth group permissions',8,'delete_authgrouppermissions'),(32,'Can view auth group permissions',8,'view_authgrouppermissions'),(33,'Can add auth permission',9,'add_authpermission'),(34,'Can change auth permission',9,'change_authpermission'),(35,'Can delete auth permission',9,'delete_authpermission'),(36,'Can view auth permission',9,'view_authpermission'),(37,'Can add auth user',10,'add_authuser'),(38,'Can change auth user',10,'change_authuser'),(39,'Can delete auth user',10,'delete_authuser'),(40,'Can view auth user',10,'view_authuser'),(41,'Can add auth user groups',11,'add_authusergroups'),(42,'Can change auth user groups',11,'change_authusergroups'),(43,'Can delete auth user groups',11,'delete_authusergroups'),(44,'Can view auth user groups',11,'view_authusergroups'),(45,'Can add auth user user permissions',12,'add_authuseruserpermissions'),(46,'Can change auth user user permissions',12,'change_authuseruserpermissions'),(47,'Can delete auth user user permissions',12,'delete_authuseruserpermissions'),(48,'Can view auth user user permissions',12,'view_authuseruserpermissions'),(49,'Can add django admin log',13,'add_djangoadminlog'),(50,'Can change django admin log',13,'change_djangoadminlog'),(51,'Can delete django admin log',13,'delete_djangoadminlog'),(52,'Can view django admin log',13,'view_djangoadminlog'),(53,'Can add django content type',14,'add_djangocontenttype'),(54,'Can change django content type',14,'change_djangocontenttype'),(55,'Can delete django content type',14,'delete_djangocontenttype'),(56,'Can view django content type',14,'view_djangocontenttype'),(57,'Can add django migrations',15,'add_djangomigrations'),(58,'Can change django migrations',15,'change_djangomigrations'),(59,'Can delete django migrations',15,'delete_djangomigrations'),(60,'Can view django migrations',15,'view_djangomigrations'),(61,'Can add names',16,'add_names'),(62,'Can change names',16,'change_names'),(63,'Can delete names',16,'delete_names'),(64,'Can view names',16,'view_names'),(65,'Can add options',17,'add_options'),(66,'Can change options',17,'change_options'),(67,'Can delete options',17,'delete_options'),(68,'Can view options',17,'view_options'),(69,'Can add projects',18,'add_projects'),(70,'Can change projects',18,'change_projects'),(71,'Can delete projects',18,'delete_projects'),(72,'Can view projects',18,'view_projects'),(73,'Can add roles',19,'add_roles'),(74,'Can change roles',19,'change_roles'),(75,'Can delete roles',19,'delete_roles'),(76,'Can view roles',19,'view_roles'),(77,'Can add standard',20,'add_standard'),(78,'Can change standard',20,'change_standard'),(79,'Can delete standard',20,'delete_standard'),(80,'Can view standard',20,'view_standard'),(81,'Can add standard option mapping',21,'add_standardoptionmapping'),(82,'Can change standard option mapping',21,'change_standardoptionmapping'),(83,'Can delete standard option mapping',21,'delete_standardoptionmapping'),(84,'Can view standard option mapping',21,'view_standardoptionmapping'),(85,'Can add standard project mapping',22,'add_standardprojectmapping'),(86,'Can change standard project mapping',22,'change_standardprojectmapping'),(87,'Can delete standard project mapping',22,'delete_standardprojectmapping'),(88,'Can view standard project mapping',22,'view_standardprojectmapping'),(89,'Can add user project mapping',23,'add_userprojectmapping'),(90,'Can change user project mapping',23,'change_userprojectmapping'),(91,'Can delete user project mapping',23,'delete_userprojectmapping'),(92,'Can view user project mapping',23,'view_userprojectmapping'),(93,'Can add users',24,'add_users'),(94,'Can change users',24,'change_users'),(95,'Can delete users',24,'delete_users'),(96,'Can view users',24,'view_users'),(97,'Can add dictionary',25,'add_dictionary'),(98,'Can change dictionary',25,'change_dictionary'),(99,'Can delete dictionary',25,'delete_dictionary'),(100,'Can view dictionary',25,'view_dictionary'),(101,'Can add option dict mapping',26,'add_optiondictmapping'),(102,'Can change option dict mapping',26,'change_optiondictmapping'),(103,'Can delete option dict mapping',26,'delete_optiondictmapping'),(104,'Can view option dict mapping',26,'view_optiondictmapping'),(105,'Can add standard dict mapping',27,'add_standarddictmapping'),(106,'Can change standard dict mapping',27,'change_standarddictmapping'),(107,'Can delete standard dict mapping',27,'delete_standarddictmapping'),(108,'Can view standard dict mapping',27,'view_standarddictmapping');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user`
--

DROP TABLE IF EXISTS `auth_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(128) COLLATE utf8mb3_czech_ci NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) COLLATE utf8mb3_czech_ci NOT NULL,
  `first_name` varchar(150) COLLATE utf8mb3_czech_ci NOT NULL,
  `last_name` varchar(150) COLLATE utf8mb3_czech_ci NOT NULL,
  `email` varchar(254) COLLATE utf8mb3_czech_ci NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_czech_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user`
--

LOCK TABLES `auth_user` WRITE;
/*!40000 ALTER TABLE `auth_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_groups`
--

DROP TABLE IF EXISTS `auth_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`),
  CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_czech_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_groups`
--

LOCK TABLES `auth_user_groups` WRITE;
/*!40000 ALTER TABLE `auth_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_user_permissions`
--

DROP TABLE IF EXISTS `auth_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_czech_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_user_permissions`
--

LOCK TABLES `auth_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `auth_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dictionary`
--

DROP TABLE IF EXISTS `dictionary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dictionary` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `dictionary_name_fk_idx` (`name_id`),
  CONSTRAINT `dictionary_name_fk` FOREIGN KEY (`name_id`) REFERENCES `names` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_czech_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dictionary`
--

LOCK TABLES `dictionary` WRITE;
/*!40000 ALTER TABLE `dictionary` DISABLE KEYS */;
INSERT INTO `dictionary` VALUES (1,2),(2,3),(3,5),(4,7),(5,9),(6,11),(7,15),(8,18),(9,21),(10,30),(11,31),(12,34),(13,35),(14,38),(15,39),(16,42),(17,43),(18,47),(19,50),(20,53),(21,56),(22,57),(23,60),(24,63),(25,78),(26,80),(27,90),(28,91),(29,92),(30,95),(31,96),(32,97),(33,99),(34,100),(35,101),(36,103),(37,104),(38,106),(39,107),(40,113),(41,114),(42,116),(43,117);
/*!40000 ALTER TABLE `dictionary` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext COLLATE utf8mb3_czech_ci,
  `object_repr` varchar(200) COLLATE utf8mb3_czech_ci NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext COLLATE utf8mb3_czech_ci NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_czech_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) COLLATE utf8mb3_czech_ci NOT NULL,
  `model` varchar(100) COLLATE utf8mb3_czech_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_czech_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(3,'auth','group'),(2,'auth','permission'),(4,'auth','user'),(5,'contenttypes','contenttype'),(7,'namingtool','authgroup'),(8,'namingtool','authgrouppermissions'),(9,'namingtool','authpermission'),(10,'namingtool','authuser'),(11,'namingtool','authusergroups'),(12,'namingtool','authuseruserpermissions'),(25,'namingtool','dictionary'),(13,'namingtool','djangoadminlog'),(14,'namingtool','djangocontenttype'),(15,'namingtool','djangomigrations'),(16,'namingtool','names'),(26,'namingtool','optiondictmapping'),(17,'namingtool','options'),(18,'namingtool','projects'),(19,'namingtool','roles'),(20,'namingtool','standard'),(27,'namingtool','standarddictmapping'),(21,'namingtool','standardoptionmapping'),(22,'namingtool','standardprojectmapping'),(23,'namingtool','userprojectmapping'),(24,'namingtool','users'),(6,'sessions','session');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) COLLATE utf8mb3_czech_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb3_czech_ci NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_czech_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2024-03-22 12:29:38.513454'),(2,'auth','0001_initial','2024-03-22 12:29:39.745512'),(3,'admin','0001_initial','2024-03-22 12:29:40.022446'),(4,'admin','0002_logentry_remove_auto_add','2024-03-22 12:29:40.029961'),(5,'admin','0003_logentry_add_action_flag_choices','2024-03-22 12:29:40.038435'),(6,'contenttypes','0002_remove_content_type_name','2024-03-22 12:29:40.160037'),(7,'auth','0002_alter_permission_name_max_length','2024-03-22 12:29:40.269500'),(8,'auth','0003_alter_user_email_max_length','2024-03-22 12:29:40.374386'),(9,'auth','0004_alter_user_username_opts','2024-03-22 12:29:40.383381'),(10,'auth','0005_alter_user_last_login_null','2024-03-22 12:29:40.479292'),(11,'auth','0006_require_contenttypes_0002','2024-03-22 12:29:40.484293'),(12,'auth','0007_alter_validators_add_error_messages','2024-03-22 12:29:40.492784'),(13,'auth','0008_alter_user_username_max_length','2024-03-22 12:29:40.612518'),(14,'auth','0009_alter_user_last_name_max_length','2024-03-22 12:29:40.722334'),(15,'auth','0010_alter_group_name_max_length','2024-03-22 12:29:40.826375'),(16,'auth','0011_update_proxy_permissions','2024-03-22 12:29:40.836380'),(17,'auth','0012_alter_user_first_name_max_length','2024-03-22 12:29:40.941378'),(18,'namingtool','0001_initial','2024-03-22 12:29:40.985354'),(19,'namingtool','0002_name_role_users','2024-03-22 12:29:41.466364'),(25,'sessions','0001_initial','2024-03-22 12:53:20.030813'),(26,'namingtool','0002_alter_userprojectmapping_options','2024-03-25 15:59:56.810455'),(27,'namingtool','0003_alter_userprojectmapping_options','2024-03-25 16:01:30.069067');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) COLLATE utf8mb3_czech_ci NOT NULL,
  `session_data` longtext COLLATE utf8mb3_czech_ci NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_czech_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `names`
--

DROP TABLE IF EXISTS `names`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `names` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) COLLATE utf8mb3_czech_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `string_UNIQUE` (`name`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=119 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_czech_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `names`
--

LOCK TABLES `names` WRITE;
/*!40000 ALTER TABLE `names` DISABLE KEYS */;
INSERT INTO `names` VALUES (98,'{\'name\': \'test1A\'}'),(99,'{\'name\': \'test1A\'}_dict0'),(100,'{\'name\': \'test1A\'}_dict1'),(101,'{\'name\': \'test1A\'}_dict2'),(58,'1278234'),(61,'1278234sss'),(111,'a'),(51,'asdasd'),(72,'asdasd32342365656'),(70,'asdasdasdasd56'),(54,'asdasdasdasdasd22323'),(79,'created with template'),(80,'created with template_dict0'),(64,'dc ycd6uycdtyujdctyh'),(66,'dc ycd6uycdtyujdctyh 2'),(68,'dc ycd6uycdtyujdctyh 23'),(74,'dsfsdfsdfsdf999'),(76,'dsfsdfsdfsdf9999'),(22,'lol'),(12,'Names object (1)'),(14,'Names object (13)'),(15,'Names object (13)_dict0'),(17,'Names object (16)'),(18,'Names object (16)_dict0'),(20,'Names object (19)'),(21,'Names object (19)_dict0'),(23,'Names object (22)'),(25,'Names object (24)'),(27,'Names object (26)'),(29,'Names object (28)'),(30,'Names object (28)_dict0'),(31,'Names object (28)_dict1'),(33,'Names object (32)'),(34,'Names object (32)_dict0'),(35,'Names object (32)_dict1'),(37,'Names object (36)'),(38,'Names object (36)_dict0'),(39,'Names object (36)_dict1'),(41,'Names object (40)'),(42,'Names object (40)_dict0'),(43,'Names object (40)_dict1'),(46,'Names object (45)'),(47,'Names object (45)_dict0'),(49,'Names object (48)'),(50,'Names object (48)_dict0'),(52,'Names object (51)'),(53,'Names object (51)_dict0'),(55,'Names object (54)'),(56,'Names object (54)_dict0'),(57,'Names object (54)_dict1'),(59,'Names object (58)'),(60,'Names object (58)_dict0'),(62,'Names object (61)'),(63,'Names object (61)_dict0'),(65,'Names object (64)'),(67,'Names object (66)'),(69,'Names object (68)'),(71,'Names object (70)'),(73,'Names object (72)'),(75,'Names object (74)'),(77,'new standard with test2 as template'),(78,'new standard with test2 as template_dict0'),(45,'newest'),(48,'newest2'),(26,'nsmr<dtsnf'),(28,'nsmr<dtsnf2'),(32,'nsmr<dtsnf3'),(36,'nsmr<dtsnf4'),(108,'nytt proj'),(109,'nytt projekkt'),(110,'nytt projekty'),(87,'project Error Test'),(88,'project test 1'),(81,'Project1'),(82,'Project2'),(83,'Project3'),(84,'project4'),(85,'project5'),(86,'project6'),(118,'projektTest'),(93,'RobertsProjekt'),(24,'st1'),(13,'Stål'),(16,'Stål2'),(19,'Stål3'),(112,'standard1'),(113,'standard1_dict0'),(114,'standard1_dict1'),(115,'standard1B'),(116,'standard1B_dict0'),(117,'standard1B_dict1'),(1,'test1'),(2,'test10'),(3,'test11'),(44,'test111221123312'),(40,'test13'),(102,'test1A'),(103,'test1A_dict0'),(104,'test1A_dict1'),(105,'test1B'),(106,'test1B_dict0'),(107,'test1B_dict1'),(4,'test2'),(5,'test20'),(6,'test3'),(7,'test30'),(8,'test4'),(9,'test40'),(10,'test5'),(11,'test50'),(89,'testRoban'),(90,'testRoban_dict0'),(91,'testRoban_dict1'),(92,'testRoban_dict2'),(94,'testRoban2'),(95,'testRoban2_dict0'),(96,'testRoban2_dict1'),(97,'testRoban2_dict2');
/*!40000 ALTER TABLE `names` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `option_dict_mapping`
--

DROP TABLE IF EXISTS `option_dict_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `option_dict_mapping` (
  `dictionary_id` int DEFAULT NULL,
  `option_id` int DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  KEY `dict_option_fk_idx` (`dictionary_id`),
  KEY `option_dict_fk_idx` (`option_id`),
  CONSTRAINT `dict_option_fk` FOREIGN KEY (`dictionary_id`) REFERENCES `dictionary` (`id`),
  CONSTRAINT `option_dict_fk` FOREIGN KEY (`option_id`) REFERENCES `options` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_czech_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `option_dict_mapping`
--

LOCK TABLES `option_dict_mapping` WRITE;
/*!40000 ALTER TABLE `option_dict_mapping` DISABLE KEYS */;
INSERT INTO `option_dict_mapping` VALUES (1,1,1),(1,2,2),(2,3,3),(2,4,4),(3,5,5),(3,6,6),(4,3,7),(4,4,8),(5,3,9),(5,4,10),(6,3,11),(6,4,12),(19,13,13),(20,14,14),(21,15,15),(21,16,16),(22,17,17),(22,18,18),(23,19,19),(24,19,20),(25,5,21),(25,6,22),(26,5,23),(26,6,24),(27,20,25),(27,21,26),(28,22,27),(28,23,28),(29,1,29),(29,2,30),(30,20,31),(30,21,32),(31,22,33),(31,23,34),(32,1,35),(32,2,36),(32,24,37),(33,1,38),(33,2,39),(34,3,40),(34,4,41),(34,25,42),(35,26,43),(35,27,44),(36,1,45),(36,2,46),(37,28,47),(37,29,48),(37,30,49),(38,1,50),(38,2,51),(39,31,52),(39,32,53),(39,33,54),(40,1,55),(40,2,56),(41,34,57),(41,35,58),(42,1,59),(42,2,60),(43,22,61),(43,23,62);
/*!40000 ALTER TABLE `option_dict_mapping` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `options`
--

DROP TABLE IF EXISTS `options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `options` (
  `id` int NOT NULL AUTO_INCREMENT,
  `key` varchar(10) COLLATE utf8mb3_czech_ci DEFAULT NULL,
  `value` varchar(45) COLLATE utf8mb3_czech_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_czech_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `options`
--

LOCK TABLES `options` WRITE;
/*!40000 ALTER TABLE `options` DISABLE KEYS */;
INSERT INTO `options` VALUES (1,'Area','A'),(2,'Volym','V'),(3,'type1','001'),(4,'type2','002'),(5,'test1','001'),(6,'test2','002'),(7,'name','null'),(8,'options','{\'Stål\': \'S\'}'),(9,'name','test10'),(10,'options','{\'Area\': \'A\', \'Volym\': \'V\'}'),(11,'name','a'),(12,'options','{\'a\': \'a\'}'),(13,'a','a'),(14,'sdf','sdfsdf'),(15,'we','asd'),(16,'asdasd','zxczxczxc'),(17,'asdasdasd','adsasdasd'),(18,'asdasd','asfsdfsdfcvbcvbcbdf'),(19,'12','qwasdad'),(20,'Arkitekt','A'),(21,'Elektriker','E'),(22,'typ1','-01'),(23,'typ2','-02'),(24,'kos','K'),(25,'type3','003'),(26,'Meter','-m'),(27,'Centimeter','-cm'),(28,'type1','1'),(29,'type2','2'),(30,'type3','3'),(31,'type1','01'),(32,'type2','02'),(33,'type3','03'),(34,'typ1','-001'),(35,'typ2','-002');
/*!40000 ALTER TABLE `options` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `name_idx` (`name_id`),
  CONSTRAINT `name_id` FOREIGN KEY (`name_id`) REFERENCES `names` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_czech_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (8,81),(7,82),(2,83),(3,84),(4,85),(5,86),(6,87),(9,88),(10,93),(12,110),(13,118);
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` tinyint NOT NULL AUTO_INCREMENT,
  `role` varchar(45) COLLATE utf8mb3_czech_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `role_UNIQUE` (`role`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_czech_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (2,'admin'),(1,'user');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `standard`
--

DROP TABLE IF EXISTS `standard`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `standard` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `standard_UNIQUE` (`id`),
  KEY `id_idx` (`name_id`),
  CONSTRAINT `name_id_fk` FOREIGN KEY (`name_id`) REFERENCES `names` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_czech_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `standard`
--

LOCK TABLES `standard` WRITE;
/*!40000 ALTER TABLE `standard` DISABLE KEYS */;
INSERT INTO `standard` VALUES (7,1),(8,4),(9,6),(10,8),(11,10),(12,12),(13,14),(14,17),(15,20),(16,23),(17,25),(18,29),(19,33),(20,37),(21,41),(22,46),(23,49),(24,52),(25,55),(26,59),(27,62),(28,65),(29,67),(30,69),(31,71),(32,73),(33,75),(34,76),(35,77),(36,79),(37,89),(38,94),(39,98),(40,102),(41,105),(42,111),(43,112),(44,115);
/*!40000 ALTER TABLE `standard` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `standard_dict_mapping`
--

DROP TABLE IF EXISTS `standard_dict_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `standard_dict_mapping` (
  `standard_id` int DEFAULT NULL,
  `dictionary_id` int DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  KEY `stand_dict_fk_idx` (`standard_id`),
  KEY `dict_stand_fk_idx` (`dictionary_id`),
  CONSTRAINT `dict_stand_fk` FOREIGN KEY (`dictionary_id`) REFERENCES `dictionary` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `stand_dict_fk` FOREIGN KEY (`standard_id`) REFERENCES `standard` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_czech_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `standard_dict_mapping`
--

LOCK TABLES `standard_dict_mapping` WRITE;
/*!40000 ALTER TABLE `standard_dict_mapping` DISABLE KEYS */;
INSERT INTO `standard_dict_mapping` VALUES (7,1,5),(7,2,6),(8,3,7),(9,4,8),(10,5,9),(11,6,10),(13,7,11),(14,8,12),(15,9,13),(18,10,14),(18,11,15),(19,12,16),(19,13,17),(20,14,18),(20,15,19),(21,16,20),(21,17,21),(22,18,22),(23,19,23),(24,20,24),(25,21,25),(25,22,26),(26,23,27),(27,24,28),(35,25,29),(36,26,30),(37,27,31),(37,28,32),(37,29,33),(38,30,34),(38,31,35),(38,32,36),(39,33,37),(39,34,38),(39,35,39),(40,36,40),(40,37,41),(41,38,42),(41,39,43),(43,40,44),(43,41,45),(44,42,46),(44,43,47);
/*!40000 ALTER TABLE `standard_dict_mapping` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `standard_project_mapping`
--

DROP TABLE IF EXISTS `standard_project_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `standard_project_mapping` (
  `standard_id` int NOT NULL,
  `project_id` int NOT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  KEY `project_id_idx` (`project_id`),
  KEY `project_standard_fk` (`standard_id`),
  CONSTRAINT `project_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `project_standard_fk` FOREIGN KEY (`standard_id`) REFERENCES `standard` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_czech_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `standard_project_mapping`
--

LOCK TABLES `standard_project_mapping` WRITE;
/*!40000 ALTER TABLE `standard_project_mapping` DISABLE KEYS */;
INSERT INTO `standard_project_mapping` VALUES (9,2,1),(10,3,2),(11,4,3),(35,5,4),(8,6,5),(8,7,6),(13,8,7),(7,9,8),(37,10,9),(7,12,45),(8,12,46),(9,12,47),(43,13,48),(44,13,49);
/*!40000 ALTER TABLE `standard_project_mapping` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_project_mapping`
--

DROP TABLE IF EXISTS `user_project_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_project_mapping` (
  `user_id` int NOT NULL,
  `project_id` int NOT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  KEY `user_id_idx` (`user_id`),
  KEY `project_id_idx` (`project_id`),
  CONSTRAINT `user_project_mapping_project_fk` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_project_mapping_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_czech_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_project_mapping`
--

LOCK TABLES `user_project_mapping` WRITE;
/*!40000 ALTER TABLE `user_project_mapping` DISABLE KEYS */;
INSERT INTO `user_project_mapping` VALUES (2,2,1);
/*!40000 ALTER TABLE `user_project_mapping` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(60) COLLATE utf8mb3_czech_ci NOT NULL,
  `password` varchar(200) COLLATE utf8mb3_czech_ci DEFAULT NULL,
  `role_id` tinyint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  KEY `role_id_idx` (`role_id`),
  CONSTRAINT `role_id` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_czech_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'eh@test.com','pbkdf2_sha256$720000$bW6x0jScIah9LL1CqRut76$1681L8nRZ5do/nokHNJfvWmlwJOyuy3UP1PpuwlguZU=',2),(2,'mz@test.com','pbkdf2_sha256$720000$RS3dyrFuRdFJoFtsTYbsh2$Rm5Tt4bOUTzRdk9xXbAfxq3JkelKHbDioYhSek1VHL4=',1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-04-11 11:53:42
