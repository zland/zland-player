'use strict';

var assign = require('object-assign');
var ChangeEventEmitter = require('core/ChangeEventEmitter');

module.exports = assign({}, ChangeEventEmitter, {
    getMapHeading: function() {
        return this.mockData.mapHeading;
    },
    getMapHeight: function() {
        return this.mockData.mapHeight;
    },
    getMapWidth: function() {
        return this.mockData.mapWidth;
    },

    mockData: {
        mapHeight: 450,
        mapWidth: 200,
        mapHeading: 0
    }
});
