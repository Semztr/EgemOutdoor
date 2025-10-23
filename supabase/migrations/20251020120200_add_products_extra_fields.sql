-- Add missing columns to public.products used by the app
-- Safe-guard with IF NOT EXISTS to make migration idempotent on re-runs

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS featured BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS color_options TEXT[],
  ADD COLUMN IF NOT EXISTS extra_images TEXT[],
  ADD COLUMN IF NOT EXISTS features JSONB;

-- Optional: simple check constraints could be added later if needed
-- e.g., ensure price >= 0, stock_quantity >= 0
