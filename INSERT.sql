CREATE TABLE IF NOT EXISTS `server_licensing` (
  `ip` varchar(50) DEFAULT NULL,
  `whitelisted` tinyint(4) DEFAULT 0,
  `notes` varchar(50) DEFAULT NULL,
  `expiry_date` DATETIME DEFAULT NULL, 
  PRIMARY KEY (`ip`) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
