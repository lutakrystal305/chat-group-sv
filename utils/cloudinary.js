const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'den6tpnab',
    api_key: '938838769534869',
    api_secret: 'z0jKFj-Sgwe_4nvR1g-vZnQySnc'
})
module.exports = { cloudinary };