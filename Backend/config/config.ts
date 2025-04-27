import * as joi from 'joi';

interface DB_CONFIG {
    URI : string;
}

interface JWT_CONFIG {
    AT : string;
    RT : string;
    EXPAT : string;
    EXPRT: string;
}

interface CONFIG {
    PORT : number;
    DB   : DB_CONFIG;
    JWT  : JWT_CONFIG;
}

const validationSchema = joi.object({
    PORT : joi.number().port().default(3000),
    DB : joi.object({
        URI : joi.string().uri().required(),
    }),
    JWT : joi.object({
        AT : joi.string().required(),
        RT : joi.string().required(),
        EXPAT : joi.string().valid('15m', '1h', '1d').default('1d'),
        EXPRT : joi.string().valid('1h', '1d', '2d').default('1d')
    })
})

const validationOptions : joi.ValidationOptions = {
    abortEarly : false,
    stripUnknown : true,
    convert : true,
}

export const config = (): CONFIG  => {
    const env : CONFIG  = {

        PORT: joi.number().port().default(3000).validate(process.env.PORT).value,
        DB: {
            URI: process.env.DB_URI || (() => { throw new Error('DB_URI is required'); })(),
        },
        JWT: {
            AT : process.env.JWT_AT || (() => { throw new Error('AT is required'); })(),
            RT : process.env.JWT_RT || (() => { throw new Error('RT is required'); })(),
            EXPAT :  process.env.JWT_EXPIRES_IN || '1d',
            EXPRT :  process.env.RT_EXPIRES_IN || '1d',
        }
    }

    const { error, value } = validationSchema.validate(env, validationOptions);
   
    if (error) {
        const errorMessages = error.details.map(err => `${err.message}`).join('\n');
        throw new Error(`Config validation errors:\n${errorMessages}`);
    }

    return value;
  };