

function ErrorMessage(message, error, data, code){
    let result = {
        message,
        error,
        data,
        code
    }
    return result;
}

function SuccessMessage(message, error, data, code){
    let result = {
        message, 
        error,
        data,
        code
    }
    return result;
}


module.exports = {
    ErrorMessage,
    SuccessMessage
}