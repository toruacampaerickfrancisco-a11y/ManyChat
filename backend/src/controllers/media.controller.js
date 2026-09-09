const fs = require('fs');
const path = require('path');
const multer = require('multer');

const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de almacenamiento multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E4);
    cb(null, `${cleanName}_${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 } // Hasta 100MB (para videos de alta calidad)
});

// Listar todos los archivos multimedia disponibles
async function getMediaList(req, res) {
  try {
    const files = [];
    
    // 1. Archivos en /public/uploads
    if (fs.existsSync(uploadDir)) {
      const items = fs.readdirSync(uploadDir);
      for (const item of items) {
        const fullPath = path.join(uploadDir, item);
        const stats = fs.statSync(fullPath);
        if (stats.isFile()) {
          const ext = path.extname(item).toLowerCase();
          let type = 'document';
          if (['.mp4', '.mov', '.webm', '.avi'].includes(ext)) type = 'video';
          else if (['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'].includes(ext)) type = 'image';
          else if (['.mp3', '.ogg', '.wav', '.m4a'].includes(ext)) type = 'audio';
          else if (['.pdf'].includes(ext)) type = 'pdf';

          files.push({
            id: item,
            filename: item,
            name: item.split('_')[0] + ext,
            url: `/uploads/${item}`,
            sizeBytes: stats.size,
            sizeFormatted: (stats.size / (1024 * 1024)).toFixed(2) + ' MB',
            type,
            ext,
            createdAt: stats.birthtime || stats.mtime
          });
        }
      }
    }

    // 2. Incluir el video oficial de Nikola si existe
    const nikolaPath = path.join(__dirname, '../../Avatar_Torre_CFE_Completo/nikola_bienvenida.mp4');
    const altNikolaPath = path.join(__dirname, '../generated_videos/nikola_bienvenida.mp4');
    if (fs.existsSync(nikolaPath) || fs.existsSync(altNikolaPath)) {
      files.unshift({
        id: 'nikola_bienvenida.mp4',
        filename: 'nikola_bienvenida.mp4',
        name: 'Video Oficial de Bienvenida (Nikola)',
        url: '/avatar-torre/nikola_bienvenida.mp4',
        sizeBytes: 15 * 1024 * 1024,
        sizeFormatted: '15.4 MB',
        type: 'video',
        ext: '.mp4',
        isDefaultNikola: true,
        createdAt: new Date()
      });
    }

    res.json({ success: true, count: files.length, media: files });
  } catch (error) {
    console.error('[Media Controller GET Error]', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

// Subir un archivo
async function uploadMediaFile(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No se recibió ningún archivo' });
    }

    const file = req.file;
    const ext = path.extname(file.filename).toLowerCase();
    let type = 'document';
    if (['.mp4', '.mov', '.webm', '.avi'].includes(ext)) type = 'video';
    else if (['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'].includes(ext)) type = 'image';
    else if (['.mp3', '.ogg', '.wav', '.m4a'].includes(ext)) type = 'audio';
    else if (['.pdf'].includes(ext)) type = 'pdf';

    // Copiar también a frontend/dist/uploads y frontend/public/uploads si existen
    try {
      const distUploads = path.join(__dirname, '../../../frontend/dist/uploads');
      if (fs.existsSync(path.dirname(distUploads))) {
        if (!fs.existsSync(distUploads)) fs.mkdirSync(distUploads, { recursive: true });
        fs.copyFileSync(file.path, path.join(distUploads, file.filename));
      }
    } catch (e) {}

    res.status(201).json({
      success: true,
      file: {
        filename: file.filename,
        originalName: file.originalname,
        url: `/uploads/${file.filename}`,
        sizeBytes: file.size,
        type,
        ext
      }
    });
  } catch (error) {
    console.error('[Media Upload Error]', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

// Eliminar un archivo
async function deleteMediaFile(req, res) {
  try {
    const { filename } = req.params;
    if (!filename || filename === 'nikola_bienvenida.mp4') {
      return res.status(400).json({ success: false, error: 'No se puede eliminar el archivo del sistema' });
    }

    const filePath = path.join(uploadDir, path.basename(filename));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ success: true, message: 'Archivo eliminado correctamente' });
  } catch (error) {
    console.error('[Media Delete Error]', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = {
  upload,
  getMediaList,
  uploadMediaFile,
  deleteMediaFile
};
