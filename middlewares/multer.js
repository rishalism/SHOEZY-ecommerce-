const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'public', 'uploads'));
  },
  filename: function (req, file, cb) {
    var ext = file.originalname.substr(file.originalname.lastIndexOf('.'));
    cb(null, Date.now() + ext);
  },
});

const upload = multer({
  storage: storage,

}
);

module.exports = upload;
