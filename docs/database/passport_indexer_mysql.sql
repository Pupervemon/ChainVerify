SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS `chain_sync_cursors` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `chain_id` BIGINT UNSIGNED NOT NULL,
  `contract_role` VARCHAR(32) NOT NULL,
  `contract_address` CHAR(42) NOT NULL,
  `event_name` VARCHAR(64) NOT NULL,
  `start_block` BIGINT UNSIGNED NOT NULL DEFAULT 0,
  `next_block` BIGINT UNSIGNED NOT NULL DEFAULT 0,
  `last_scanned_block` BIGINT UNSIGNED NULL,
  `last_scanned_at` DATETIME(3) NULL,
  `notes` VARCHAR(255) NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_chain_sync_cursor` (`chain_id`, `contract_address`, `event_name`),
  KEY `idx_chain_sync_cursor_role` (`chain_id`, `contract_role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `chain_event_logs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `chain_id` BIGINT UNSIGNED NOT NULL,
  `block_number` BIGINT UNSIGNED NOT NULL,
  `block_hash` CHAR(66) NOT NULL,
  `block_timestamp` DATETIME(3) NULL,
  `tx_hash` CHAR(66) NOT NULL,
  `tx_index` INT UNSIGNED NOT NULL DEFAULT 0,
  `log_index` INT UNSIGNED NOT NULL,
  `contract_role` VARCHAR(32) NOT NULL,
  `contract_address` CHAR(42) NOT NULL,
  `event_name` VARCHAR(64) NOT NULL,
  `topic0` CHAR(66) NOT NULL,
  `topic1` CHAR(66) NULL,
  `topic2` CHAR(66) NULL,
  `topic3` CHAR(66) NULL,
  `removed` TINYINT(1) NOT NULL DEFAULT 0,
  `payload` JSON NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_chain_event_log` (`chain_id`, `tx_hash`, `log_index`),
  KEY `idx_chain_event_lookup` (`chain_id`, `contract_address`, `event_name`, `block_number`, `log_index`),
  KEY `idx_chain_event_block` (`chain_id`, `block_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `passport_contract_state` (
  `chain_id` BIGINT UNSIGNED NOT NULL,
  `contract_address` CHAR(42) NOT NULL,
  `contract_role` VARCHAR(32) NOT NULL,
  `owner_address` CHAR(42) NULL,
  `linked_asset_passport_address` CHAR(42) NULL,
  `linked_authority_address` CHAR(42) NULL,
  `linked_chronicle_address` CHAR(42) NULL,
  `linked_subject_account_registry` CHAR(42) NULL,
  `linked_subject_account_implementation` CHAR(42) NULL,
  `latest_block_number` BIGINT UNSIGNED NULL,
  `latest_block_timestamp` DATETIME(3) NULL,
  `latest_tx_hash` CHAR(66) NULL,
  `latest_log_index` INT UNSIGNED NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`chain_id`, `contract_address`),
  KEY `idx_passport_contract_state_role` (`chain_id`, `contract_role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `passports` (
  `chain_id` BIGINT UNSIGNED NOT NULL,
  `asset_passport_address` CHAR(42) NOT NULL,
  `passport_id` DECIMAL(78, 0) NOT NULL,
  `asset_fingerprint` CHAR(66) NOT NULL,
  `current_owner_address` CHAR(42) NOT NULL,
  `subject_account_address` CHAR(42) NULL,
  `passport_metadata_cid` VARCHAR(255) NOT NULL DEFAULT '',
  `asset_metadata_cid` VARCHAR(255) NOT NULL DEFAULT '',
  `status` ENUM('uninitialized', 'active', 'frozen', 'retired') NOT NULL DEFAULT 'active',
  `factory_contract_address` CHAR(42) NULL,
  `minted_block_number` BIGINT UNSIGNED NULL,
  `minted_at` DATETIME(3) NULL,
  `minted_tx_hash` CHAR(66) NULL,
  `latest_block_number` BIGINT UNSIGNED NULL,
  `latest_block_timestamp` DATETIME(3) NULL,
  `latest_tx_hash` CHAR(66) NULL,
  `latest_log_index` INT UNSIGNED NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`chain_id`, `asset_passport_address`, `passport_id`),
  UNIQUE KEY `uk_passports_fingerprint` (`chain_id`, `asset_passport_address`, `asset_fingerprint`),
  KEY `idx_passports_owner` (`chain_id`, `asset_passport_address`, `current_owner_address`),
  KEY `idx_passports_subject` (`chain_id`, `asset_passport_address`, `subject_account_address`),
  KEY `idx_passports_status` (`chain_id`, `asset_passport_address`, `status`),
  KEY `idx_passports_minted_block` (`chain_id`, `asset_passport_address`, `minted_block_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `passport_transfer_history` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `chain_id` BIGINT UNSIGNED NOT NULL,
  `asset_passport_address` CHAR(42) NOT NULL,
  `passport_id` DECIMAL(78, 0) NOT NULL,
  `from_address` CHAR(42) NOT NULL,
  `to_address` CHAR(42) NOT NULL,
  `block_number` BIGINT UNSIGNED NOT NULL,
  `block_timestamp` DATETIME(3) NULL,
  `tx_hash` CHAR(66) NOT NULL,
  `log_index` INT UNSIGNED NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_passport_transfer_log` (`chain_id`, `tx_hash`, `log_index`),
  KEY `idx_passport_transfer_passport` (`chain_id`, `asset_passport_address`, `passport_id`, `block_number`),
  KEY `idx_passport_transfer_to` (`chain_id`, `asset_passport_address`, `to_address`, `block_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `passport_trusted_factories` (
  `chain_id` BIGINT UNSIGNED NOT NULL,
  `asset_passport_address` CHAR(42) NOT NULL,
  `factory_address` CHAR(42) NOT NULL,
  `enabled` TINYINT(1) NOT NULL,
  `latest_block_number` BIGINT UNSIGNED NULL,
  `latest_block_timestamp` DATETIME(3) NULL,
  `latest_tx_hash` CHAR(66) NULL,
  `latest_log_index` INT UNSIGNED NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`chain_id`, `asset_passport_address`, `factory_address`),
  KEY `idx_passport_trusted_factories_enabled` (`chain_id`, `asset_passport_address`, `enabled`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `passport_creators` (
  `chain_id` BIGINT UNSIGNED NOT NULL,
  `authority_address` CHAR(42) NOT NULL,
  `operator_address` CHAR(42) NOT NULL,
  `enabled` TINYINT(1) NOT NULL,
  `latest_block_number` BIGINT UNSIGNED NULL,
  `latest_block_timestamp` DATETIME(3) NULL,
  `latest_tx_hash` CHAR(66) NULL,
  `latest_log_index` INT UNSIGNED NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`chain_id`, `authority_address`, `operator_address`),
  KEY `idx_passport_creators_enabled` (`chain_id`, `authority_address`, `enabled`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `passport_revocation_operators` (
  `chain_id` BIGINT UNSIGNED NOT NULL,
  `authority_address` CHAR(42) NOT NULL,
  `operator_address` CHAR(42) NOT NULL,
  `enabled` TINYINT(1) NOT NULL,
  `latest_block_number` BIGINT UNSIGNED NULL,
  `latest_block_timestamp` DATETIME(3) NULL,
  `latest_tx_hash` CHAR(66) NULL,
  `latest_log_index` INT UNSIGNED NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`chain_id`, `authority_address`, `operator_address`),
  KEY `idx_passport_revocation_operators_enabled` (`chain_id`, `authority_address`, `enabled`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `passport_stamp_type_admins` (
  `chain_id` BIGINT UNSIGNED NOT NULL,
  `authority_address` CHAR(42) NOT NULL,
  `stamp_type_id` DECIMAL(78, 0) NOT NULL,
  `admin_address` CHAR(42) NOT NULL,
  `enabled` TINYINT(1) NOT NULL,
  `latest_block_number` BIGINT UNSIGNED NULL,
  `latest_block_timestamp` DATETIME(3) NULL,
  `latest_tx_hash` CHAR(66) NULL,
  `latest_log_index` INT UNSIGNED NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`chain_id`, `authority_address`, `stamp_type_id`, `admin_address`),
  KEY `idx_passport_stamp_type_admins_enabled` (`chain_id`, `authority_address`, `stamp_type_id`, `enabled`),
  KEY `idx_passport_stamp_type_admins_admin` (`chain_id`, `authority_address`, `admin_address`, `enabled`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `passport_allowlist_modes` (
  `chain_id` BIGINT UNSIGNED NOT NULL,
  `authority_address` CHAR(42) NOT NULL,
  `passport_id` DECIMAL(78, 0) NOT NULL,
  `enabled` TINYINT(1) NOT NULL,
  `latest_block_number` BIGINT UNSIGNED NULL,
  `latest_block_timestamp` DATETIME(3) NULL,
  `latest_tx_hash` CHAR(66) NULL,
  `latest_log_index` INT UNSIGNED NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`chain_id`, `authority_address`, `passport_id`),
  KEY `idx_passport_allowlist_modes_enabled` (`chain_id`, `authority_address`, `enabled`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `passport_issuer_policies` (
  `chain_id` BIGINT UNSIGNED NOT NULL,
  `authority_address` CHAR(42) NOT NULL,
  `scope` ENUM('global', 'type', 'passport') NOT NULL,
  `issuer_address` CHAR(42) NOT NULL,
  `resource_id` DECIMAL(78, 0) NOT NULL DEFAULT 0,
  `enabled` TINYINT(1) NOT NULL,
  `policy_cid` VARCHAR(255) NOT NULL DEFAULT '',
  `valid_after` BIGINT UNSIGNED NULL,
  `valid_until` BIGINT UNSIGNED NULL,
  `restrict_to_explicit_passport_list` TINYINT(1) NULL,
  `needs_chain_refresh` TINYINT(1) NOT NULL DEFAULT 1,
  `snapshot_block_number` BIGINT UNSIGNED NULL,
  `latest_block_number` BIGINT UNSIGNED NULL,
  `latest_block_timestamp` DATETIME(3) NULL,
  `latest_tx_hash` CHAR(66) NULL,
  `latest_log_index` INT UNSIGNED NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`chain_id`, `authority_address`, `scope`, `issuer_address`, `resource_id`),
  KEY `idx_passport_issuer_policies_enabled` (`chain_id`, `authority_address`, `scope`, `enabled`),
  KEY `idx_passport_issuer_policies_issuer` (`chain_id`, `authority_address`, `issuer_address`, `enabled`),
  KEY `idx_passport_issuer_policies_refresh` (`chain_id`, `authority_address`, `needs_chain_refresh`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `passport_stamp_types` (
  `chain_id` BIGINT UNSIGNED NOT NULL,
  `chronicle_address` CHAR(42) NOT NULL,
  `stamp_type_id` DECIMAL(78, 0) NOT NULL,
  `code` VARCHAR(64) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `schema_cid` VARCHAR(255) NOT NULL DEFAULT '',
  `active` TINYINT(1) NOT NULL,
  `singleton` TINYINT(1) NOT NULL,
  `latest_block_number` BIGINT UNSIGNED NULL,
  `latest_block_timestamp` DATETIME(3) NULL,
  `latest_tx_hash` CHAR(66) NULL,
  `latest_log_index` INT UNSIGNED NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`chain_id`, `chronicle_address`, `stamp_type_id`),
  KEY `idx_passport_stamp_types_active` (`chain_id`, `chronicle_address`, `active`),
  KEY `idx_passport_stamp_types_code` (`chain_id`, `chronicle_address`, `code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `passport_stamps` (
  `chain_id` BIGINT UNSIGNED NOT NULL,
  `chronicle_address` CHAR(42) NOT NULL,
  `asset_passport_address` CHAR(42) NULL,
  `stamp_id` DECIMAL(78, 0) NOT NULL,
  `passport_id` DECIMAL(78, 0) NOT NULL,
  `stamp_type_id` DECIMAL(78, 0) NOT NULL,
  `issuer_address` CHAR(42) NOT NULL,
  `subject_account_address` CHAR(42) NULL,
  `occurred_at` BIGINT UNSIGNED NOT NULL,
  `issued_at` BIGINT UNSIGNED NOT NULL,
  `metadata_cid` VARCHAR(255) NOT NULL,
  `revoked` TINYINT(1) NOT NULL DEFAULT 0,
  `revoked_via` ENUM('none', 'superseded', 'explicit') NOT NULL DEFAULT 'none',
  `supersedes_stamp_id` DECIMAL(78, 0) NOT NULL DEFAULT 0,
  `revoked_by_stamp_id` DECIMAL(78, 0) NOT NULL DEFAULT 0,
  `revoked_operator_address` CHAR(42) NULL,
  `revocation_reason_cid` VARCHAR(255) NULL,
  `issued_block_number` BIGINT UNSIGNED NULL,
  `issued_block_timestamp` DATETIME(3) NULL,
  `issued_tx_hash` CHAR(66) NULL,
  `revoked_block_number` BIGINT UNSIGNED NULL,
  `revoked_block_timestamp` DATETIME(3) NULL,
  `revoked_tx_hash` CHAR(66) NULL,
  `latest_block_number` BIGINT UNSIGNED NULL,
  `latest_block_timestamp` DATETIME(3) NULL,
  `latest_tx_hash` CHAR(66) NULL,
  `latest_log_index` INT UNSIGNED NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`chain_id`, `chronicle_address`, `stamp_id`),
  KEY `idx_passport_stamps_passport` (`chain_id`, `chronicle_address`, `passport_id`, `issued_at`),
  KEY `idx_passport_stamps_type` (`chain_id`, `chronicle_address`, `stamp_type_id`, `revoked`),
  KEY `idx_passport_stamps_effective` (`chain_id`, `chronicle_address`, `passport_id`, `stamp_type_id`, `revoked`, `issued_at`),
  KEY `idx_passport_stamps_issuer` (`chain_id`, `chronicle_address`, `issuer_address`, `issued_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
