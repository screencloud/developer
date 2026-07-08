import { isEqual } from "lodash";
import React, { Component } from "react";
import superagent from "superagent";
import { AppContainer } from "../../containers/AppContainer";
import ErrorMessage from "../../components/error/ErrorMessage";
import './data-loader.scss';


/**
 * Dataloader - this component is used to fetch data for the application at a set interval.
 *              Follow the numbered comments to update this component to work as you want.
 */

// 1. Add the url to fetch the data you wish to be displayed
const FETCH_DATA_URL = 'https://official-joke-api.appspot.com/jokes/ten';


// 2. Enter the refresh interval rate here for rate at which you want your app to fetch the data. Default is 5 mins - so the app
//    will make a call to the endpoint given above every 5 minutes to get new data.
const REFRESH_RATE_MILLISECONDS = 300000;


// 3. Update this to map the response data to your view model. If you dont need to or do not wish to do any mapping and use the
//    data as is when comes back from server then just return the response. Always good practice
const mapModelToViewModel = (response) => {
    return response.map(({id, type, setup, punchline}) => {
        return {
            id,
            jokeType: type,
            jokeSetup: setup,
            jokeAnswer: punchline
        };
    });
};

const fetchAllData = async () => {
    try {
        const response = await superagent
            .get(`${FETCH_DATA_URL}`);
        return (response.body) || [];
    } catch (error) {
        console.log(error);
        throw Error("Failed to fetch images");
    }
};

class DataLoader extends Component {
    intervalId;
    constructor(props) {
        super(props);
        this.state = {
            dataIsLoading: true,
            dataLoadedWithError: false,
            data: [],
        };
    }


    async componentDidMount() {
        await this.refreshData();
        this.intervalId = window.setInterval(async () => {
            await this.refreshData();
        }, REFRESH_RATE_MILLISECONDS);
    }

    refreshData = async () => {
        try {
            console.log("refreshing data");
            const response = await fetchAllData();
            const data = mapModelToViewModel(response);

            const hasDataChanged = isEqual(data, this.state.data);

            if (hasDataChanged || this.state.dataIsLoading) {
                this.setState({
                    dataIsLoading: false,
                    data
                });
            }

        } catch (error) {
            this.handleError(error);
        }
    };

    handleError = (error) => {
        console.log(error);
        this.setState({
            dataLoadedWithError: true,
            dataIsLoading: false
        });
        console.log("clear interval");
        clearInterval(this.intervalId);
    };

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    render() {
        const { dataIsLoading, dataLoadedWithError } = this.state;

        if (dataIsLoading) {
            return (
                <div className={"data-loader"}>
                    <div className="loader" />
                </div>
            );
        }

        if (dataLoadedWithError) {
            return <ErrorMessage message={"There was an issue fetching the data for the application"}/>;
        }

        return (
            <AppContainer data={this.state.data} appStarted={this.props.appStarted} config={this.props.config} />
        );
    }
}

export default DataLoader;
