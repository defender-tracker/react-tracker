import React from 'react';
import './App.css';
import { withAuthenticator } from 'aws-amplify-react'; // or 'aws-amplify-react-native';

import { API, graphqlOperation } from 'aws-amplify';
import * as queries from './graphql/queries';

import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';

const Map = ReactMapboxGl({
  accessToken:
    ''
});

const circleStyle = {
  'circle-radius': 3,
  'circle-color': '#aa0000',
  'circle-opacity': 0.8,
  'circle-stroke-color': '#cc0000',
  'circle-stroke-width': 2,
  'circle-stroke-opacity': 1
}

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
    this.setData = this.setData.bind(this);
  }

  async getData() {
    return await API.graphql(graphqlOperation(queries.getPositionUpdates));
  }

  setData(_data) {
    this.setState({ data: _data.data.getPositionUpdates.items });
  }

  componentDidMount() {
    this.getData().then(this.setData);
  }

  render() {
    const features = this.state.data.map((item, index) => {
      return (<Feature coordinates={[item.latitude, item.longitude]} />)
    })

    return (
      <Map
      // eslint-disable-next-line
        style={"mapbox://styles/mapbox/dark-v9"}
        containerStyle={{
          height: '100vh',
          width: '100vw'
        }}
      >
        <Layer type="circle" id="marker" paint={circleStyle} >
          { features }
        </Layer>
      </Map>
    );
  }
}

export default withAuthenticator(App);