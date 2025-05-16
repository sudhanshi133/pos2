-- Products for Test Client 1
INSERT INTO products (productName, barcode, clientId, mrp, url) VALUES
('premium watch', 'tc1w001', 1, 2999, 'http://example.com/tc1w001'),
('designer bag', 'tc1b001', 1, 4999, 'http://example.com/tc1b001'),
('sunglasses', 'tc1s001', 1, 1999, 'http://example.com/tc1s001');

-- Products for Test Client 2
INSERT INTO products (productName, barcode, clientId, mrp, url) VALUES
('smart watch', 'tc2w001', 2, 3999, 'http://example.com/tc2w001'),
('backpack', 'tc2b001', 2, 2499, 'http://example.com/tc2b001'),
('sports shoes', 'tc2s001', 2, 3499, 'http://example.com/tc2s001');

-- Products for Test Client 3
INSERT INTO products (productName, barcode, clientId, mrp, url) VALUES
('digital camera', 'tc3c001', 3, 5999, 'http://example.com/tc3c001'),
('laptop bag', 'tc3b001', 3, 1999, 'http://example.com/tc3b001'),
('wireless earbuds', 'tc3e001', 3, 2499, 'http://example.com/tc3e001');

-- Additional products for Giva
INSERT INTO products (productName, barcode, clientId, mrp, url) VALUES
('giva gold chain', 'giva013', 4, 3999, 'http://giva.com/gold-chain'),
('giva silver anklet', 'giva014', 4, 1299, 'http://giva.com/silver-anklet'),
('giva diamond pendant', 'giva015', 4, 4999, 'http://giva.com/diamond-pendant'); 