function ErrorMessage(message, error, data, code){
    let errorObj = {
        message: message,
        error: error,
        data: data,
        code: code
    }
    return errorObj
}


function SuccessMessage(message, success, data, code){
    let successObj = {
        message: message, 
        success: success,
        data: data,
        code: code
    }
    return successObj;
}

module.exports = {
    ErrorMessage,
    SuccessMessage
}