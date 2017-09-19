/**
 * 自营mock模块 detault
 * request 
 */
var API = require('../src/service/API.js');
module.exports = {
    api: 'GET ' + API.TEST,
    response: {
        ok: {
            "code": 1,
            "message": "成功",
            'data': {
                test: 15
            }
        }
    }
}



