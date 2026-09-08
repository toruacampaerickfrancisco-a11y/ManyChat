const { prisma } = require('../config/database');
const { DEFAULT_PRODUCTS } = require('../config/constants');

let inMemoryProducts = [...DEFAULT_PRODUCTS];

async function getProducts(req, res) {
  try {
    if (prisma) {
      const dbProducts = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' }
      });
      if (dbProducts && dbProducts.length > 0) {
        const formatted = dbProducts.map(p => ({
          id: p.id,
          name: p.name,
          titulo: p.name,
          description: p.description || '',
          descripcion: p.description || '',
          long_description: p.long_description || '',
          competencies: p.competencies || [],
          price: p.price,
          image_url: p.image_url || '/concurso_subestacion.png',
          imagen: p.image_url || '/concurso_subestacion.png',
          link: p.link || '#',
          url: p.link || '#',
          enlace: p.link || '#',
          is_active: p.is_active,
          status: p.is_active ? 'ACTIVO' : 'INACTIVO',
          rating: '5.0',
          valoraciones: '1',
          estudiantes: '1',
          badge: 'Curso Oficial',
          badgeColor: 'bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]',
          author: 'FRANCISCO RAMÓN GARDEA HERNÁNDEZ'
        }));

        let result = formatted;
        if (req.query.active === 'true') {
          result = result.filter(p => p.is_active === true);
        }
        return res.json(result);
      }
    }
  } catch (error) {
    console.warn('[Products Controller Warning]', error.message);
  }

  let result = inMemoryProducts;
  if (req.query.active === 'true') {
    result = result.filter(p => p.status === 'ACTIVO' || p.is_active === true);
  }
  res.json(result);
}

async function createProduct(req, res) {
  const newProd = {
    id: req.body.id || Math.random().toString(36).substring(2, 12).toUpperCase(),
    name: req.body.name || req.body.titulo || 'Nuevo Curso',
    titulo: req.body.name || req.body.titulo || 'Nuevo Curso',
    status: req.body.status || 'ACTIVO',
    is_active: req.body.status === 'ACTIVO' || req.body.is_active !== false,
    category: req.body.category || 'CURSO',
    type: req.body.type || 'DIGITAL',
    author: req.body.author || 'FRANCISCO RAMÓN GARDEA HERNÁNDEZ',
    created: new Date().toLocaleDateString('es-MX'),
    url: req.body.url || req.body.enlace || '#',
    enlace: req.body.url || req.body.enlace || '#',
    description: req.body.description || req.body.descripcion || '',
    descripcion: req.body.description || req.body.descripcion || '',
    imagen: req.body.imagen || req.body.image_url || '/concurso_subestacion.png',
    rating: req.body.rating || '5.0',
    valoraciones: '1',
    estudiantes: '1',
    badge: req.body.badge || 'Nuevo Curso',
    badgeColor: 'bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]',
    price: parseFloat(req.body.price) || 0
  };

  try {
    if (prisma) {
      const created = await prisma.product.create({
        data: {
          name: newProd.name,
          description: newProd.description,
          price: newProd.price,
          image_url: newProd.imagen,
          link: newProd.url,
          is_active: newProd.is_active
        }
      });
      newProd.id = created.id;
    }
  } catch (err) {
    console.error('[API Products POST Error]', err);
  }

  inMemoryProducts.unshift(newProd);
  res.status(201).json({ success: true, product: newProd });
}

async function updateProduct(req, res) {
  const { id } = req.params;
  const index = inMemoryProducts.findIndex(p => String(p.id) === String(id));
  
  if (index !== -1) {
    inMemoryProducts[index] = { ...inMemoryProducts[index], ...req.body };
    if (req.body.status) {
      inMemoryProducts[index].is_active = req.body.status === 'ACTIVO';
    }
    if (req.body.name) {
      inMemoryProducts[index].titulo = req.body.name;
    }
    if (req.body.description) {
      inMemoryProducts[index].descripcion = req.body.description;
    }
  }

  try {
    if (prisma && !isNaN(parseInt(id, 10))) {
      await prisma.product.update({
        where: { id: parseInt(id, 10) },
        data: {
          name: req.body.name || req.body.titulo || undefined,
          description: req.body.description || req.body.descripcion || undefined,
          price: req.body.price ? parseFloat(req.body.price) : undefined,
          is_active: req.body.is_active !== undefined ? Boolean(req.body.is_active) : undefined
        }
      });
    }
  } catch (e) {}

  res.json({ success: true, product: inMemoryProducts[index] || req.body });
}

async function deleteProduct(req, res) {
  const { id } = req.params;
  inMemoryProducts = inMemoryProducts.filter(p => String(p.id) !== String(id));
  try {
    if (prisma && !isNaN(parseInt(id, 10))) {
      await prisma.product.delete({
        where: { id: parseInt(id, 10) }
      });
    }
  } catch (e) {}
  res.json({ success: true });
}

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
};
