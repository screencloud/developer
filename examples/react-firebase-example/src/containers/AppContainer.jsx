import React, { PureComponent } from "react";
import SlideShow from "../components/slide-show/SlideShow";

const SLIDE_DURATION_MS = 10000; //10 seconds

export class AppContainer extends PureComponent {
    intervalId;
    constructor(props) {
        super(props);

        this.state = {
            currentSlideIndex: 0,
        };
    }

    componentDidMount() {
        if (this.props.appStarted) {
            if (this.intervalId) {
                clearInterval(this.intervalId);
            }
            this.intervalId = window.setInterval(this.changeSlide, SLIDE_DURATION_MS);
        }
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.appStarted && this.props.appStarted) {
            if (this.intervalId) {
                clearInterval(this.intervalId);
            }
            this.intervalId = window.setInterval(this.changeSlide, SLIDE_DURATION_MS);
        }

        if (prevProps.data.length !== this.props.data.length) {
            const { currentSlideIndex } = this.state;

            if (currentSlideIndex >= this.props.data.length) {
                this.setState({
                    currentSlideIndex: 0
                });
            }
        }
    }

    changeSlide = () => {
        const { currentSlideIndex } = this.state;
        if (currentSlideIndex === this.props.data.length - 1) {
            this.setState({
                currentSlideIndex: 0
            });
        } else {
            this.setState({
                currentSlideIndex: currentSlideIndex + 1
            });
        }
    };

    render() {
        return (
            <>
                <div className="app-container">
                    {this.props.data && this.props.data.length ? (
                        <SlideShow
                            data={this.props.data}
                            currentSelectedIndex={this.state.currentSlideIndex}
                            interval={SLIDE_DURATION_MS}
                        />
                    ) : (
                            <div className="empty-data-list">
                                <div className="empty-data-list_message" style={{ color: "#FFFFFF" }}>
                                    There is no data currently to display
                                </div>
                            </div>
                        )}
                </div>
            </>
        );
    }
}
