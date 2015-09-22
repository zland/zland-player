/*!
 * Copyright 2015 Florian Biewald
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @filedescription the player component
 */

'use strict';

require('jquery-translate3d');
require('player/sass/style');

var React = require('react');
var NavigationMixin = require('react-router').Navigation;
var PureRenderMixin = React.addons.PureRenderMixin;
var PlayerActionCreators = require('player/actions/PlayerActionCreators');
var WeaponFactory = require('weapon/components/Factory');
var GameStore = require('game/stores/GameStore');
var PlayerStore = require('player/stores/PlayerStore');
var MapStore = require('map/stores/MapStore');

var Player = React.createClass({

  mixins: [NavigationMixin],

  getStoreValues: function() {
    return {
      player: PlayerStore.getPlayer(),
      hasZombieBittenPlayer: GameStore.hasZombieBittenPlayer(),
      heading: MapStore.getMapHeading(),
      mapHeight: MapStore.getMapHeight(),
      mapWidth: MapStore.getMapWidth()
    };
  },

  getInitialState: function() {
    return this.getStoreValues();
  },

  _onChange: function() {
    this.setState(this.getStoreValues());
  },

  componentDidMount: function() {
    GameStore.addChangeListener(this._onChange);
    PlayerStore.addChangeListener(this._onChange);
    MapStore.addChangeListener(this._onChange);

    var $el = $(React.findDOMNode(this.refs.player));

    $el.css({
      top: (this.state.mapHeight / 2) - ($el.height() / 2),
      left: (this.state.mapWidth / 2) - ($el.width() / 2)
    });

    PlayerActionCreators.placed($el);
  },

  componentWillUnmount: function() {
    GameStore.removeChangeListener(this._onChange);
    PlayerStore.removeChangeListener(this._onChange);
    MapStore.removeChangeListener(this._onChange);
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    $(React.findDOMNode(this.refs.player)).translate3d({rotate: nextState.heading * -1});

    if (nextState.player.get('dead') !== this.state.player.get('dead')) {
      return true;
    }

    if (nextState.hasZombieBittenPlayer === true && this.state.hasZombieBittenPlayer === false) {
      // do something more fancy
      // like a cool blood animation here
      // that would be nice :)
      setTimeout((function() {
        PlayerActionCreators.died();
        this.transitionTo('/continue');
      }).bind(this));
      return true;
    }
    return false;
  },

  render: function() {
    console.log('--- player render');
    var cx = React.addons.classSet;
    var classes = cx({
      'player': true,
      'dead': this.state.player.get('dead')
    });

    var Weapon = WeaponFactory.create(this.state.player.get('weapons').get(this.state.player.get('selectedWeaponIndex')));
    return (
      <div className={classes} ref="player">
        {Weapon ? Weapon : null}
        <div className="left-arm"></div>
        <div className="right-arm"></div>
        <div className="left-leg"></div>
        <div className="right-leg"></div>
        <div className="torso">
          <div className="head"/>
        </div>
      </div>
    );
  }

});

module.exports = Player
