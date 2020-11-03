import React, { memo } from 'react';
import './slide-show.scss';

/**
 * Slide Component - here is where you create the view for the data you fetched from server. Each slide will  be shown on
 *                   on screen for the length of time you set in the AppContainer.js
 */
export const Slide = (props) => {
    const {jokeSetup, jokeAnswer, jokeType} = props.data;
    return (
        <div className={`slide`}>
            <div className={`slide_holder`}>
                <div className={`slide_holder_title`}>
                    <span className={`slide_holder_title_joke-setup`}>{jokeSetup}</span>
                </div>
                <div className={`slide_holder_body fadeIn`}>
                    <span className={`slide_holder_body_joke-answer`}>{jokeAnswer}</span>
                </div>
                <div className={`slide_holder_footer`}>
                </div>
            </div>
        </div>
    );
};

export default memo(Slide);