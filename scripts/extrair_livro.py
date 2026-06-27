#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
extrair_livro.py
=================

Converte um PDF de livro de RPG em um JSON estruturado (texto + capitulos)
que a pagina livros.html consegue ler e exibir com sumario navegavel + busca.

POR QUE PyMuPDF (fitz) E NAO OUTRA BIBLIOTECA:
- PDFs de RPG quase sempre usam duas colunas, caixas de texto soltas e
  elementos decorativos. PyMuPDF e a biblioteca que melhor reconstroi a
  ORDEM DE LEITURA correta nesses casos (extrai por blocos de texto com
  coordenadas, e a gente ordena esses blocos manualmente abaixo).
- Ela tambem reporta o TAMANHO DA FONTE de cada trecho, o que usamos como
  heuristica para detectar titulos de capitulo/secao (fonte grande e/ou
  negrito = provavelmente um titulo).

INSTALACAO (uma vez, no seu PC):
    pip install PyMuPDF --break-system-packages
    (no Windows normalmente basta: pip install PyMuPDF)

USO:
    python extrair_livro.py "caminho/para/Livro do Jogador.pdf" --sistema dnd5e --tipo basico

    --sistema   : dnd5e | op | tormenta | etherion  (ou outro slug que vc crie)
    --tipo      : basico | suplemento | campanha
    --titulo    : (opcional) titulo de exibicao. Se omitido, usa o nome do arquivo.
    --saida     : (opcional) pasta de saida. Default: ../assets/livros/<sistema>/

O QUE O SCRIPT FAZ:
1. Le o PDF pagina por pagina, extraindo blocos de texto na ordem de leitura.
2. Detecta titulos de capitulo comparando o tamanho da fonte de cada bloco
   com o tamanho "normal" (o mais frequente no documento = corpo de texto).
   Blocos com fonte signficativamente maior, ou em negrito e isolados numa
   linha curta, sao tratados como titulo de capitulo/secao.
3. Agrupa o texto sob cada titulo encontrado, formando uma lista de capitulos.
4. Salva um JSON com essa estrutura em assets/livros/<sistema>/<slug>.json
5. Imprime um bloco JSON pronto para voce colar no livros-index.json
   (o "catalogo" que a pagina usa pra saber quais livros existem).

LIMITACOES HONESTAS:
- A deteccao de capitulos e uma heuristica, nao e perfeita. PDFs com
  diagramacao muito artistica (titulos como imagem, por exemplo) podem nao
  ser detectados. Nesses casos o livro ainda fica 100% pesquisavel, so que
  como um unico "capitulo" grande, ou com a divisao manual que vc ajustar
  depois editando o JSON gerado.
- Tabelas complexas (tabelas de magias, itens) saem como texto corrido,
  nao como tabela. Pra a maioria dos casos de "ler e pesquisar" isso
  funciona bem, mas formatacao tabular fina se perde.
"""

import sys
import os
import re
import json
import argparse
import unicodedata
from collections import Counter

try:
    import fitz  # PyMuPDF
except ImportError:
    print("\nERRO: a biblioteca PyMuPDF nao esta instalada.")
    print("Instale com:  pip install PyMuPDF --break-system-packages\n")
    sys.exit(1)


def slugify(texto):
    """Transforma 'Livro do Jogador!' em 'livro-do-jogador' (sem acento, sem simbolo)."""
    texto = unicodedata.normalize('NFKD', texto).encode('ascii', 'ignore').decode('ascii')
    texto = texto.lower().strip()
    texto = re.sub(r'[^a-z0-9]+', '-', texto)
    texto = re.sub(r'-+', '-', texto).strip('-')
    return texto or 'livro'


def tamanho_normal_de_fonte(doc, max_paginas_amostra=30):
    """
    Descobre qual e o tamanho de fonte mais comum no documento (= corpo de
    texto padrao). Usamos isso como referencia: qualquer bloco MUITO maior
    que isso e candidato a titulo.
    """
    contagem = Counter()
    paginas_amostra = doc[:max_paginas_amostra] if len(doc) > max_paginas_amostra else doc
    for pagina in paginas_amostra:
        for bloco in pagina.get_text("dict")["blocks"]:
            if bloco.get("type") != 0:
                continue
            for linha in bloco.get("lines", []):
                for span in linha.get("spans", []):
                    tamanho = round(span["size"])
                    texto = span["text"].strip()
                    if texto:
                        # pesa pela quantidade de caracteres, pra nao deixar
                        # um titulo curto contaminar a media
                        contagem[tamanho] += len(texto)
    if not contagem:
        return 10
    return contagem.most_common(1)[0][0]


def eh_provavel_titulo(span_info, tamanho_normal):
    """
    Heuristica: um span de texto e provavel titulo de capitulo se:
    - a fonte e visivelmente maior que o corpo de texto normal (>= 1.4x), OU
    - e negrito E o texto e curto (< 80 caracteres) E nao termina em
      pontuacao de frase (., : ; ,) -- ou seja, parece um titulo, nao uma
      frase em negrito dentro do paragrafo.
    """
    texto = span_info["texto"].strip()
    if not texto or len(texto) > 120:
        return False

    fonte_maior = span_info["tamanho"] >= tamanho_normal * 1.35
    negrito = span_info["negrito"]
    parece_frase = bool(re.search(r'[.;,]\s*$', texto))

    if fonte_maior:
        return True
    if negrito and len(texto) < 80 and not parece_frase:
        return True
    return False


def extrair_blocos_da_pagina(pagina):
    """
    Extrai os blocos de texto de uma pagina, ja ordenados em ordem de
    leitura (topo->baixo, esquerda->direita), o que resolve o problema
    classico de PDF em duas colunas saindo embaralhado.
    """
    dados = pagina.get_text("dict")
    blocos_brutos = [b for b in dados["blocks"] if b.get("type") == 0]

    # ordena por coluna (x) e depois por posicao vertical (y) dentro da
    # coluna -- aproximacao simples: agrupa por "metade da pagina" em x.
    largura_pagina = pagina.rect.width
    meio = largura_pagina / 2

    def chave_ordenacao(b):
        x0 = b["bbox"][0]
        coluna = 0 if x0 < meio else 1
        y0 = b["bbox"][1]
        return (coluna, y0)

    blocos_brutos.sort(key=chave_ordenacao)

    resultado = []
    for bloco in blocos_brutos:
        linhas_texto = []
        spans_info = []
        for linha in bloco.get("lines", []):
            partes = []
            for span in linha.get("spans", []):
                texto = span["text"]
                if not texto:
                    continue
                partes.append(texto)
                spans_info.append({
                    "texto": texto,
                    "tamanho": span["size"],
                    "negrito": bool(span["flags"] & 2**4) or "Bold" in span.get("font", ""),
                })
            if partes:
                linhas_texto.append("".join(partes))
        texto_bloco = "\n".join(linhas_texto).strip()
        if texto_bloco:
            resultado.append({"texto": texto_bloco, "spans": spans_info})
    return resultado


def limpar_texto(texto):
    """Remove espacos redundantes e quebras de linha excessivas."""
    texto = re.sub(r'[ \t]+', ' ', texto)
    texto = re.sub(r'\n{3,}', '\n\n', texto)
    return texto.strip()


def extrair_pdf(caminho_pdf):
    """
    Le o PDF inteiro e devolve uma lista de capitulos:
    [{ "titulo": str, "conteudo": str, "pagina_inicio": int }, ...]
    """
    doc = fitz.open(caminho_pdf)
    tamanho_normal = tamanho_normal_de_fonte(doc)

    capitulos = []
    capitulo_atual = {"titulo": "Introducao", "conteudo": [], "pagina_inicio": 1}

    for num_pagina, pagina in enumerate(doc, start=1):
        blocos = extrair_blocos_da_pagina(pagina)
        for bloco in blocos:
            primeiro_span = bloco["spans"][0] if bloco["spans"] else None
            eh_titulo = False
            if primeiro_span and len(bloco["texto"].splitlines()) == 1:
                eh_titulo = eh_provavel_titulo(
                    {"texto": bloco["texto"], "tamanho": primeiro_span["tamanho"],
                     "negrito": primeiro_span["negrito"]},
                    tamanho_normal
                )

            if eh_titulo:
                # fecha o capitulo anterior (se tiver conteudo) e abre um novo
                if capitulo_atual["conteudo"]:
                    capitulos.append(capitulo_atual)
                capitulo_atual = {
                    "titulo": bloco["texto"].strip(),
                    "conteudo": [],
                    "pagina_inicio": num_pagina,
                }
            else:
                capitulo_atual["conteudo"].append(bloco["texto"])

    if capitulo_atual["conteudo"]:
        capitulos.append(capitulo_atual)

    doc.close()

    # junta o conteudo de cada capitulo num texto so, limpo
    capitulos_finais = []
    for cap in capitulos:
        texto_final = limpar_texto("\n\n".join(cap["conteudo"]))
        if not texto_final:
            continue
        capitulos_finais.append({
            "titulo": cap["titulo"],
            "conteudo": texto_final,
            "pagina_inicio": cap["pagina_inicio"],
        })

    # fallback: se por algum motivo nada foi detectado como capitulo
    # (PDF muito atipico), pelo menos devolve o texto todo como um bloco so,
    # em vez de devolver uma lista vazia.
    if not capitulos_finais:
        doc2 = fitz.open(caminho_pdf)
        texto_bruto = "\n\n".join(p.get_text() for p in doc2)
        doc2.close()
        capitulos_finais = [{
            "titulo": "Conteudo Completo",
            "conteudo": limpar_texto(texto_bruto),
            "pagina_inicio": 1,
        }]

    return capitulos_finais, len(doc)


def main():
    parser = argparse.ArgumentParser(description="Extrai um PDF de livro de RPG para JSON estruturado.")
    parser.add_argument("pdf", help="Caminho do arquivo PDF")
    parser.add_argument("--sistema", required=True, help="Slug do sistema: dnd5e | op | tormenta | etherion | outro")
    parser.add_argument("--tipo", required=True, choices=["basico", "suplemento", "campanha"], help="Tipo do livro")
    parser.add_argument("--titulo", default=None, help="Titulo de exibicao (default: nome do arquivo)")
    parser.add_argument("--saida", default=None, help="Pasta de saida (default: ../assets/livros/<sistema>/)")
    args = parser.parse_args()

    if not os.path.isfile(args.pdf):
        print(f"ERRO: arquivo nao encontrado: {args.pdf}")
        sys.exit(1)

    titulo = args.titulo or os.path.splitext(os.path.basename(args.pdf))[0]
    slug = slugify(titulo)

    script_dir = os.path.dirname(os.path.abspath(__file__))
    pasta_saida = args.saida or os.path.join(script_dir, "..", "assets", "livros", args.sistema)
    os.makedirs(pasta_saida, exist_ok=True)

    print(f"Lendo '{args.pdf}'... (isso pode levar alguns segundos em livros grandes)")
    capitulos, total_paginas = extrair_pdf(args.pdf)
    print(f"OK: {total_paginas} paginas lidas, {len(capitulos)} capitulos/secoes detectados.")

    livro_json = {
        "id": slug,
        "titulo": titulo,
        "sistema": args.sistema,
        "tipo": args.tipo,
        "totalPaginas": total_paginas,
        "capitulos": capitulos,
    }

    caminho_saida = os.path.join(pasta_saida, f"{slug}.json")
    with open(caminho_saida, "w", encoding="utf-8") as f:
        json.dump(livro_json, f, ensure_ascii=False, indent=2)

    print(f"\nSalvo em: {caminho_saida}")
    print("\n" + "=" * 70)
    print("Copie a entrada abaixo para dentro de assets/livros/livros-index.json")
    print("(dentro da lista do sistema correspondente):")
    print("=" * 70)
    entrada_index = {
        "id": slug,
        "titulo": titulo,
        "tipo": args.tipo,
        "arquivo": f"{args.sistema}/{slug}.json",
        "paginas": total_paginas,
    }
    print(json.dumps(entrada_index, ensure_ascii=False, indent=2))
    print("=" * 70)


if __name__ == "__main__":
    main()
