import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Amplify from 'aws-amplify';

import 'antd/dist/antd.css';

import awsconfig from './aws-exports'; // if you are using Amplify CLI

Amplify.configure(awsconfig);

Amplify.configure({
    Auth: {
        region: 'eu-west-2',
        userPoolId: 'eu-west-2_KHw7lGhc2',
        userPoolWebClientId: '38hoqsae3aijqpq747hbjf13o9'
    },
    API: {
        endpoints: [
            {
                name: "duccy-rest",
                endpoint: "https://9dqcy92uy2.execute-api.eu-west-2.amazonaws.com/prod"
            }
        ]
    }
});

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
