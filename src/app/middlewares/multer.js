const multer = require("multer");

// salvar arquivos no disco
const storage = multer.diskStorage({
  // onde será salvo
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  // Qual o nome
  filename: (req, file, cb) => {
    cb(null, `${Date.now().toString()}-${file.originalname}`);
  }
});

// Tipos de extensões aceitas
const fileFilter = (req, file, cb) => {
  const isAccepted = ["image/png", "image/jpg", "image/jpeg"].find(
    acceptedFormat => acceptedFormat == file.mimetype
  );

  if (isAccepted) {
    return cb(null, true);
  }

  return cb(null, false);
};

module.exports = multer({
  storage,
  fileFilter
});
