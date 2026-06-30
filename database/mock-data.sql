USE finance_investments;

-- ==================================================================================================
-- 1) TIPOS DE ATIVOS
-- ==================================================================================================
INSERT INTO asset_type (asset_type) VALUES
  ('Ação'),
  ('FII'),
  ('Renda Fixa');

-- ==================================================================================================
-- 2) ATIVOS DO SISTEMA
-- ==================================================================================================

-- AÇÕES (Solicitadas + 5 Escolhidas)
INSERT INTO asset (asset_type_id, ticker, company, current_price) VALUES
  (1, 'BBAS3', 'Banco do Brasil SA', 28.70),
  (1, 'CMIG4', 'Cia Energética de MG', 11.50),
  (1, 'ITSA4', 'Itaúsa SA', 10.85),
  (1, 'PETR4', 'Petrobras SA', 39.20),
  (1, 'POMO4', 'Marcopolo SA', 8.20),
  -- 5 adicionais brasileiras
  (1, 'VALE3', 'Vale SA', 62.40),
  (1, 'WEGE3', 'WEG SA', 47.15),
  (1, 'SANB11', 'Santander Brasil SA', 29.10),
  (1, 'ELET3', 'Eletrobras SA', 41.30),
  (1, 'EQTL3', 'Equatorial Energia SA', 33.50);

-- FIIS (20 Solicitados + 5 Escolhidos, classificados por categoria)
INSERT INTO asset (asset_type_id, ticker, category, current_price) VALUES
  -- Solicitados: Fundo de Tijolo
  (2, 'BRCO11', 'Fundo de Tijolo', 121.50),
  (2, 'BTLG11', 'Fundo de Tijolo', 102.80),
  (2, 'GARE11', 'Fundo de Tijolo', 9.15),
  (2, 'GGRC11', 'Fundo de Tijolo', 112.30),
  (2, 'HGLG11', 'Fundo de Tijolo', 165.90),
  (2, 'HGRU11', 'Fundo de Tijolo', 125.40),
  (2, 'HSML11', 'Fundo de Tijolo', 94.20),
  (2, 'PVBI11', 'Fundo de Tijolo', 91.80),
  (2, 'TRXF11', 'Fundo de Tijolo', 104.50),
  (2, 'XPML11', 'Fundo de Tijolo', 109.60),
  
  -- Solicitados: Fundo de Papel (Recebíveis)
  (2, 'CPTS11', 'Fundo de Papel', 8.33),
  (2, 'IRIM11', 'Fundo de Papel', 82.10),
  (2, 'ITRI11', 'Fundo de Papel', 94.50),
  (2, 'KNCR11', 'Fundo de Papel', 106.40),
  (2, 'KNHF11', 'Fundo de Papel', 101.20),
  (2, 'KNUQ11', 'Fundo de Papel', 88.90),
  (2, 'RBRR11', 'Fundo de Papel', 91.30),
  (2, 'RECR11', 'Fundo de Papel', 73.80),
  
  -- Solicitados: Fundo Híbrido / Multi-estratégia
  (2, 'KNRI11', 'Fundo Híbrido', 158.20),
  (2, 'RBRP11', 'Fundo Híbrido', 52.70),
  
  -- 5 FIIs adicionais escolhidos
  (2, 'XPLG11', 'Fundo de Tijolo', 101.20),
  (2, 'VISC11', 'Fundo de Tijolo', 115.00),
  (2, 'MXRF11', 'Fundo de Papel', 10.15),
  (2, 'HGBS11', 'Fundo de Tijolo', 218.00),
  (2, 'BCFF11', 'Fundo Híbrido', 9.25);

-- RENDA FIXA (Mantidos do modelo)
INSERT INTO asset (asset_type_id, company) VALUES
  (3, 'Tesouro Selic 2029'),
  (3, 'CDB Banco Inter 115 CDI'),
  (3, 'LCI Itau 2027'),
  (3, 'Debenture Incentivada'),
  (3, 'CRI Imobiliario 2029');

-- ==================================================================================================
-- 3) TRANSAÇÕES - JANEIRO A JUNHO 2026 (IDs Ajustados)
-- ==================================================================================================
INSERT INTO transaction (user_id, asset_id, entry_type, date, quantity, unit_price, total_value) VALUES
  -- AÇÕES (Usando IDs 1-10)
  (1, 1, 'buy',  '2026-01-15', 50, 28.50, 1425.00),
  (1, 1, 'sell', '2026-04-20', 30, 30.20, 906.00),
  (1, 2, 'buy',  '2026-02-10', 40, 11.80, 472.00),
  (1, 4, 'buy',  '2026-03-05', 60, 40.50, 2430.00),
  
  -- FIIS (Usando IDs 11-35 conforme ordem de inserção na tabela asset)
  -- Ex: HGLG11 (id 15), KNRI11 (id 29), BCFF11 (id 35)
  (1, 15, 'buy',  '2026-01-20', 20, 165.90, 3318.00), -- HGLG11
  (1, 29, 'buy',  '2026-03-25', 10, 158.20, 1582.00), -- KNRI11 (Híbrido)
  (1, 35, 'buy',  '2026-05-10', 100, 9.25, 925.00),    -- BCFF11 (Híbrido)
  (1, 33, 'buy',  '2026-04-05', 40, 101.20, 4048.00),  -- XPLG11
  (1, 34, 'buy',  '2026-02-20', 50, 10.15, 507.50),    -- MXRF11
  
  -- RENDA FIXA (IDs 36-40 conforme inserção)
  (1, 36, 'buy',  '2026-01-05', 1, 2000.00, 2000.00), -- Tesouro Selic
  (1, 37, 'buy',  '2026-04-18', 1, 3500.00, 3500.00); -- CDB Inter

-- ==================================================================================================
-- 4) WALLET CONSOLIDADA (Saldos coerentes com as novas transações)
-- ==================================================================================================
INSERT INTO wallet (user_id, asset_id, quantity, average_price, total_invested, income, initial_date) VALUES
  -- Ações
  (1, 1, 20.00, 28.50, 570.00, 0.00, '2026-01-15'),
  (1, 2, 40.00, 11.80, 472.00, 0.00, '2026-02-10'),
  (1, 4, 60.00, 40.50, 2430.00, 0.00, '2026-03-05'),
  
  -- FIIs (Híbridos e outros)
  (1, 15, 20.00, 165.90, 3318.00, 0.00, '2026-01-20'),
  (1, 29, 10.00, 158.20, 1582.00, 0.00, '2026-03-25'),
  (1, 35, 100.00, 9.25, 925.00, 0.00, '2026-05-10'),
  (1, 33, 40.00, 101.20, 4048.00, 0.00, '2026-04-05'),
  (1, 34, 50.00, 10.15, 507.50, 0.00, '2026-02-20'),
  
  -- Renda Fixa
  (1, 36, 1.00, 2000.00, 2000.00, 15.00, '2026-01-05'),
  (1, 37, 1.00, 3500.00, 3500.00, 10.00, '2026-04-18');