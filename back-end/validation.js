const joi = require( "joi" );

const registerValidation = (data) => {
    const schema = joi.object({
        name: joi.string()
        .min( 2 )
        .max( 30 )
        .required(),
        surname: joi.string()
        .min( 3 )
        .max( 30 )
        .required(),
        username: joi.string()
        .min( 3 )
        .max( 30 )
        .required(),
        email: joi.string()
        .min( 6 )
        .email()
        .required(),
        password: joi.string()
        .min( 8 )
        .required(),
    });
    return schema.validate( data );
};

module.exports.registerValidation = registerValidation;