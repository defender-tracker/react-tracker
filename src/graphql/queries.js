/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPositionUpdates = /* GraphQL */ `
  query GetPositionUpdates(
    $filter: TableDevicePositionUpdateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getPositionUpdates(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        device_id
        timestamp
        altitude
        course
        speed
        latitude
        longitude
        geohash
        trip
      }
      nextToken
    }
  }
`;
export const getDeviceConfiguration = /* GraphQL */ `
  query GetDeviceConfiguration($device_id: String!) {
    getDeviceConfiguration(device_id: $device_id) {
      device_id
      name
      connected
      current_trip
      last_update
      ip_address
    }
  }
`;
export const getTrips = /* GraphQL */ `
  query GetTrips(
    $filter: TableDevicePositionUpdateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTrips(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        trip_id
        name
        description
      }
      nextToken
    }
  }
`;
export const listDeviceConfigurations = /* GraphQL */ `
  query ListDeviceConfigurations(
    $filter: TableDeviceConfigurationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDeviceConfigurations(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        device_id
        name
        connected
        current_trip
        ip_address
      }
      nextToken
    }
  }
`;
