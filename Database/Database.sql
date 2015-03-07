SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- --------------------------------------------------------

--
-- Table structure for table `Calendars`
--

CREATE TABLE IF NOT EXISTS `Calendars` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `URL` varchar(2083) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Color` varchar(6) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;


-- --------------------------------------------------------

--
-- Table structure for table `CalendarViewers`
--

CREATE TABLE IF NOT EXISTS `CalendarViewers` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `CalendarID` int(11) NOT NULL,
  `ViewerID` int(11) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `CalendarID` (`CalendarID`),
  KEY `ViewerID` (`ViewerID`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;


-- --------------------------------------------------------

--
-- Table structure for table `Viewers`
--

CREATE TABLE IF NOT EXISTS `Viewers` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) NOT NULL,
  `Token` varchar(500) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;


--
-- Constraints for dumped tables
--

--
-- Constraints for table `CalendarViewers`
--
ALTER TABLE `CalendarViewers`
  ADD CONSTRAINT `CalendarViewers_ibfk_1` FOREIGN KEY (`CalendarID`) REFERENCES `Calendars` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `CalendarViewers_ibfk_2` FOREIGN KEY (`ViewerID`) REFERENCES `Viewers` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;
