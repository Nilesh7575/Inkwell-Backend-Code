const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req,file,cb){
        cb(null,'/files/application')
    },
    filename: function(req,file,cb){
        const extArray = file.originalname.split('.');
        const ext = extArray[extArray.length - 1];
        cb(null,`${req.body.menuName}.${ext}`);
    }
})

const fileFilter = (req,file,cb) => {
    if(file.mimetype === 'jpeg' || file.mimetype === 'png' || file.mimetype === 'jpg'){
        cb(null,true);
    }
    cb('File should be jpeg,jpg or png',false)
}

exports.uploadSingle = multer({storage: storage,fileFilter: fileFilter,fileSize: 1024}).single("menuIcon");
exports.uploadArray = multer({storage: storage,fileFilter: fileFilter,fileSize: 3072}).array('image',5);