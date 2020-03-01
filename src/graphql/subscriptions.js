/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateDeviceConfiguration = /* GraphQL */ `
  subscription OnCreateDeviceConfiguration($device_id: String) {
    onCreateDeviceConfiguration(device_id: $device_id) {
      device_id
      name
      connected
      current_trip
      ip_address
    }
  }
`;
export const onUpdateDeviceConfiguration = /* GraphQL */ `
  subscription OnUpdateDeviceConfiguration($device_id: String) {
    onUpdateDeviceConfiguration(device_id: $device_id) {
      device_id
      name
      connected
      current_trip
      ip_address
    }
  }
`;
export const onDeleteDeviceConfiguration = /* GraphQL */ `
  subscription OnDeleteDeviceConfiguration($device_id: String) {
    onDeleteDeviceConfiguration(device_id: $device_id) {
      device_id
      name
      connected
      current_trip
      ip_address
    }
  }
`;
