import React from "react";


const ErrorMessage = ({errorMessage}) => {
        return <div className={'error-message'}>
                <span>{errorMessage}</span>
        </div>

}

export default ErrorMessage;