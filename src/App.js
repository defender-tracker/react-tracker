import React from 'react';
import { Icon, Menu, Drawer, Button, Checkbox } from 'antd';
import './App.css';
import { withAuthenticator } from 'aws-amplify-react'; // or 'aws-amplify-react-native';

import { API, graphqlOperation } from 'aws-amplify';
import * as queries from './graphql/queries';

import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const Map = ReactMapboxGl({
  accessToken:
    'pk.eyJ1IjoiZGFuamJyZXdlciIsImEiOiJjanlwdncxeDkwMWw0M2xydmUydWw5MGY4In0.qV2KTpM8By6smSEKpNdBJQ'
});

const circleStyle = {
  'circle-radius': 3,
  'circle-color': '#aa0000',
  'circle-opacity': 0.8,
  'circle-stroke-color': '#cc0000',
  'circle-stroke-width': 2,
  'circle-stroke-opacity': 1
}

// eslint-disable-next-line
const lineStyle = {
  'circle-radius': 3,
  'circle-color': '#aa0000',
  'circle-opacity': 0.8,
  'circle-stroke-color': '#cc0000',
  'circle-stroke-width': 2,
  'circle-stroke-opacity': 1
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      devices: [],
      filters: {
        trips: []
      },
      trips: [],
      visible: false
    };
    this.setData = this.setData.bind(this);
    this.setDevices = this.setDevices.bind(this);
  }

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  async getData() {
    return await API.graphql(graphqlOperation(queries.getPositionUpdates));
  }
  async getDevices() {
    return await API.graphql(graphqlOperation(queries.listDeviceConfigurations));
  }
  
  setDevices(_data) {
    const devices = _data.data.listDeviceConfigurations.items;
    this.setState({ devices: devices });
  }

  setData(_data) {
    const points = _data.data.getPositionUpdates.items
    this.setState(
      {
        data: points,
        bounds: [
          [
            Math.min.apply(Math, points.map(function (o) { return o.latitude; })) - 0.5,
            Math.min.apply(Math, points.map(function (o) { return o.longitude; })) - 0.5
          ],
          [
            Math.max.apply(Math, points.map(function (o) { return o.latitude; })) + 0.5,
            Math.max.apply(Math, points.map(function (o) { return o.longitude; })) + 0.5
          ]
        ],
        trips: points.map(function (o) { return o.trip; }).filter(onlyUnique)
      }
    );
  }

  componentDidMount() {
    this.getDevices().then(this.setDevices);
    this.getData().then(this.setData);
  }

  applyFilters = (filters, point) => {
    //if (filters.trips.length === 0) {
    //  return true
    //} else {
    return (filters.trips.indexOf(point.trip) > -1);
    //}
  }

  toggleDevice = (event) => {
    var _filters = this.state.filters;
    if (event.target.checked) {
      _filters.devices.push(event.target.uuid);
      this.setState({ filters: _filters });
    } else if (!event.target.checked) {
      const idx = _filters.devices.indexOf(event.target.uuid)
      _filters.devices.splice(idx, 1);
      this.setState({ filters: _filters });
    }
  }

  toggleTrip = (event) => {
    var _filters = this.state.filters;
    if (event.target.checked) {
      _filters.trips.push(event.target.uuid);
      this.setState({ filters: _filters });
    } else if (!event.target.checked) {
      const idx = _filters.trips.indexOf(event.target.uuid)
      _filters.trips.splice(idx, 1);
      this.setState({ filters: _filters });
    }
  }

  render() {

    const filteredPoints = this.state.data.filter(
      this.applyFilters.bind(
        this,
        this.state.filters
      )
    );

    const devices = this.state.devices.map((device, index) => {
      var icon = (<Icon type="close-circle" style={{ float: 'right', color: "#ff000f" }} />);
      if (device.connected) {
        icon = (<Icon type="check-circle" style={{ float: 'right', color: "#00ff0f" }} />);
      }
      return (
        <Menu.Item key={device.device_id}>
          <Checkbox onChange={null}>{device.name}</Checkbox>
          {icon}
        </Menu.Item>
      )
    });

    const features = filteredPoints.map((item, index) => {
      return (<Feature coordinates={[item.latitude, item.longitude]} />)
    });

    const trips = this.state.trips.map((item, index) => {
      var element = (
        <Checkbox onChange={this.toggleTrip} uuid={item}>{ item.name }</Checkbox>
      )
      if (!item.name) {
        element = (
          <Checkbox onChange={this.toggleTrip} uuid={item} style={{color: "#d2d2d2"}}>Unnamed Trip</Checkbox>
        )
      }
      return (
        <Menu.Item key={item}>
          {element}
        </Menu.Item>
      )
    });

    var boundingBox = [
      [
        -10.8544921875,
        49.82380908513249
      ],
      [
        2.021484375,
        59.478568831926395
      ]
    ]
    if (filteredPoints.length > 0) {
      boundingBox = [
        [
          Math.min.apply(Math, filteredPoints.map(function (o) { return o.latitude; })) - 0.5,
          Math.min.apply(Math, filteredPoints.map(function (o) { return o.longitude; })) - 0.5
        ],
        [
          Math.max.apply(Math, filteredPoints.map(function (o) { return o.latitude; })) + 0.5,
          Math.max.apply(Math, filteredPoints.map(function (o) { return o.longitude; })) + 0.5
        ]
      ]
    }

    return (
      <>
        <Drawer
          title="Basic Drawer"
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          <Menu
            style={{ height: '100%' }}
            defaultOpenKeys={['trips']}
            mode="inline"
          >


            <SubMenu
              key="trips"
              title={
              <span>
                <Icon type="environment" />
                <span>Trips</span>
              </span>
              }
            >
              {trips}
            </SubMenu>
            

            <SubMenu
              key="devices"
              title={
                <span>
                  <Icon type="compass" />
                  <span>Devices</span>
                </span>
              }
            >
              <MenuItemGroup key="g1" title="Trackers">
                {devices}
              </MenuItemGroup>
            </SubMenu>
            

            <SubMenu
              key="settings"
              title={<span><Icon type="setting" /><span>Settings</span></span>}
            >
              <Menu.Item key="9">Option 9</Menu.Item>
              <Menu.Item key="10">Option 10</Menu.Item>
              <Menu.Item key="11">Option 11</Menu.Item>
              <Menu.Item key="12">Option 12</Menu.Item>
            </SubMenu>

          </Menu>

        </Drawer>
        <Button type="primary" onClick={this.showDrawer} style={{ position: "fixed", right: "0", top: "0", margin: '1rem', zIndex: 2 }}>
          Open
        </Button>
        <Map
          // eslint-disable-next-line
          style={"mapbox://styles/danjbrewer/ck6qgwk2e4vg61ipjyrscx4bk"}
          containerStyle={{
            height: '100%',
            width: '100%'
          }}
          fitBounds={boundingBox}

        >
          <Layer type="circle" id="marker" paint={circleStyle} >
            {features}
          </Layer>
        </Map>
      </>
    );
  }
}

// eslint-disable-next-line
const graph = () => {
  return (
    <LineChart
      style={{ position: "fixed", right: "0", top: "0", margin: '1rem', zIndex: 2, backgroundColor: 'white', borderRadius: '1rem', padding: '1rem', width: '20rem', height: '15rem' }}
      width="100%"
      height="100%"
      data={this.state.data}
      margin={{
        top: 5, right: 30, left: 20, bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="timestamp" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="linear" dataKey="speed" stroke="#8884d8" />
    </LineChart>
  )
}

export default withAuthenticator(App);