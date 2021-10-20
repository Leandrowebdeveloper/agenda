const bcryptjs = require('bcryptjs');
/**
* #### @name empty
* #### @class Help
* #### @readonly Verifica se o objeto javascript esta vazio 
* #### @param {*} obj {}
* #### @type boolean 
* #### @returns 
*/
exports.empty = (obj) => {
   let prop;
   for (prop in obj) {
       if (obj.hasOwnProperty(prop)) {
           return false;
       }
   }
   return true;
}

 /**
     * @name bcrypt
     * @class Help 
     * @readonly Criptografa dados tipo senha
     * @param data string
     * @returns 
     */
module.exports.bcrypt = (data) => {
    const salt = bcryptjs.genSaltSync(10);
    return bcryptjs.hashSync(data, salt);
}

/**
 * @name bcryptCompare
 * @class Help 
 * @param reqPass requerido senha  
 * @param dbPass senha do banco de dados
 * @returns 
 */
module.exports.bcryptCompare = (reqPass, dbPass) => {
    return bcryptjs.compareSync(reqPass, dbPass);
}
