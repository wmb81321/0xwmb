-- IMPORTANT: Replace <SUPABASE_URL> with your actual Supabase project URL
-- e.g. https://abcdefgh.supabase.co
-- Upload all images FLAT (no subfolders) to the 'portfolio-assets' Storage bucket first.

-- Profile
insert into profile (name, title, summary, photo_url, industries) values (
  'William Martinez Bolaños',
  'Product Manager, Researcher, ETH Community Leader',
  'Experienced product manager, Researcher and community leader focused in Crypto, DeFi and AI. Proven track record understanding institutionals to explore web3 solutions. Deep technical understanding about Ethereum technologies and communities across the world. Founded 3 projects: ETH CALI to free-access web3 education, Ekinoxis to empower innovation, Convexo to enable secure and private DeFi experiences. Background in Economics, Project Management, and Corporate Finance with multilingual capabilities.',
  '<SUPABASE_URL>/storage/v1/object/public/portfolio-assets/picture.png',
  'Crypto • Blockchain • Artificial Intelligence'
);

-- Contact
insert into contact (email, whatsapp, telegram, github, linkedin, twitter, farcaster) values (
  'wmb81321@gmail.com',
  'https://wa.me/13015041248',
  'https://t.me/wmb81321',
  'https://github.com/wmb81321',
  'https://linkedin.com/in/williammartinez8',
  'https://twitter.com/0xwmb',
  'https://warpcast.com/williammartinez'
);

-- Languages
insert into languages (name, level, flag, "order") values
  ('Spanish', 'C2 - Native', '🇪🇸', 1),
  ('English', 'C1 - Advanced', '🇬🇧', 2),
  ('French', 'B1 - Intermediate', '🇫🇷', 3);

-- Experiences
insert into experiences (role, company, years, points, website, logo_url, "order") values
  ('Teacher & Mentor', 'Universidad Buenaventura de Cali', 'June 2025 - December 2025',
   ARRAY['Teaching +30 students about DeFi based on hands-on dynamic to reach a total +$4K volume','Design and implementing hands-on workshops using top EVM protocols like Uniswap, Across, Bnkr.bot, Remix, Open Zeppelin.','Focusing on Ethereum, Base, Optimism and Unichain.'],
   'https://usbcali.edu.co','<SUPABASE_URL>/storage/v1/object/public/portfolio-assets/usbcali.png', 1),
  ('Token Analyst', 'Giveth', 'Apr 2024 - Apr 2025',
   ARRAY['Audited DAO treasuries and contracts across 4 EVM-compatible chains, safeguarding millions in governance balances and ensuring transparency.','Negotiated token listings and custody integrations with 1 exchange Tier 2, +5 Market Makers, +5 DeFi bridges, and +5 wallets to improve token holders UX.','Secured reward programs based on tracking analysis to donations, avoiding recirculations of +$20,000 value in rewards given to donors.'],
   'https://giveth.io','<SUPABASE_URL>/storage/v1/object/public/portfolio-assets/giveth.png', 2),
  ('IT Project Manager', 'Corporación Talentum', 'Feb 2024 - Dec 2024',
   ARRAY['Coordinated IT teams (front-end, back-end, DevOps) to deliver 2 products: Business Intelligence system for Government Funding Programs and tokenized digital experiences within an event manager software.','Integrated tokenized assets with BI dashboards, enabling data-driven financial insights for partner organizations.'],
   'https://talentum.edu.co/es/','<SUPABASE_URL>/storage/v1/object/public/portfolio-assets/talentum.png', 3),
  ('Brand Manager', 'Manuelita', 'Sep 2021 - Aug 2022',
   ARRAY['Developing and analyzing trade marketing strategies for national clients.','CRM with HubSpot and analyzing national and international sales.','Supporting product development.'],
   'https://www.manuelita.com/','<SUPABASE_URL>/storage/v1/object/public/portfolio-assets/manuelita.png', 4);

-- Projects
insert into projects (name, role, years, brief, points, website, logo_url, socials, "order") values
  ('ETH CALI', 'Founder', '2022–Present',
   'Building Web3 adoption through partnerships with universities, enterprises, and global sponsors',
   ARRAY['Forged partnerships with 5+ universities, +10 enterprises, Local Government and global sponsors (Base, Uniswap and ETHGlobal) to expand Web3 adoption in the Colombian Pacific region.','Organized hackathons, workshops, and public goods funding rounds, onboarding 380+ new users into Ethereum and financing 10+ community projects.','Represented Colombia''s Pacific Region in global Ethereum initiatives, building ecosystem bridges between academia, enterprises, and developers.'],
   'https://ethcali.org','<SUPABASE_URL>/storage/v1/object/public/portfolio-assets/ethcali.png',
   '{"twitter":"https://x.com/ethcali_org","linkedin":"https://www.linkedin.com/company/eth-cali/","github":"https://github.com/orgs/ETHcali/"}'::jsonb, 1),
  ('Ekinoxis', 'Founder', '2022–Present',
   'Researching and Building tailored and open-sourced products and services based on AI, Blockchain and Crypto',
   ARRAY['Designed and shipped 6 open-sourced projects using Privy.io, ZKpassport, Chainlink, Uniswap V4.','Advised 5 Corporate executives about solutions based on ethereum technologies.','Delivered 3 end-to-end ethereum-based solutions for corporates and SMEs.'],
   'https://ekinoxis.xyz','<SUPABASE_URL>/storage/v1/object/public/portfolio-assets/ekinoxis.png',
   '{"twitter":"https://x.com/ekinoxis","linkedin":"https://www.linkedin.com/company/ekinoxis-labs/","github":"https://github.com/orgs/Ekinoxis-evm/"}'::jsonb, 2),
  ('Convexo', 'Founder', '2022–Present',
   'Reducing Gap funding for SMEs in LATAm through international crypto rails with privacy-persistent ID solutions',
   ARRAY['Launching a Tokenized Identity based on ZK Passport, Veriff, Sumsub and AI Credit Scoring.','Enabling funding through creation of Electronic Loans (Vaults) and Electronic Contracts with IPFS.','Using Uniswap V4 Hooks to enable permissioned trades and liquidity provision with pools that use LATAM local stablecoin with Chainlink CCIP.'],
   'https://convexo.xyz','<SUPABASE_URL>/storage/v1/object/public/portfolio-assets/convexo.png',
   '{"twitter":"https://x.com/convexoprotocol","linkedin":"https://www.linkedin.com/company/convexo-protocol","github":"https://github.com/orgs/Convexo-finance/"}'::jsonb, 3);

-- Education
insert into education (degree, institution, years, abroad_program, logo_url, "order") values
  ('B.A. Economics & International Business', 'Universidad ICESI', '2014–2021',
   'Abroad Program: MSc Project Management & Business Development, SKEMA Business School, Paris',
   '<SUPABASE_URL>/storage/v1/object/public/portfolio-assets/icesi.png', 1),
  ('B.A. Management & International Business', 'Universidad ICESI', '2017–2021',
   'Abroad Program: MSc Corporate Finance, Montpellier Business School, Montpellier',
   '<SUPABASE_URL>/storage/v1/object/public/portfolio-assets/icesi.png', 2);

-- Certificates
insert into certificates (name, issuer, year, logo_url, "order") values
  ('Uniswap Hooks Incubator', 'Atrium Academy', 'Q3 2025','<SUPABASE_URL>/storage/v1/object/public/portfolio-assets/atrium.png', 1),
  ('Bloomberg BMC', 'Bloomberg', '2020','<SUPABASE_URL>/storage/v1/object/public/portfolio-assets/bloomberg.png', 2);

-- Volunteering
insert into volunteering (name, issuer, year, logo_url, "order") values
  ('Grantee', 'QF for Public Goods in Colombia with Privacy Scaling Explorations', '2024','<SUPABASE_URL>/storage/v1/object/public/portfolio-assets/esp.png', 1),
  ('DEVCON Volunteer', 'Ethereum Foundation – DEVCON VI (2022), DEVCON VII (2024)', '2022–2024','<SUPABASE_URL>/storage/v1/object/public/portfolio-assets/ethereumf.png', 2),
  ('DEVCONNECT Volunteer Lead', 'Ethereum Foundation – Argentina 2025', '2025','<SUPABASE_URL>/storage/v1/object/public/portfolio-assets/ethereumf.png', 3),
  ('Hackathon Finalist', 'ETHGlobal Bogotá', '2022','<SUPABASE_URL>/storage/v1/object/public/portfolio-assets/ethglobal.png', 4);

-- Skills (technical)
insert into skills (category, items, type, "order") values
  ('Programming Languages', ARRAY['JavaScript','HTML','CSS','TypeScript','Solidity','Python','SQL'], 'technical', 1),
  ('Programming Tools', ARRAY['Remix','OpenZeppelin','Vercel','Figma','VS Code','Git'], 'technical', 2),
  ('Product Management', ARRAY['Notion','Airtable','Jira','Google Workspace','Miro'], 'technical', 3),
  ('CRM & Growth', ARRAY['HubSpot','Mailchimp','Canva','Analytics'], 'technical', 4),
  ('AI Build', ARRAY['Claude Code','Cursor','V0','ChatGPT','Gemini'], 'technical', 5);

-- Skills (soft)
insert into skills (category, items, type, "order") values
  ('Business Development', ARRAY['Institutional negotiations','C-suite consulting','Deal execution','Strategic partnerships','Market expansion'], 'soft', 6),
  ('Custody & Treasury', ARRAY['DAO Governance','OTC Institutional Ramps','Compliance Frameworks','Treasury Management','Risk Management'], 'soft', 7),
  ('Blockchain & Web3', ARRAY['DeFi','Tokenization','Custody Integrations','RWA','Smart Contracts'], 'soft', 8);
