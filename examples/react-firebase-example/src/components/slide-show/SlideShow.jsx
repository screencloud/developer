import React from "react";
import Slide from "./Slide";


const SlideShow = (props) => {
    const { data, currentSelectedIndex } = props;
    const currentData = data[currentSelectedIndex];
    console.log(props)
    return (
        <div className={"slide-show font-body"}>
            <div className={"slide-show_holder"}>
                <Slide
                    data={currentData}
                />

            </div>
        </div>
    );
};

export default SlideShow;
