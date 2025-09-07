class Routing{
    v1(app){
        let user = require("./v1/user/route/routes")
        let admin = require("./v1/admin/route/routes")
        user(app)
        admin(app)
    }
}

module.exports = new Routing()