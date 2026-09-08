const { prisma } = require('../../config/database');
const { DEFAULT_PRODUCTS } = require('../../config/constants');

async function execute(leadId, args) {
  const filtro = (args.filtroTema || '').toLowerCase();
  console.log(`[Tool: consultarCursos] Buscando con filtro: "${filtro}"`);

  let products = DEFAULT_PRODUCTS;
  try {
    if (prisma) {
      const dbProducts = await prisma.product.findMany({
        where: { is_active: true }
      });
      if (dbProducts && dbProducts.length > 0) {
        products = dbProducts;
      }
    }
  } catch (err) {
    console.warn('[Tool: consultarCursos DB Warning]', err.message);
  }

  if (filtro) {
    products = products.filter(p => 
      (p.name && p.name.toLowerCase().includes(filtro)) ||
      (p.description && p.description.toLowerCase().includes(filtro))
    );
  }

  return {
    success: true,
    total: products.length,
    cursos: products.map(p => ({
      titulo: p.name || p.titulo,
      precio: `$${p.price} MXN`,
      descripcion: p.description || p.descripcion,
      enlace: p.link || p.url || p.enlace
    }))
  };
}

module.exports = { execute };
