# Supabase Setup (MVP Palestra)

## 1) Criar tabela de respostas

No SQL Editor do Supabase, rode:

```sql
create table if not exists public.responses (
  id uuid primary key default gen_random_uuid(),
  event_id text not null,
  participant_name text,
  phase_id int not null,
  answer_type text not null,
  answer_text text,
  file_name text,
  created_at timestamptz not null default now()
);
```

## 2) Liberar insert/select para MVP

```sql
alter table public.responses enable row level security;

create policy "responses_insert_all"
on public.responses
for insert
to anon
with check (true);

create policy "responses_select_all"
on public.responses
for select
to anon
using (true);
```

## 3) Configurar o projeto

Edite `app-config.js`:

```js
window.APP_CONFIG = {
  storageMode: "supabase",
  supabaseUrl: "https://SEU-PROJETO.supabase.co",
  supabaseAnonKey: "SUA_ANON_KEY",
  momentPhaseMap: { "1": 4, "2": 7, "3": 10 }
};
```

## 4) Publicar

- `index.html` = jogo dos participantes
- `admin.html` = painel da sua tia (QR por momento + respostas)

URLs:
- Jogo: `.../index.html?evento=nome-do-evento&momento=1`
- Admin: `.../admin.html`
