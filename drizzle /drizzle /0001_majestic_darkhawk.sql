CREATE TABLE `clinics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`city` varchar(255) NOT NULL,
	`systemUrl` varchar(500) NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clinics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `creditHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`doctorId` int NOT NULL,
	`transactionId` int,
	`movementType` enum('debit','credit','adjustment','block','unblock') NOT NULL,
	`amount` decimal(12,2) NOT NULL,
	`previousBalance` decimal(12,2) NOT NULL,
	`newBalance` decimal(12,2) NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `creditHistory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `doctors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`pixKey` varchar(255) NOT NULL,
	`clinicId` int NOT NULL,
	`creditAvailable` decimal(12,2) NOT NULL DEFAULT '0',
	`creditTotal` decimal(12,2) NOT NULL DEFAULT '0',
	`isBlocked` boolean NOT NULL DEFAULT false,
	`blockedAt` timestamp,
	`blockedReason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `doctors_id` PRIMARY KEY(`id`),
	CONSTRAINT `doctors_pixKey_unique` UNIQUE(`pixKey`)
);
--> statement-breakpoint
CREATE TABLE `googleSheetsConfig` (
	`id` int AUTO_INCREMENT NOT NULL,
	`spreadsheetId` varchar(255) NOT NULL,
	`sheetName` varchar(255) NOT NULL,
	`accessToken` longtext NOT NULL,
	`refreshToken` longtext,
	`tokenExpiresAt` timestamp,
	`lastSyncedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `googleSheetsConfig_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pixTransactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`transactionDate` timestamp NOT NULL,
	`patientName` varchar(255) NOT NULL,
	`pixOrigin` varchar(100) NOT NULL,
	`amount` decimal(12,2) NOT NULL,
	`pixKey` varchar(255) NOT NULL,
	`doctorId` int,
	`clinicId` int NOT NULL,
	`city` varchar(255) NOT NULL,
	`googleSheetsRowId` varchar(100),
	`syncedToSheets` boolean NOT NULL DEFAULT false,
	`syncedAt` timestamp,
	`creditDeducted` decimal(12,2) NOT NULL DEFAULT '0',
	`status` enum('pending','processed','synced','failed') NOT NULL DEFAULT 'pending',
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pixTransactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `syncHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clinicId` int NOT NULL,
	`syncType` enum('manual','automatic','google_sheets') NOT NULL,
	`status` enum('pending','in_progress','success','failed') NOT NULL DEFAULT 'pending',
	`recordsProcessed` int NOT NULL DEFAULT 0,
	`recordsFailed` int NOT NULL DEFAULT 0,
	`errorMessage` text,
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `syncHistory_id` PRIMARY KEY(`id`)
);
