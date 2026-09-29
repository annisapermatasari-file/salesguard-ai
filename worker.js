export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) return api(request, env, url);
    return env.ASSETS.fetch(request);
  }
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, X-Workspace',
    'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS'
  };
}

function json(data, status=200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {'Content-Type':'application/json', ...corsHeaders()}
  });
}

function workspaceFrom(request, url) {
  const h = request.headers.get('X-Workspace');
  const q = url.searchParams.get('workspace');
  const value = (h || q || 'demo').trim();
  return value.replace(/[^a-zA-Z0-9._-]/g,'-').slice(0,80) || 'demo';
}

async function api(request, env, url) {
  if (request.method === 'OPTIONS') return new Response(null,{status:204,headers:corsHeaders()});
  if (url.pathname === '/api/health') {
    let db = false;
    try { if (env.DB) { await env.DB.prepare('SELECT 1 FROM workspace_state LIMIT 1').all(); db = true; } } catch {}
    return json({ok:true,service:'SalesGuard AI',cloudflare:true,database:db});
  }
  if (url.pathname !== '/api/state') return json({error:'Not found'},404);
  if (!env.DB) return json({error:'D1 binding DB belum terpasang'},503);

  const workspace = workspaceFrom(request,url);
  if (request.method === 'GET') {
    const row = await env.DB.prepare('SELECT data_json, updated_at FROM workspace_state WHERE workspace = ?').bind(workspace).first();
    if (!row) return json({workspace, data:null, updatedAt:null});
    let data;
    try { data = JSON.parse(row.data_json); } catch { return json({error:'Stored data invalid'},500); }
    return json({workspace,data,updatedAt:row.updated_at});
  }

  if (request.method === 'PUT') {
    let body;
    try { body = await request.json(); } catch { return json({error:'Invalid JSON'},400); }
    if (!body?.data || !Array.isArray(body.data.customers) || !Array.isArray(body.data.deals)) {
      return json({error:'Invalid SalesGuard state'},400);
    }
    const dataJson = JSON.stringify(body.data);
    if (dataJson.length > 900000) return json({error:'Workspace data too large'},413);
    await env.DB.prepare(`INSERT INTO workspace_state(workspace,data_json,updated_at) VALUES(?,?,CURRENT_TIMESTAMP)
      ON CONFLICT(workspace) DO UPDATE SET data_json=excluded.data_json, updated_at=CURRENT_TIMESTAMP`)
      .bind(workspace,dataJson).run();
    return json({ok:true,workspace,updatedAt:new Date().toISOString()});
  }
  return json({error:'Method not allowed'},405);
}
