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
-- Se um utilizador registra um ativo, ele ficará disponível apenas para ele.
DROP DATABASE IF EXISTS finance_investments;

CREATE DATABASE IF NOT EXISTS finance_investments;

USE finance_investments;

DROP TABLE IF EXISTS journal;

DROP TABLE IF EXISTS messages;

DROP TABLE IF EXISTS conversations;

DROP TABLE IF EXISTS user;

DROP TABLE IF EXISTS assets;

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

CREATE TABLE assets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  asset_type_id INT NOT NULL,
  name VARCHAR(75) NOT NULL,
  description VARCHAR(150) DEFAULT NULL,
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

CREATE TABLE journal (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  asset_id INT NOT NULL,
  entry_type VARCHAR(10) NOT NULL,
  date DATE NOT NULL,
  quantity DECIMAL(18, 8) NOT NULL DEFAULT 0,
  unit_price DECIMAL(18, 4) NOT NULL,
  total_value DECIMAL(18, 2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(id),
  FOREIGN KEY (asset_id) REFERENCES assets(id)
);

CREATE TABLE conversations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  conversation_id INT NOT NULL,
  role VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);