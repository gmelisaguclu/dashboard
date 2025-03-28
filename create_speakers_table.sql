-- Resmi görüntüden anlaşıldığı üzere speakers tablosu için SQL
CREATE TABLE IF NOT EXISTS speakers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_index int4,
  photo varchar,
  name varchar NOT NULL,
  title text NOT NULL,
  twitter varchar,
  linkedin varchar,
  created_at timestamptz DEFAULT now(),
  deleted_at timestamptz DEFAULT NULL
);

-- RLS politikası ekle (isteğe bağlı, güvenlik için önerilir)
ALTER TABLE speakers ENABLE ROW LEVEL SECURITY;

-- Herkese okuma izni ver
CREATE POLICY "Herkes speakers tablosunu okuyabilir" ON speakers
  FOR SELECT USING (true);
  
-- Yalnızca kimliği doğrulanmış kullanıcıların yazmasına izin ver
CREATE POLICY "Kimliği doğrulanmış kullanıcılar speakers tablosuna yazabilir" ON speakers
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  
CREATE POLICY "Kimliği doğrulanmış kullanıcılar speakers tablosunu düzenleyebilir" ON speakers
  FOR UPDATE USING (auth.role() = 'authenticated');
  
CREATE POLICY "Kimliği doğrulanmış kullanıcılar speakers tablosundan silebilir" ON speakers
  FOR DELETE USING (auth.role() = 'authenticated');

-- Anonim kullanıcıların yazmasına izin ver (geliştirme için, production'da kapatılmalı)
CREATE POLICY "Anonim kullanıcılar speakers tablosuna yazabilir" ON speakers
  FOR INSERT WITH CHECK (auth.role() = 'anon');
  
CREATE POLICY "Anonim kullanıcılar speakers tablosunu düzenleyebilir" ON speakers
  FOR UPDATE USING (auth.role() = 'anon');
  
CREATE POLICY "Anonim kullanıcılar speakers tablosundan silebilir" ON speakers
  FOR DELETE USING (auth.role() = 'anon'); 