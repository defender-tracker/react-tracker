import { API, Auth } from 'aws-amplify';

function encodeQueryData(data) {
    const ret = [];
    for (let d in data)
        if (data[d] !== "") {
            ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
        }
    return ret.join('&');
}

async function callAPI(path, params) {

    var _path = path;
    const queryString = encodeQueryData(params);
    if (queryString !== "") {
        _path = path + '?' + queryString;
    }

    return await API.get(
        'duccy-rest',
        _path,
        {
            headers: {
                Authorization: `Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
            }
        }
    );
}

async function getData(path, params) {
    var _params = params;
    var _full_data = [];

    const _data = await callAPI(path, _params);

    if (_data) {
        _params.lastKey = _data.lastKey;
        _full_data = _full_data.concat(_data.items);

        while (_params.lastKey !== "") {

            const _data = await callAPI(path, _params);

            if (_data) {
                _params.lastKey = _data.lastKey;
                _full_data = _full_data.concat(_data.items);
            } else {
                break;
            }
        }
    }
    return _full_data;
}

export function getTrips() {
    return getData('/trips', {});
}

export function getDevices() {
    return getData('/devices', {});
}

export function getPositions() {
    return getData('/positions', {});
}

export function getTripPositions(_tripId) {
    return getData('/positions', { tripId: _tripId });
}

export function getDevicePositions(_deviceId) {
    return getData('/positions', { deviceId: _deviceId });
}
