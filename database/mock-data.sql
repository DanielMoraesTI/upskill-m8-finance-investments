USE finance_investments;

SELECT
    *
FROM
    user;

INSERT INTO
    asset_type (asset_type)
VALUES
    -- ID 1
    ('Ação'),
    -- ID 2
    ('FII'),
    -- ID 3
    ('Renda Fixa');

-- Mock data de Ações (ID 1)
INSERT INTO
    asset (asset_type_id, ticker, company, current_price)
VALUES
    -- ID 1
    (1, 'ITSA3', 'ITAUSA S.A.', 31.33),
    -- ID 2
    (1, 'PETR4', 'PETROBRAS S.A.', 28.12),
    -- ID 3
    (1, 'CMIG4', 'Cemig Energia MG S.A.', 143.67);

-- Mock data de FIIs (ID 2)
INSERT INTO
    asset (asset_type_id, ticker, category, current_price)
VALUES
    -- ID 4
    (2, 'CPTS11', 'Fundo de Papel', 313.33),
    -- ID 5
    (2, 'XPML11', 'Fundo de Tijolo', 28.12),
    -- ID 6
    (2, 'RECR11', 'Fundo de Papel', 143.67);

-- Mock data de Renda Fixa (ID 3)
INSERT INTO
    asset (asset_type_id, company)
VALUES
    -- ID 7
    (
        3,
        'Itaú Crédito Bancário Renda Fixa Crédito Privado'
    ),
    -- ID 8
    (3, 'Nubank Caixinha');

-- Mock data de Transactions
INSERT INTO
    transaction (
        user_id,
        asset_id,
        entry_type,
        date,
        quantity,
        unit_price,
        total_value
    )
VALUES
    -- --------------------------------------------------------
    -- Ações (ID 1: ITSA3 | ID 2: PETR4 | ID 3: CMIG4)
    -- --------------------------------------------------------
    -- ITSA3 (Asset 1)
    (1, 1, 'buy', '2025-01-10', 100, 10.0000, 1000.00),
    (1, 1, 'buy', '2025-02-15', 50, 11.0000, 550.00),
    (1, 1, 'sell', '2025-03-20', 30, 12.0000, 360.00),
    -- PETR4 (Asset 2)
    (1, 2, 'buy', '2025-01-12', 200, 25.0000, 5000.00),
    (
        1,
        2,
        'sell',
        '2025-02-18',
        100,
        26.0000,
        2600.00
    ),
    (1, 2, 'buy', '2025-04-05', 50, 28.0000, 1400.00),
    -- CMIG4 (Asset 3)
    (1, 3, 'buy', '2024-11-20', 50, 130.0000, 6500.00),
    (1, 3, 'buy', '2024-12-10', 50, 140.0000, 7000.00),
    (
        1,
        3,
        'sell',
        '2025-01-25',
        100,
        145.0000,
        14500.00
    ),
    -- Zerou a posição
    (1, 3, 'buy', '2025-05-10', 20, 143.0000, 2860.00),
    -- Recomprou
    -- --------------------------------------------------------
    -- FIIs (ID 4: CPTS11 | ID 5: XPML11 | ID 6: RECR11)
    -- --------------------------------------------------------
    -- CPTS11 (Asset 4)
    (1, 4, 'buy', '2025-01-05', 10, 300.0000, 3000.00),
    (1, 4, 'buy', '2025-02-05', 5, 310.0000, 1550.00),
    (1, 4, 'sell', '2025-04-10', 5, 315.0000, 1575.00),
    -- XPML11 (Asset 5)
    (1, 5, 'buy', '2024-10-15', 100, 25.0000, 2500.00),
    (1, 5, 'buy', '2024-11-15', 100, 26.0000, 2600.00),
    (
        1,
        5,
        'sell',
        '2025-03-01',
        150,
        28.0000,
        4200.00
    ),
    -- RECR11 (Asset 6)
    (1, 6, 'buy', '2025-02-10', 50, 140.0000, 7000.00),
    (
        1,
        6,
        'sell',
        '2025-03-15',
        20,
        145.0000,
        2900.00
    ),
    (1, 6, 'buy', '2025-05-20', 30, 142.0000, 4260.00),
    -- --------------------------------------------------------
    -- Renda Fixa (ID 7: Itaú | ID 8: Nubank)
    -- Constrain: qty=1 e unit_price=total_value
    -- --------------------------------------------------------
    -- Itaú Crédito Bancário Renda Fixa (Asset 7)
    (1, 7, 'buy', '2025-01-02', 1, 5000.0000, 5000.00),
    (1, 7, 'buy', '2025-02-02', 1, 3000.0000, 3000.00),
    (1, 7, 'buy', '2025-03-02', 1, 2000.0000, 2000.00),
    -- Nubank Caixinha (Asset 8)
    (1, 8, 'buy', '2025-01-15', 1, 1000.0000, 1000.00),
    (1, 8, 'buy', '2025-02-15', 1, 500.0000, 500.00),
    (1, 8, 'buy', '2025-03-15', 1, 1500.0000, 1500.00),
    (
        1,
        8,
        'sell',
        '2025-04-15',
        1,
        1000.0000,
        1000.00
    );

INSERT INTO
    wallet (
        user_id,
        asset_id,
        quantity,
        average_price,
        total_invested,
        income
    )
VALUES
    -- --------------------------------------------------------
    -- Ações
    -- --------------------------------------------------------
    -- ITSA3: Comprou 150 (Total: 1550 -> PM: 10.3333). Vendeu 30. Sobraram 120.
    (1, 1, 120, 10.3333, 1240.00, 0),
    -- PETR4: Comprou 200 (PM 25). Vendeu 100. Comprou +50 por 28 (PM Novo: 26).
    (1, 2, 150, 26.0000, 3900.00, 0),
    -- CMIG4: Comprou 100, zerou posição, recomprou 20 a 143.
    (1, 3, 20, 143.0000, 2860.00, 0),
    -- --------------------------------------------------------
    -- FIIs
    -- --------------------------------------------------------
    -- CPTS11: Comprou 15 (Total: 4550 -> PM: 303.3333). Vendeu 5. Sobraram 10.
    (1, 4, 10, 303.3333, 3033.33, 0),
    -- XPML11: Comprou 200 (Total: 5100 -> PM 25.5000). Vendeu 150. Sobraram 50.
    (1, 5, 50, 25.5000, 1275.00, 0),
    -- RECR11: Comprou 50 (PM 140). Vendeu 20. Comprou +30 por 142 (PM Novo: 141).
    (1, 6, 60, 141.0000, 8460.00, 0),
    -- --------------------------------------------------------
    -- Renda Fixa
    -- Na RF as transações foram unitárias (qty=1), logo as quantidades se somam 
    -- por aporte, e subtraem por resgate.
    -- --------------------------------------------------------
    -- Itaú Crédito Bancário: 3 aportes (qty=3), total 10000.
    (1, 7, 3, 3333.3333, 10000.00, 0),
    -- Nubank Caixinha: 3 aportes (qty=3), 1 resgate (qty=1). Ficam 2.
    (1, 8, 2, 1000.0000, 2000.00, 0);