DROP DATABASE IF EXISTS finance_investiments;
CREATE DATABASE IF NOT EXISTS finance_investiments;

USE finance_investiments;

DROP TABLE IF EXISTS investimentos_historico;
DROP TABLE IF EXISTS investimentos_fundos_imobiliarios;
DROP TABLE IF EXISTS investimentos_acoes;
DROP TABLE IF EXISTS investimentos_renda_fixa;

CREATE TABLE investimentos_renda_fixa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome_renda_fixa VARCHAR(150) NOT NULL,
  data_inicial DATE NOT NULL,
  valor_investido DECIMAL(14, 2) NOT NULL,
  valor_bruto_atual DECIMAL(14, 2) NOT NULL,
  imposto_renda DECIMAL(14, 2) NOT NULL DEFAULT 0,
  valor_liquido_atual DECIMAL(14, 2) GENERATED ALWAYS AS (valor_bruto_atual - imposto_renda) STORED,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_rf_data_atualizacao (data_atualizacao)
);

CREATE TABLE investimentos_acoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sigla VARCHAR(10) NOT NULL,
  nome_acao VARCHAR(150) NOT NULL,
  quantidade INT NOT NULL,
  valor_total_atual DECIMAL(14, 2) NOT NULL,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_acoes_data_atualizacao (data_atualizacao)
);

CREATE TABLE investimentos_fundos_imobiliarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sigla VARCHAR(10) NOT NULL,
  categoria ENUM('Fundos de Tijolo', 'Fundos de Papel', 'Fundos Híbridos') NOT NULL,
  quantidade INT NOT NULL,
  valor_total_atual DECIMAL(14, 2) NOT NULL,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_fii_data_atualizacao (data_atualizacao),
  KEY idx_fii_categoria (categoria)
);

CREATE TABLE investimentos_historico (
  id INT AUTO_INCREMENT PRIMARY KEY,
  investment_type ENUM('renda_fixa', 'acoes', 'fundos_imobiliarios') NOT NULL,
  investment_id INT NOT NULL,
  action_type ENUM('CRIACAO', 'ATUALIZACAO', 'REMOCAO') NOT NULL,
  before_data JSON NULL,
  after_data JSON NULL,
  changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_hist_changed_at (changed_at),
  KEY idx_hist_type_id (investment_type, investment_id)
);