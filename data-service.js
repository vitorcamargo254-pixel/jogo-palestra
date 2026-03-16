(function () {
  const config = window.APP_CONFIG || {};
  let supabaseClient = null;

  function getEventIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return (params.get("evento") || "microkids-palestra").trim();
  }

  function getMomentFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return (params.get("momento") || "1").trim();
  }

  function getMaxPhaseFromUrl(totalPhases) {
    const params = new URLSearchParams(window.location.search);
    const explicitMax = Number(params.get("max"));
    if (Number.isFinite(explicitMax) && explicitMax > 0) {
      return Math.min(totalPhases, explicitMax);
    }
    const moment = getMomentFromUrl();
    const map = config.momentPhaseMap || { "1": 4, "2": 7, "3": totalPhases };
    const max = Number(map[moment] || totalPhases);
    return Math.max(1, Math.min(totalPhases, max));
  }

  function getMode() {
    return config.storageMode === "supabase" ? "supabase" : "local";
  }

  function ensureSupabase() {
    if (supabaseClient) return supabaseClient;
    if (!window.supabase || !config.supabaseUrl || !config.supabaseAnonKey) return null;
    supabaseClient = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
    return supabaseClient;
  }

  function localKey(eventId) {
    return `jogo-respostas-${eventId}`;
  }

  async function saveResponse(payload) {
    if (getMode() === "supabase") {
      const client = ensureSupabase();
      if (!client) throw new Error("Supabase nao configurado.");
      const { error } = await client.from("responses").insert({
        event_id: payload.eventId,
        participant_name: payload.participantName,
        phase_id: payload.phaseId,
        answer_type: payload.answerType,
        answer_text: payload.answerText || null,
        file_name: payload.fileName || null
      });
      if (error) throw error;
      return;
    }

    const key = localKey(payload.eventId);
    const list = JSON.parse(localStorage.getItem(key) || "[]");
    list.push({
      event_id: payload.eventId,
      participant_name: payload.participantName,
      phase_id: payload.phaseId,
      answer_type: payload.answerType,
      answer_text: payload.answerText || "",
      file_name: payload.fileName || "",
      created_at: new Date().toISOString()
    });
    localStorage.setItem(key, JSON.stringify(list));
  }

  async function listResponses(eventId) {
    if (getMode() === "supabase") {
      const client = ensureSupabase();
      if (!client) throw new Error("Supabase nao configurado.");
      const { data, error } = await client
        .from("responses")
        .select("*")
        .eq("event_id", eventId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    }

    return JSON.parse(localStorage.getItem(localKey(eventId)) || "[]").reverse();
  }

  window.DataService = {
    getMode,
    getEventIdFromUrl,
    getMomentFromUrl,
    getMaxPhaseFromUrl,
    saveResponse,
    listResponses
  };
})();
