const cors = require('cors');

const whitelist = ['http://127.0.0.1:5000'];
const CorsOptionDelegate = (req, callback) => {
    var option;
    if(whitelist.indexOf(req.header('Origin')) !== -1){
        option = { origin:true };
    } else {
        option = { origin:false };
    }
    callback(null, option);
} 

exports.cors = cors();
exports.CorsOptions = cors(CorsOptionDelegate);