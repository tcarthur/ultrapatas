import { NextResponse } from 'next/server';

export const config = {
  matcher: '/',
};

export default function middleware(req) {
  const url = req.nextUrl.clone();
  
  // 1. Verifica se já existe um cookie de teste
  let bucket = req.cookies.get('ab-test-bucket')?.value;

  // 2. Se não houver cookie, sorteia uma versão (50/50)
  if (!bucket) {
    bucket = Math.random() < 0.5 ? 'a' : 'b';
  }

  // 3. Se for a versão B, altera o caminho interno para o novo HTML
  if (bucket === 'b') {
    url.pathname = '/index-b.html';
  } else {
    url.pathname = '/index.html';
  }

  // 4. Cria a resposta
  const res = NextResponse.rewrite(url);

  // 5. Salva o cookie para manter o usuário na mesma versão
  if (!req.cookies.has('ab-test-bucket')) {
    res.cookies.set('ab-test-bucket', bucket, {
      maxAge: 60 * 60 * 24 * 30, // 30 dias
    });
  }

  return res;
}
