/**
 * Map raw IdeaHub `embedding_error` strings (including legacy long httpx traces)
 * to a short user-facing summary; keep full text for an optional details block.
 */
export function embeddingErrorDisplay(raw: string): {
  summary: string;
  technical: string | null;
} {
  const t = raw.trim();
  if (!t) {
    return { summary: "", technical: null };
  }

  const lower = t.toLowerCase();
  const deploymentMissing =
    lower.includes("deploymentnotfound") ||
    lower.includes("deployment was not found") ||
    lower.includes("azure returned 404") ||
    (lower.includes("404") &&
      (lower.includes("deployment") || lower.includes("embeddings")));

  if (deploymentMissing || t.includes("AZURE_OPENAI_EMBEDDINGS_ENDPOINT")) {
    return {
      summary:
        "Similar ideas require embeddings from Azure. The server cannot reach a valid embedding deployment (often 404: wrong deployment name or URL). An administrator needs to fix IdeaHub environment variables—especially AZURE_OPENAI_EMBEDDINGS_ENDPOINT—and ensure the deployment exists in APIM.",
      technical: t.length > 200 || /https?:\/\//.test(t) ? t : null,
    };
  }

  if (/https?:\/\//.test(t) || t.length > 280) {
    return {
      summary:
        "Embedding generation failed. See technical details if you need the exact server message.",
      technical: t,
    };
  }

  return { summary: t, technical: null };
}
