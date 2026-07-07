// middleware.js na raiz do projeto
export const config = {
  matcher: '/',
};

export default function middleware(req) {
  const url = new URL(req.url);
  
  // 1. Pega os cookies do header manualmente
  const cookieHeader = req.headers.get('cookie') || '';
  let bucket = cookieHeader.match(/ab-test-bucket=([^;]+)/)?.[1];

  // 2. Se não houver cookie, sorteia uma versão (50/50)
  if (!bucket) {
    bucket = Math.random() < 0.5 ? 'a' : 'b';
  }

  // 3. Define o caminho interno baseado no balde sorteado
  // O Vercel reconhece a pasta 'public' automaticamente no deploy
  const targetPath = bucket === 'b' ? '/index-b.html' : '/index.html';
  
  // 4. Executa o Rewrite interno (mantém a URL amigável)
  const rewriteUrl = new URL(targetPath, req.url);
  const res = new Response(null, {
    headers: {
      'x-middleware-rewrite': rewriteUrl.toString(),
    },
  });

  // 5. Garante que o cookie seja setado no navegador se for a primeira visita
  if (!cookieHeader.includes('ab-test-bucket')) {
    res.headers.append('Set-Cookie', `ab-test-bucket=${bucket}; Path=/; Max-Age=2592000`);
  }

  return res;
}