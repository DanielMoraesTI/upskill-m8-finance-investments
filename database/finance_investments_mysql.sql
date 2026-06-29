-- ==================================================================================================
-- PREMISSAS: Regras de Negócio.
-- ==================================================================================================
-- O admin do sistema que cria as classes de ativos (pré-definida).
-- O admin do sistema que cria os ativos (pré-definida).
-- O utilizador pode registrar uma movimentação como compra ou venda.
-- Uma movimentação de compra/venda deve ser vinculada a um ativo específico.
-- O utilizador só pode registrar movimentações de ativos previamente cadastrados.
-- Vender: user só pode vender o que tem. Se tentar vender mais do que tem, deve dar erro.
-- Comprar: ou adiciona mais quotas de um ativo atual ou adiciona um novo ativo à carteira.
-- O utilizador só pode registrar ações inteiras (não suporta mercado fracionário).
DROP DATABASE IF EXISTS finance_investments;

CREATE DATABASE IF NOT EXISTS finance_investments;

USE finance_investments;

DROP TABLE IF EXISTS wallet;

DROP TABLE IF EXISTS transaction;

DROP TABLE IF EXISTS message;

DROP TABLE IF EXISTS conversation;

DROP TABLE IF EXISTS user;

DROP TABLE IF EXISTS asset;

DROP TABLE IF EXISTS asset_type;

-- ==================================================================================================
-- SYSTEM TABLES: Tabelas do sistema que preenchemos manualmente para fins de demonstração.
-- ==================================================================================================
CREATE TABLE asset_type (
  id INT AUTO_INCREMENT PRIMARY KEY,
  asset_type VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE asset (
  id INT AUTO_INCREMENT PRIMARY KEY,
  asset_type_id INT NOT NULL,
  -- Sigla para Ação e FIIs
  ticker VARCHAR(10) DEFAULT NULL,
  -- Nome da renda fixa ou empresa da ação
  company VARCHAR(75) DEFAULT NULL,
  -- Categoria do FII: Papel, Tijolo, Híbrido.
  category VARCHAR(50) DEFAULT NULL,
  -- Marcação a mercado de renda variável.
  current_price DECIMAL(18, 4) DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (asset_type_id) REFERENCES asset_type(id)
);

-- ==================================================================================================
-- USER TABLES: Tabelas relacionadas aos usuários do sistema.
-- ==================================================================================================
CREATE TABLE user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  uuid VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE transaction (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  asset_id INT NOT NULL,
  entry_type VARCHAR(10) NOT NULL,
  date DATE NOT NULL,
  quantity DECIMAL(18, 8) NOT NULL DEFAULT 1,
  unit_price DECIMAL(18, 4) NOT NULL DEFAULT 1,
  total_value DECIMAL(18, 2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(id),
  FOREIGN KEY (asset_id) REFERENCES asset(id)
);

CREATE TABLE wallet (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  asset_id INT NOT NULL,
  -- Mutações quando uma transaction é registrado.
  quantity DECIMAL(18, 8) NOT NULL DEFAULT 0,
  average_price DECIMAL(18, 4) NOT NULL DEFAULT 0,
  total_invested DECIMAL(18, 2) NOT NULL DEFAULT 0,
  -- Rendimento da renda fixa.
  income DECIMAL(18, 2) DEFAULT 0,
  -- Data do primeiro aporte da renda fixa.
  initial_date DATE DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(id),
  FOREIGN KEY (asset_id) REFERENCES asset(id),
  -- Garante apenas um registro por ativo na carteira do usuário
  UNIQUE KEY unique_user_asset (user_id, asset_id)
);

CREATE TABLE conversation (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

CREATE TABLE message (
  id INT AUTO_INCREMENT PRIMARY KEY,
  conversation_id INT NOT NULL,
  role VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversation(id) ON DELETE CASCADE
);