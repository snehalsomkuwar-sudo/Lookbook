-- ══════════════════════════════════════════════════════════════════════
-- LookBook by Livspace — Image URL Seed
-- Run this entire block in the Supabase SQL Editor.
-- Updates image_url on all 24 looks and all 51 products.
-- ══════════════════════════════════════════════════════════════════════

-- ──────────────────────────────────────────────
-- lb_looks  (24 rows across 4 rooms)
-- ──────────────────────────────────────────────

-- ─── Living Room ───
UPDATE lb_looks SET image_url = 'https://images.unsplash.com/photo-1707968781591-59ff287a54c6?auto=format&fit=crop&w=1080&q=80'
  WHERE name = 'Quiet Luxury';

UPDATE lb_looks SET image_url = 'https://images.unsplash.com/photo-1752577137302-3cd585efbd2b?auto=format&fit=crop&w=1080&q=80'
  WHERE name = 'Desert Bloom';

UPDATE lb_looks SET image_url = 'https://images.unsplash.com/photo-1763565909003-46e9dfb68a00?auto=format&fit=crop&w=1080&q=80'
  WHERE name = 'Wabi Sabi';

UPDATE lb_looks SET image_url = 'https://images.unsplash.com/photo-1752643719443-991766cceb24?auto=format&fit=crop&w=1080&q=80'
  WHERE name = 'Blue Lagoon';

UPDATE lb_looks SET image_url = 'https://images.unsplash.com/photo-1551516595-80dfd77963fd?auto=format&fit=crop&w=1080&q=80'
  WHERE name = 'Forest Breath';

UPDATE lb_looks SET image_url = 'https://images.unsplash.com/photo-1767720580810-58be50f89bf8?auto=format&fit=crop&w=1080&q=80'
  WHERE name = 'Simply Chic';

-- ─── Bedroom ───
UPDATE lb_looks SET image_url = 'https://images.unsplash.com/photo-1765862835260-47843a7bba45?auto=format&fit=crop&w=1080&q=80'
  WHERE name = 'Serene Slumber';

UPDATE lb_looks SET image_url = 'https://images.unsplash.com/photo-1675621926040-b514257d5941?auto=format&fit=crop&w=1080&q=80'
  WHERE name = 'Dream Weaver';

UPDATE lb_looks SET image_url = 'https://images.unsplash.com/photo-1718636268253-d6ad2a0aeee9?auto=format&fit=crop&w=1080&q=80'
  WHERE name = 'Still Waters';

UPDATE lb_looks SET image_url = 'https://images.unsplash.com/photo-1770232274485-b35ee5092cbe?auto=format&fit=crop&w=1080&q=80'
  WHERE name = 'Ocean Lullaby';

UPDATE lb_looks SET image_url = 'https://images.unsplash.com/photo-1592836115175-237e5f25ff93?auto=format&fit=crop&w=1080&q=80'
  WHERE name = 'Green Canopy';

UPDATE lb_looks SET image_url = 'https://images.unsplash.com/photo-1762199904077-1c83cebbd205?auto=format&fit=crop&w=1080&q=80'
  WHERE name = 'Pure Rest';

-- ─── Bath ───
UPDATE lb_looks SET image_url = 'https://images.unsplash.com/photo-1765766600805-e75c44124d2c?auto=format&fit=crop&w=1080&q=80'
  WHERE name = 'Marble Sanctuary';

UPDATE lb_looks SET image_url = 'https://images.unsplash.com/photo-1605473203669-00e028079fc3?auto=format&fit=crop&w=1080&q=80'
  WHERE name = 'Earthy Escape';

UPDATE lb_looks SET image_url = 'https://images.unsplash.com/photo-1637563523538-fbcd5b9d1eac?auto=format&fit=crop&w=1080&q=80'
  WHERE name = 'Onsen Ritual';

UPDATE lb_looks SET image_url = 'https://images.unsplash.com/photo-1609946860441-a51ffcf22208?auto=format&fit=crop&w=1080&q=80'
  WHERE name = 'Shore Wash';

UPDATE lb_looks SET image_url = 'https://images.unsplash.com/photo-1765637846809-5ab1df50ad62?auto=format&fit=crop&w=1080&q=80'
  WHERE name = 'Stone & Moss';

UPDATE lb_looks SET image_url = 'https://images.unsplash.com/photo-1628746234554-3bb28b7dfd17?auto=format&fit=crop&w=1080&q=80'
  WHERE name = 'Clean Slate';

-- ─── Kitchen ───
UPDATE lb_looks SET image_url = 'https://images.unsplash.com/photo-1722649957265-372809976610?auto=format&fit=crop&w=1080&q=80'
  WHERE name = 'Chef''s Canvas';

UPDATE lb_looks SET image_url = 'https://images.unsplash.com/photo-1544806247-8641744182bb?auto=format&fit=crop&w=1080&q=80'
  WHERE name = 'Harvest Table';

UPDATE lb_looks SET image_url = 'https://images.unsplash.com/photo-1724920179632-15421be00ab8?auto=format&fit=crop&w=1080&q=80'
  WHERE name = 'Umami Space';

UPDATE lb_looks SET image_url = 'https://images.unsplash.com/photo-1755272853203-1469840c4c60?auto=format&fit=crop&w=1080&q=80'
  WHERE name = 'Aqua Kitchen';

UPDATE lb_looks SET image_url = 'https://images.unsplash.com/photo-1561533646-351f513abe0d?auto=format&fit=crop&w=1080&q=80'
  WHERE name = 'Garden Kitchen';

UPDATE lb_looks SET image_url = 'https://images.unsplash.com/photo-1724217600531-fdde7cad8651?auto=format&fit=crop&w=1080&q=80'
  WHERE name = 'Clean Cook';


-- ══════════════════════════════════════════════════════════════════════
-- lb_products  (51 rows)
-- ══════════════════════════════════════════════════════════════════════

-- ─── Sofas ───
UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1602374078449-4ac1a50b7a25?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'Osaka L-Shaped Sofa';

UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1758448755778-90ebf4d0f1e7?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'Milano Sectional';

UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1617326021886-53d6be1d7154?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'Nordic 3-Seater';

UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1765663241884-ebd171bdda1d?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'Velvet Accent';

-- ─── Coffee / Side Tables ───
UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1719899913493-1e508c3833e8?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'Teak Oval Coffee Table';

UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1758315417371-3027bf6eb69b?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'Marble Top';

UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1752061462018-6b3cef2330db?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'Glass Table';

UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1680712738343-84ef33239b1c?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'Nesting Set';

-- ─── Plants ───
UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1766707811108-4e20c1e8ebd4?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'Monstera + Rattan Stand';

UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1622673037899-d7914ece9fe8?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'Fiddle Leaf Fig';

UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1761083042152-ff2d05e6340b?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'Snake Plant';

-- ─── TV Units ───
UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1610990294293-ff44c4c56971?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'Walnut TV Unit 1.8m';

UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1757774636367-d03962a019f7?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'Floating Unit';

UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1585327451013-b5603988bdb7?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'White Matte';

-- ─── Rugs ───
UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1768218983339-0415a4ca932d?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'Dhurrie Handwoven Rug';

UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1762280237553-e58441808e0c?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'Jute Rug';

UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1768218983339-0415a4ca932d?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'Wool Kilim';

-- ─── Lamps ───
UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1619992525255-3bed3879b0d6?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'Brass Arc Floor Lamp';

UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1767979066193-83dffc4a4f3e?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'Rattan Table Lamp';

UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1767979066193-83dffc4a4f3e?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'Marble Base Lamp';

-- ─── Beds ───
UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1745573674151-c51aa29fc9ac?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'King Platform Bed';

UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1638277054972-b6533f24ea15?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'Queen Sleigh Bed';

UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1718636268253-d6ad2a0aeee9?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'Low Platform Bed';

UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1767050371633-675072d4bed7?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'Canopy Bed';

-- ─── Wardrobes ───
UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1648475236029-9fff821a84e2?auto=format&fit=crop&w=800&q=80'
  WHERE name = '4-Door Sliding Wardrobe';

UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1648475236029-9fff821a84e2?auto=format&fit=crop&w=800&q=80'
  WHERE name = '2-Door Hinged';

UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1723259458812-9276a5a79609?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'Walk-in Frame';

-- ─── Bedside Tables / Nightstands ───
UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1549315393-aeac60e09d29?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'Walnut Bedside Table';

UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1639416550930-b78a68da1c86?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'Cane Bedside';

UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1590848689173-b8790a73b859?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'Floating Shelf';

-- ─── Bathroom Vanities ───
UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1699279764549-0a887d2c7faa?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'Marble Vanity Counter';

UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1679600270131-87a3a4106986?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'Wooden Vanity';

UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1765278954186-ccbe4f2b78a9?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'Concrete Basin';

-- ─── Mirrors ───
UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1644916925115-97ef330ab793?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'Backlit LED Mirror';

UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1771681278446-6f8eb0c7323f?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'Round Brass Mirror';

UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1673922832859-579b2ca12826?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'Tinted Full-Length';

-- ─── Towel Rails ───
UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1608651061499-ff031fbf6645?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'Heated Towel Rail';

UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1595182939836-5d4ba24ae7bf?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'Classic Towel Bar';

UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1593069384905-41d812985992?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'Freestanding Rail';

-- ─── Kitchen Counters ───
UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1560562125-ab512e4d9d29?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'Quartz Island Counter';

UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1666013942797-9daa4b8b3b4f?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'Butcher Block';

UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1628977614615-f5f4068361ed?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'Granite Counter';

-- ─── Kitchen Cabinets ───
UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1656646523508-3a9f563fa853?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'Modular Upper Cabinet';

UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1656646523508-3a9f563fa853?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'Open Shelf Unit';

UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1728502360337-8de08e99b085?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'Glass-front Cabinet';

-- ─── Bar Stools ───
UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1576682898753-56c05515ce26?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'Counter Bar Stool';

UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1516650556972-e9904734f467?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'Rattan Bar Stool';

UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1571624436174-10278fda2531?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'Backless Counter Stool';

-- ─── Pendant Lights ───
UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1768320912065-78aac5927678?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'Rattan Pendant Light';

UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1687089376969-291569ffe9fd?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'Industrial Pendant';

UPDATE lb_products SET image_url = 'https://images.unsplash.com/photo-1722286031471-9b2970f17af6?auto=format&fit=crop&w=800&q=80'
  WHERE name = 'Ceramic Globe';


-- ══════════════════════════════════════════════════════════════════════
-- Verify: should return 24 looks + 51 products all with non-null urls
-- ══════════════════════════════════════════════════════════════════════
SELECT 'lb_looks'    AS tbl, COUNT(*) AS total, COUNT(image_url) AS with_image FROM lb_looks
UNION ALL
SELECT 'lb_products' AS tbl, COUNT(*) AS total, COUNT(image_url) AS with_image FROM lb_products;
