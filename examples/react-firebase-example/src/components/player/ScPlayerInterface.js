import React, {Component} from 'react';
import { connectScreenCloud } from '@screencloud/apps-sdk';

export class ScPlayerInterface extends Component {

    constructor(props) {
        super(props);
        this.state = {
            appStarted: false,
            config: null,
        };
    }

    async componentDidMount() {
        let testData;
        if (process.env.NODE_ENV === "development") {
            testData = {
                config: {

                },
            };
        }
        const sc = await connectScreenCloud(testData);
        this.setState({
            config: sc.getConfig(),
        })

        sc.onAppStarted().then(() => {
            console.log('APP STARTED!!!')
            this.setState({
                appStarted: true,
            })
        });

    }

    render() {
        return <>
            {this.props.children({appStarted: this.state.appStarted, config: this.state.config})}
        </>
    }
}