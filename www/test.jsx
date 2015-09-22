
'use strict';

window.device = {
  uuid: 1234,
  platform: 'browser'
};

require('fontawesome/css/font-awesome.min');
require('bootstrap/dist/css/bootstrap.min');

// Promise = require('bluebird');
var React = require('react');
var Player = require('player/components/Player');
var PlayerStoreMock = require('player/stores/PlayerStore');
var ControlPanel = require('core/components/ControlPanel');


React.render(
  <Player/>,
  document.getElementById('render-target')
);

var controls = [
  {
    click: function() {
      var player = PlayerStoreMock.mockData.player;
      PlayerStoreMock.mockData.player = player.set('dead', !player.get('dead'));
      this.name = PlayerStoreMock.mockData.player.get('dead') ? 'Alive' : 'Dead';
      PlayerStoreMock.emitChange();
    },
    name: "Dead"
  }
];

React.render(
  <ControlPanel controls={controls}/>,
  document.getElementById('control-panel')
);

// playerSettings.on('change:moveSpeed', function() {
//   return $('#css-class').text(player.$el.attr('class'));
// });
//
// animation = function() {
//   return Promise.delay(2000).then(function() {
//     return playerSettings.set('moveSpeed', 1);
//   }).delay(2000).then(function() {
//     return playerSettings.set('moveSpeed', 2);
//   }).delay(2000).then(function() {
//     playerSettings.set('moveSpeed', 0);
//     return animation();
//   })["catch"](function(e) {
//     return console.log(e);
//   });
// };
//
// animation();
