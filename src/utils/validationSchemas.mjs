export const createUserValidationSchema = {
    username: {
        isLength:{
            option:{
                min: 5,
                max: 20,
            },
            errorMessage:"Username must be at least 5 characters with a max of 32 characters",
        },
        notEmpty: {
            errorMessage:"Username cannot be empty"
        },
        isString: {
            errorMessage:"Username must be a string!"
        },
    },
    displayName: {        
        isLength:{
            option:{
                min:2,
                max:20
            },
            errorMessage:"Name be at least 2 characters with a max of 10 characters"
        },
        notEmpty:{
            errorMessage:"Name can not be empty!",
        },
        isString:{
            errorMessage:"Name must be a string!"
        }
    }
};