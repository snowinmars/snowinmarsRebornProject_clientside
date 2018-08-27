var fetchAndHandle = function({ uri, data, method, onSuccess, onError }) {
    var _method;
    if (!method) {
        _method = 'POST';
    } else {
        _method = method;
    }

    var _body;
    if (method === 'GET' || method === 'HEAD') {
        uri = uri + '?' + objectToHttpQueryString(data);
        _body = undefined;
    } else {
        _body = JSON.stringify(data);
    }

    fetch(uri, {
        body: _body,
        method: _method,
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Fiddler'
        }
    })
        .catch(err => {
            console.log('Api Error : ', err);
            onError(err);
        })

        .then(response => {
            if (response && response.ok) {
                return response.json();
            }

            throw new Error('api error');
        })

        .then(json => onSuccess(json))

        .catch(err => {
            console.log('Response deserialization error : ', err);
            onError(err);
        });

    function objectToHttpQueryString(obj) {
        const keyValuePairs = [];
        for (const key in obj) {
            keyValuePairs.push(
                encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])
            );
        }
        return keyValuePairs.join('&');
    }
};

exports.fetchAndHandle = fetchAndHandle;
