window.APP_CONFIG = {
  // "local" funciona sem backend (teste no mesmo dispositivo).
  // "supabase" compartilha respostas entre todos os participantes.
  storageMode: "local",

  // Preencha quando for usar Supabase:
  supabaseUrl: "",
  supabaseAnonKey: "",

  // Mapeamento dos QR Codes por momento.
  momentPhaseMap: {
    "1": 4,
    "2": 7,
    "3": 10
  }
};
