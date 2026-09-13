-- Nombres legales oficiales en public.empresas
-- Valcron Motors Group  -> Valcron Motors Group SRL
-- 108partsdirect        -> 108 Parts Direct LLC

BEGIN;

UPDATE public.empresas
SET nombre = 'Valcron Motors Group SRL'
WHERE regexp_replace(lower(coalesce(nombre, '')), '[^a-z0-9]', '', 'g')
  IN ('valcronmotorsgroup', 'valcronmotorsgroupsrl', 'valcronmotors');

UPDATE public.empresas
SET nombre = '108 Parts Direct LLC'
WHERE regexp_replace(lower(coalesce(nombre, '')), '[^a-z0-9]', '', 'g')
  IN ('108partsdirect', '108partsdirectllc', '108parts');

INSERT INTO public.empresas (nombre)
SELECT 'Valcron Motors Group SRL'
WHERE NOT EXISTS (
  SELECT 1
  FROM public.empresas
  WHERE regexp_replace(lower(coalesce(nombre, '')), '[^a-z0-9]', '', 'g')
    IN ('valcronmotorsgroup', 'valcronmotorsgroupsrl', 'valcronmotors')
);

INSERT INTO public.empresas (nombre)
SELECT '108 Parts Direct LLC'
WHERE NOT EXISTS (
  SELECT 1
  FROM public.empresas
  WHERE regexp_replace(lower(coalesce(nombre, '')), '[^a-z0-9]', '', 'g')
    IN ('108partsdirect', '108partsdirectllc', '108parts')
);

COMMIT;
