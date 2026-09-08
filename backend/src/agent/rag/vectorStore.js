const { pool } = require('../../config/database');
const { generateEmbedding } = require('./embeddings');

async function searchSimilarDocuments(query, limit = 3) {
  if (!pool) return [];

  try {
    const embedding = await generateEmbedding(query);
    if (!embedding) return [];

    const vectorStr = `[${embedding.join(',')}]`;
    const querySql = `
      SELECT id, title, category, content
      FROM "DocumentChunk"
      ORDER BY embedding <=> $1::vector
      LIMIT $2;
    `;
    const res = await pool.query(querySql, [vectorStr, limit]);
    return res.rows;
  } catch (err) {
    // Si la tabla o la extensión aún no tiene datos o pgvector, retornar array vacío silenciosamente
    return [];
  }
}

module.exports = {
  searchSimilarDocuments
};
