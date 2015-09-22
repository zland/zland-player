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
 * @filedescription PlayerService handles saving and retrieving player data from localStorage to localStorage
 * TODO: put this file into zland-core
 */

'use strict';

var StatsStructure = require('core/datastructures/StatsStructure');
var PlayerStructure = require('core/datastructures/PlayerStructure');
var Immutable = require('immutable');
var _ = require('underscore');
var weaponStructures = {
  'Knife': require('core/datastructures/KnifeStructure')
};

var _player;

function updateParams(player) {
  var weapon, structure;
  player = _.extend(PlayerStructure(), player);
  for (var i in player.weapons) {
    weapon = player.weapons[i];
    if (!weaponStructures[weapon.name]) {
      throw new Error('unknown structure: ' + weapon.name);
    }
    structure = weaponStructures[weapon.name]();
    _.extend(weapon, _.pick(structure, structure.updateFields));
  }
  return player;
}

module.exports = {
  /**
   * Does player exists in localStorage?
   * @return {Boolean}
   */
  playerExistsInStorage: function() {
    return window.localStorage.getItem('player') !== null;
  },
  /**
   * loads player from local storage and updates object properties
   */
  retrievePlayer: function() {
    _player = Immutable.fromJS(updateParams(JSON.parse(window.localStorage.getItem('player'))));
  },
  /**
   * for getting player data
   * @return {Immutable.Map}
   */
  getPlayer: function() {
    return _player;
  },

  /**
   * update the player
   * @param  {Immutable.Map} player
   */
  updatePlayer: function(player) {
    _player = player;
  },

  /**
   * save the player to local storage
   */
  savePlayer: function() {
    window.localStorage.setItem('player', JSON.stringify(_player));
  },

  /**
   * creates a new player (usually done if the game starts the first time)
   * @return {Immutable.Map} player
   */
  createNewPlayer: function() {
    if (!window.device || !window.device.platform) {
      throw new Error('cannot find system');
    }
    _player = Immutable.fromJS(_.extend(PlayerStructure(), {
      stats: StatsStructure(),
      system: window.device.platform,
      weapons: [
        _.extend(weaponStructures['Knife'](), {
          selected: true
        })
      ]
    }));
    this.savePlayer();
    return _player;
  }
}
