import { z } from 'zod';

// CREATE TABLE wallet(
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     user_id INT NOT NULL,
//     asset_id INT NOT NULL,
//     --Mutações quando uma transaction é registrado.
//   quantity DECIMAL(18, 8) NOT NULL DEFAULT 0,
//     average_price DECIMAL(18, 4) NOT NULL DEFAULT 0,
//     total_invested DECIMAL(18, 2) NOT NULL DEFAULT 0,
//     --Marcação a mercado.
//   current_price DECIMAL(18, 4) DEFAULT 0,
//     current_market_value DECIMAL(18, 2) DEFAULT 0,
//     created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//     FOREIGN KEY(user_id) REFERENCES user(id),
//     FOREIGN KEY(asset_id) REFERENCES asset(id),
//     UNIQUE KEY unique_user_asset(user_id, asset_id)-- Garante apenas um registro por ativo na carteira do usuário
// );