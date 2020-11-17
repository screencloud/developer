import React, { memo } from 'react';
import './slide-show.scss';

/**
 * Slide Component - here is where you create the view for the data you fetched from server. Each slide will  be shown on
 *                   on screen for the length of time you set in the AppContainer.js
 */

var MONTHS =["Jan","Feb","Mar","April","May","June","July","Aug","Sept","Oct","Nov","Dec"];

export const Slide = (props) => {
    const {text, creationTimestamp, creatorFullName, receiverFullName} = props.data;
    return (
        <div className={`slide`}>
            <div className={`slide_holder`}>
                <div className={`slide_holder_title`}>
                    <div className={`slide_holder_title_text`}>
                        {receiverFullName} has gotten a High Five ✋
                    </div>
                    <div className={`slide_holder_title_date`}>
                        {creationTimestamp.getDate()} {MONTHS[creationTimestamp.getMonth()]}
                    </div>
                </div>
                <div className={`slide_holder_body fadeIn`}>
                    <div className={`slide_holder_body_from`}>{creatorFullName}:</div>
                    <div className={`slide_holder_body_text`}>"{receiverFullName} {text}"</div>
                </div>
                <div className={`slide_holder_footer`}>

                </div>
            </div>
        </div>
    );
};

export default memo(Slide);