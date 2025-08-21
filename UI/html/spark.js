/*
---------------------------------------------------
SPARK & LVC Javascript
---------------------------------------------------
SPARK Modifications by AgentBUB
LVC Base by TrevorBarns
---------------------------------------------------
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
---------------------------------------------------
*/

var time_folder = 'day/';
var ta_pattern = 'ta/pattern_3/';
var audioPlayer = null;
var soundID = 0;
var scale = 0.5;
var pos1 = 0,
	pos2 = 0,
	pos3 = 0,
	pos4 = 0;
var controller = undefined;

var makeTaFlash = false;
var makeTaFlashPathfinder = false;
var makeTaFlash3Z = false;
var makeTaFlash3ZRight = false;
var makeTaFlash3ZLeft = false;
var makeTaFlashMatrix = false;

const elements = {
	sirenbox: document.getElementById('sirenbox'),
	lswitch: document.getElementById('slide'),
	siren: document.getElementById('siren'),
	horn: document.getElementById('horn'),
	tkd: document.getElementById('tkd'),
	lock: document.getElementById('lock'),
	ta: document.getElementById('ta'),

	'whelen-gw': document.getElementById('whelen-gw'),
	'whelen-skeet': document.getElementById('whelen-skeet'),
	arrow: document.getElementById('arrow'),
	pathfinder: document.getElementById('pathfinder'),
	cencom: document.getElementById('cencom'),
	zthree: document.getElementById('zthree'),
	matrix: document.getElementById('matrix'),
	'matrix-bat': document.getElementById('matrix-bat'),
	'matrix-extras': document.getElementById('matrix-extras'),
};

window.addEventListener('message', function (event) {
	var type = event.data._type;
	if (type == 'audio') {
		playSound(event.data.file, event.data.volume);
	} else if (type == 'setResourceName') {
		resourceName = event.data.name;
	} else if (type == 'hud:setItemState') {
		var item = event.data.item;
		var state = event.data.state;
		controller = event.data?.controller;

		switch (item) {
			case 'hud':
				if (
					state == true &&
					controller !== 'default' &&
					controller !== undefined
				) {
					elements[controller].style.display = 'inline';
				} else if (
					state == false &&
					controller !== 'default' &&
					controller !== undefined
				) {
					elements[controller].style.display = 'none';
				} else if (state == true) {
					elements.sirenbox.style.display = 'inline';
				} else {
					elements.sirenbox.style.display = 'none';
				}
				break;
			case 'switch':
				switch (controller) {
					case 'whelen-gw':
						if (state == true) {
							$('#Stage_3').show();
							$('#Stage_0').hide();
						} else {
							$('#Stage_3').hide();
							$('#Stage_0').show();
						}
						break;
					case 'arrow':
						if (state == true) {
							$('#Activate_1_arrow').show();
						} else {
							$('#Activate_1_arrow').hide();
						}
						break;
					case 'pathfinder':
						if (state == true) {
							$('#Stage_0_pathfinder').hide();
							$('#Stage_3_pathfinder').show();
						} else {
							$('#Stage_0_pathfinder').show();
							$('#Stage_3_pathfinder').hide();
						}
						break;
					case 'zthree':
						if (state == true) {
							$('#Stage_1_zthree').show();
							$('#Stage_zthree').show();
							$('#Stage_0_zthree').hide();
						} else {
							$('#Stage_1_zthree').hide();
							$('#Stage_zthree').hide();
							$('#Stage_0_zthree').show();
						}
						break;
					case 'matrix':
						if (state == true) {
							$('#Stage_1_matrix').show();
							$('#Stage_matrix').show();
							$('#Stage_0_matrix').hide();
						} else {
							$('#Stage_1_matrix').hide();
							$('#Stage_matrix').hide();
							$('#Stage_0_matrix').show();
						}
						break;
					case 'matrix-extras':
						if (state == true) {
							$('#Stage_1_matrix-extras').show();
							$('#Stage_matrix-extras').show();
							$('#Stage_0_matrix-extras').hide();
						} else {
							$('#Stage_1_matrix-extras').hide();
							$('#Stage_matrix-extras').hide();
							$('#Stage_0_matrix-extras').show();
						}
						break;
					default:
						if (state == true) {
							elements.lswitch.src =
								'../controllers/default/' + time_folder + 'slide_on.png';
						} else {
							elements.lswitch.src =
								'../controllers/default/' + time_folder + 'slide_off.png';
						}
						break;
				}
				break;
			case 'siren':
				if (state == true) {
					elements.siren.src =
						'../controllers/default/' + time_folder + 'siren_on.png';
				} else {
					elements.siren.src =
						'../controllers/default/' + time_folder + 'siren_off.png';
				}
				break;
			case 'horn':
				switch (controller) {
					case 'whelen-gw':
						if (state == true) {
							$('#Activate_8').show();
						} else {
							$('#Activate_8').hide();
						}
						break;
					case 'whelen-skeet':
						if (state == true) {
							$('#Activate_8_whelen-skeet').show();
						} else {
							$('#Activate_8_whelen-skeet').hide();
						}
					case 'whelen-skeet':
						if (state == true) {
							$('#Activate_8_whelen-skeet').show();
						} else {
							$('#Activate_8_whelen-skeet').hide();
						}
						break;
					case 'pathfinder':
						if (state == true) {
							$('#Airhorn_pathfinder').show();
						} else {
							$('#Airhorn_pathfinder').hide();
						}
						break;
					case 'cencom':
						if (state == true) {
							$('#Activate_7_cencom').show();
						} else {
							$('#Activate_7_cencom').hide();
						}
						break;
					case 'zthree':
						if (state == true) {
							$('#airhorn').show();
						} else {
							$('#airhorn').hide();
						}
						break;
					case 'matrix':
						if (state == true) {
							$('#airhorn_matrix').show();
						} else {
							$('#airhorn_matrix').hide();
						}
						break;
					case 'matrix-bat':
						if (state == true) {
							$('#airhorn_matrix-bat').show();
						} else {
							$('#airhorn_matrix-bat').hide();
						}
					case 'matrix-extras':
						if (state == true) {
							$('#airhorn_matrix-extras').show();
						} else {
							$('#airhorn_matrix-extras').hide();
						}
						break;
					default:
						if (state == true) {
							elements.horn.src =
								'../controllers/default/' + time_folder + 'horn_on.png';
						} else {
							elements.horn.src =
								'../controllers/default/' + time_folder + 'horn_off.png';
						}
						break;
				}
				break;
			case 'tkd':
				if (state == true) {
					elements.tkd.src =
						'../controllers/default/' + time_folder + 'tkd_on.png';
				} else {
					elements.tkd.src =
						'../controllers/default/' + time_folder + 'tkd_off.png';
				}
				break;
			case 'lock':
				if (state == true) {
					elements.lock.src =
						'../controllers/default/' + time_folder + 'lock_on.png';
				} else {
					elements.lock.src =
						'../controllers/default/' + time_folder + 'lock_off.png';
				}
				break;
			case 'ta':
				if (state == 1) {
					elements.ta.src =
						'../controllers/default/' + ta_pattern + 'ta_left.gif';
				} else if (state == 2) {
					elements.ta.src =
						'../controllers/default/' + ta_pattern + 'ta_right.gif';
				} else if (state == 3) {
					elements.ta.src =
						'../controllers/default/' + ta_pattern + 'ta_center.gif';
				} else if (state == 0) {
					elements.ta.src =
						'../controllers/default/' + time_folder + 'ta_off.gif';
				}
				break;
			case 'ta_pattern':
				ta_pattern = 'ta/pattern_' + state + '/';
				break;
			case 'time':
				time_folder = state + '/';
				break;
			default:
				break;
		}
	} else if (type == 'hud:setHudScale') {
		scale = event.data.scale;
		if (controller !== 'default' && controller !== undefined) {
			elements[controller].style.transform = 'scale(' + scale + ' )';
		} else {
			elements.sirenbox.style.transform = 'scale(' + scale + ' )';
		}
	} else if (type == 'hud:getHudScale') {
		sendData('hud:sendHudScale', (scale = scale));
	} else if (type == 'hud:setHudPosition') {
		try {
			if (controller !== 'default' && controller !== undefined) {
				elements[controller].style.right = event.data.pos.left;
				elements[controller].style.top = event.data.pos.top;
			} else {
				elements.sirenbox.style.left = event.data.pos.left;
				elements.sirenbox.style.top = event.data.pos.top;
			}
		} catch (error) {}
	} else if (type == 'hud:resetPosition') {
		if (controller !== 'default' && controller !== undefined) {
			elements[controller].style.left = 'unset';
			elements[controller].style.right = '1.5%';
			elements[controller].style.top = '68%';
		} else {
			elements.sirenbox.style.left = '1.5%';
			elements.sirenbox.style.top = '68%';
		}
	} else if (type == 'sparkHud') {
		switch (event.data.action) {
			case 'update_state_whelen-gw':
				switch (event.data.type) {
					case 'frontFlood':
						if (event.data.state == true) {
							$('#Activate_9').show();
						} else {
							$('#Activate_9').hide();
						}
						break;
					case 'parkpattern':
						if (event.data.state == true) {
							$('#Activate_15').show();
						} else {
							$('#Activate_15').hide();
						}
						break;
					case 'cornercruise':
						if (event.data.state == true) {
							$('#Activate_13').show();
						} else {
							$('#Activate_13').hide();
						}
						break;
					case 'cruise':
						if (event.data.state == true) {
							$('#Activate_13').show();
						} else {
							$('#Activate_13').hide();
						}
						break;
					case 'rearFlood':
						if (event.data.state == true) {
							$('#Activate_10').show();
						} else {
							$('#Activate_10').hide();
						}
						break;
					case 'frontFlood':
						if (event.data.state == true) {
							$('#Activate_9').show();
						} else {
							$('#Activate_9').hide();
						}
						break;
					case 'fullLightKill':
						if (event.data.state == true) {
							$('#Activate_12').show();
						} else {
							$('#Activate_12').hide();
						}
						break;
					case 'frontLightKill':
						if (event.data.state == true) {
							$('#Activate_14').show();
						} else {
							$('#Activate_14').hide();
						}
						break;
					case 'ppManualOverride':
						if (event.data.state == true) {
							$('#Activate_16').show();
						} else {
							$('#Activate_16').hide();
						}
						break;
					case 'twoTone':
						if (event.data.state == true) {
							$('#Activate_11').show();
						} else {
							$('#Activate_11').hide();
						}
						break;
					case 'wail':
						if (event.data.state == true) {
							$('#Activate_4').show();
						} else {
							$('#Activate_4').hide();
						}
						break;
					case 'yelp':
						if (event.data.state == true) {
							$('#Activate_5').show();
						} else {
							$('#Activate_5').hide();
						}
						break;
					case 'handsFree':
						if (event.data.state == true) {
							$('#Activate_3').show();
						} else {
							$('#Activate_3').hide();
						}
						break;
					case 't3':
						if (event.data.state == true) {
							$('#Activate_6').show();
						} else {
							$('#Activate_6').hide();
						}
						break;
					case 'manu':
						if (event.data.state == true) {
							$('#Activate_7').show();
						} else {
							$('#Activate_7').hide();
						}
						break;
					case 'standBy':
						if (event.data.state == true) {
							$('#Activate_1').show();
						} else {
							$('#Activate_1').hide();
						}
						break;
					case 'tac':
						if (event.data.state == true) {
							$('#Activate_21').show();
							makeTaFlash = true;
							flashTa(true);
						} else {
							$('#Activate_21').hide();
							makeTaFlash = false;
							flashTa(false);
						}
						break;
					default:
						break;
				}
			case 'update_state_whelen-skeet':
				switch (event.data.type) {
					case 'dvi':
						if (event.data.state == true) {
							$('#Activate_20_skeet').show();
						} else {
							$('#Activate_20_skeet').hide();
						}
						break;
					case 'parkpattern':
						if (event.data.state == true) {
							$('#Activate_14_skeet').show();
						} else {
							$('#Activate_14_skeet').hide();
						}
						break;
					case 'cruise':
						if (event.data.state == true) {
							$('#Activate_13_skeet').show();
						} else {
							$('#Activate_13_skeet').hide();
						}
						break;
					case 'rearFlood':
						if (event.data.state == true) {
							$('#Activate_10_skeet').show();
						} else {
							$('#Activate_10_skeet').hide();
						}
						break;
					case 'leftFlood':
						if (event.data.state == true) {
							$('#Activate_17_skeet').show();
						} else {
							$('#Activate_17_skeet').hide();
						}
						break;
					case 'rightFlood':
						if (event.data.state == true) {
							$('#Activate_18_skeet').show();
						} else {
							$('#Activate_18_skeet').hide();
						}
						break;
					case 'frontFlood':
						if (event.data.state == true) {
							$('#Activate_9_skeet').show();
						} else {
							$('#Activate_9_skeet').hide();
						}
						break;
					case 'fullLightKill':
						if (event.data.state == true) {
							$('#Activate_12_skeet').show();
						} else {
							$('#Activate_12_skeet').hide();
						}
						break;
					case 'ppManuOverride':
						if (event.data.state == true) {
							$('#Activate_15_skeet').show();
						} else {
							$('#Activate_15_skeet').hide();
						}
						break;
					case 'twoTone':
						if (event.data.state == true) {
							$('#Activate_11_skeet').show();
						} else {
							$('#Activate_11_skeet').hide();
						}
						break;
					case 'wail':
						if (event.data.state == true) {
							$('#Activate_4_skeet').show();
						} else {
							$('#Activate_4_skeet').hide();
						}
						break;
					case 'yelp':
						if (event.data.state == true) {
							$('#Activate_5_skeet').show();
						} else {
							$('#Activate_5_skeet').hide();
						}
						break;
					case 'handsFree':
						if (event.data.state == true) {
							$('#Activate_3_skeet').show();
						} else {
							$('#Activate_3_skeet').hide();
						}
						break;
					case 't3':
						if (event.data.state == true) {
							$('#Activate_6_skeet').show();
						} else {
							$('#Activate_6_skeet').hide();
						}
						break;
					case 'manu':
						if (event.data.state == true) {
							$('#Activate_7_skeet').show();
						} else {
							$('#Activate_7_skeet').hide();
						}
						break;
					case 'standBy':
						if (event.data.state == true) {
							$('#Activate_1_skeet').show();
						} else {
							$('#Activate_1_skeet').hide();
						}
						break;
					case 'stage1':
						if (event.data.state == true) {
							$('#Stage_1_skeet').show();
							$('#Stage_0_skeet').hide();
							$('#Stage_3_skeet').hide();
							$('#Stage_2_skeet').hide();
						} else {
							$('#Stage_1_skeet').hide();
							$('#Stage_0_skeet').show();
						}
						break;
					case 'stage2':
						if (event.data.state == true) {
							$('#Stage_2_skeet').show();
							$('#Stage_1_skeet').hide();
							$('#Stage_0_skeet').hide();
							$('#Stage_3_skeet').hide();
						} else {
							$('#Stage_2_skeet').hide();
							$('#Stage_0_skeet').show();
						}
						break;
					case 'stage3':
						if (event.data.state == true) {
							$('#Stage_3_skeet').show();
							$('#Stage_2_skeet').hide();
							$('#Stage_1_skeet').hide();
							$('#Stage_0_skeet').hide();
						} else {
							$('#Stage_3_skeet').hide();
							$('#Stage_0_skeet').show();
						}
						break;
					default:
						break;
				}
			case 'update_state_arrow':
				switch (event.data.type) {
					case 'cruise':
						if (event.data.state == true) {
							$('#Activate_7_arrow').show();
						} else {
							$('#Activate_7_arrow').hide();
						}
						break;
					case 'rearFlood':
						if (event.data.state == true) {
							$('#Activate_3_arrow').show();
						} else {
							$('#Activate_3_arrow').hide();
						}
						break;
					case 'leftFlood':
						if (event.data.state == true) {
							$('#Activate_2_arrow').show();
						} else {
							$('#Activate_2_arrow').hide();
						}
						break;
					case 'rightFlood':
						if (event.data.state == true) {
							$('#Activate_4_arrow').show();
						} else {
							$('#Activate_4_arrow').hide();
						}
						break;
					case 'fullLightKill':
						if (event.data.state == true) {
							$('#Activate_6_arrow').show();
						} else {
							$('#Activate_6_arrow').hide();
						}
						break;
					case 'frontLightKill':
						if (event.data.state == true) {
							$('#Activate_5_arrow').show();
						} else {
							$('#Activate_5_arrow').hide();
						}
						break;
					case 'standBy':
						if (event.data.state == true) {
							$('#Activate_1_arrow').show();
						} else {
							$('#Activate_1_arrow').hide();
						}
						break;
					default:
						break;
				}
			case 'update_state_pathfinder':
				switch (event.data.type) {
					case 'frontFlood':
						if (event.data.state == true) {
							$('#Flood_pathfinder').show();
						} else {
							$('#Flood_pathfinder').hide();
						}
						break;
					case 'leftFlood':
						if (event.data.state == true) {
							$('#Left_Alley_pathfinder').show();
						} else {
							$('#Left_Alley_pathfinder').hide();
						}
						break;
					case 'rightFlood':
						if (event.data.state == true) {
							$('#Right_Alley_pathfinder').show();
						} else {
							$('#Right_Alley_pathfinder').hide();
						}
						break;
					case 'wail':
						if (event.data.state == true) {
							$('#Siren_Wail_pathfinder').show();
							$('#Siren_Off_pathfinder').hide();
						} else {
							$('#Siren_Off_pathfinder').show();
							$('#Siren_Wail_pathfinder').hide();
						}
						break;
					case 'yelp':
						if (event.data.state == true) {
							$('#Siren_Yelp_pathfinder').show();
							$('#Siren_Off_pathfinder').hide();
						} else {
							$('#Siren_Off_pathfinder').show();
							$('#Siren_Yelp_pathfinder').hide();
						}
						break;
					case 'handsFree':
						if (event.data.state == true) {
							$('#Siren_Handsfree_pathfinder').show();
							$('#Siren_Off_pathfinder').hide();
						} else {
							$('#Siren_Off_pathfinder').show();
							$('#Siren_Handsfree_pathfinder').hide();
						}
						break;
					case 't3':
						if (event.data.state == true) {
							$('#Siren_T3_Priority_pathfinder').show();
							$('#Siren_Off_pathfinder').hide();
						} else {
							$('#Siren_Off_pathfinder').show();
							$('#Siren_T3_Priority_pathfinder').hide();
						}
						break;
					case 'manu':
						if (event.data.state == true) {
							$('#Siren_Manual_pathfinder').show();
						} else {
							$('#Siren_Manual_pathfinder').hide();
						}
						break;
					case 'tac':
						if (event.data.state == true) {
							$('#TA_Center_Out_pathfinder').show();
							makeTaFlashPathfinder = true;
							flashTaPath(true);
						} else {
							$('#TA_Center_Out_pathfinder').hide();
							makeTaFlashPathfinder = false;
							flashTaPath(false);
						}
						break;
					default:
						break;
				}
			case 'update_state_cencom':
				switch (event.data.type) {
					case 'wail':
						if (event.data.state == true) {
							$('#Activate_3_cencom').show();
						} else {
							$('#Activate_3_cencom').hide();
						}
						break;
					case 'yelp':
						if (event.data.state == true) {
							$('#Activate_4_cencom').show();
						} else {
							$('#Activate_4_cencom').hide();
						}
						break;
					case 't3':
						if (event.data.state == true) {
							$('#Activate_5_cencom').show();
						} else {
							$('#Activate_5_cencom').hide();
						}
						break;
					case 'manu':
						if (event.data.state == true) {
							$('#Activate_6_cencom').show();
						} else {
							$('#Activate_6_cencom').hide();
						}
						break;
					case 'standBy':
						if (event.data.state == true) {
							$('#Activate_1_cencom').show();
						} else {
							$('#Activate_1_cencom').hide();
						}
						break;
					case 'leftFlood':
						if (event.data.state == true) {
							$('#Activate_14_cencom').show();
						} else {
							$('#Activate_14_cencom').hide();
						}
						break;
					case 'rightFlood':
						if (event.data.state == true) {
							$('#Activate_15_cencom').show();
						} else {
							$('#Activate_15_cencom').hide();
						}
						break;
					case 'takeDowns':
						if (event.data.state == true) {
							$('#Activate_16_cencom').show();
						} else {
							$('#Activate_16_cencom').hide();
						}
						break;
					case 'wigwags':
						if (event.data.state == true) {
							$('#Activate_17_cencom').show();
						} else {
							$('#Activate_17_cencom').hide();
						}
						break;
					case 'stage1':
						if (event.data.state == true) {
							$('#Stage_1_cencom').show();
							$('#Stage_0_cencom').hide();
							$('#Stage_3_cencom').hide();
							$('#Stage_2_cencom').hide();
						} else {
							$('#Stage_1_cencom').hide();
							$('#Stage_0_cencom').show();
						}
						break;
					case 'stage2':
						if (event.data.state == true) {
							$('#Stage_2_cencom').show();
							$('#Stage_1_cencom').hide();
							$('#Stage_0_cencom').hide();
							$('#Stage_3_cencom').hide();
						} else {
							$('#Stage_2_cencom').hide();
							$('#Stage_0_cencom').show();
						}
						break;
					case 'stage3':
						if (event.data.state == true) {
							$('#Stage_3_cencom').show();
							$('#Stage_2_cencom').hide();
							$('#Stage_1_cencom').hide();
							$('#Stage_0_cencom').hide();
						} else {
							$('#Stage_3_cencom').hide();
							$('#Stage_0_cencom').show();
						}
						break;
					default:
						break;
				}
			case 'update_state_zthree':
				switch (event.data.type) {
					case 'cruise':
						if (event.data.state == true) {
							$('#cruiselights').show();
						} else {
							$('#cruiselights').hide();
						}
						break;
					case 'fullLightKill':
						if (event.data.state == true) {
							$('#fullkill').show();
						} else {
							$('#fullkill').hide();
						}
						break;
					case 'frontLightKill':
						if (event.data.state == true) {
							$('#fcut').show();
						} else {
							$('#fcut').hide();
						}
						break;
					case 'rearLightKill':
						if (event.data.state == true) {
							$('#rcut').show();
						} else {
							$('#rcut').hide();
						}
						break;
					case 'wail':
						if (event.data.state == true) {
							$('#wail').show();
						} else {
							$('#wail').hide();
						}
						break;
					case 'yelp':
						if (event.data.state == true) {
							$('#yelp').show();
						} else {
							$('#yelp').hide();
						}
						break;
					case 't3':
						if (event.data.state == true) {
							$('#alttone').show();
						} else {
							$('#alttone').hide();
						}
						break;
					case 'manu':
						if (event.data.state == true) {
							$('#manual').show();
						} else {
							$('#manual').hide();
						}
						break;
					case 'standBy':
						if (event.data.state == true) {
							$('#Stage_1_zthree').show();
							$('#Stage_zthree').show();
							$('#Stage_0_zthree').hide();
						} else {
							$('#Stage_1_zthree').hide();
							$('#Stage_zthree').hide();
							$('#Stage_0_zthree').show();
						}
						break;
					case 'tac':
						if (event.data.state == true) {
							$('#flash').show();
							$('#center').show();
							makeTaFlash3Z = true;
							flashTa3Z(true);
						} else {
							$('#flash').hide();
							$('#center').hide();
							makeTaFlash3Z = false;
							flashTa3Z(false);
						}
						break;
					case 'tar':
						if (event.data.state == true) {
							$('#flash').show();
							$('#right').show();
							makeTaFlash3ZRight = true;
							flashTa3ZRight(true);
						} else {
							$('#flash').hide();
							$('#right').hide();
							makeTaFlash3ZRight = false;
							flashTa3ZRight(false);
						}
						break;
					case 'tal':
						if (event.data.state == true) {
							$('#flash').show();
							$('#left').show();
							makeTaFlash3ZLeft = true;
							flashTa3ZLeft(true);
						} else {
							$('#flash').hide();
							$('#left').hide();
							makeTaFlash3ZLeft = false;
							flashTa3ZLeft(false);
						}
						break;
					case 'takeDowns':
						if (event.data.state == true) {
							$('#td').show();
						} else {
							$('#td').hide();
						}
						break;
					default:
						break;
				}
			case 'update_state_matrix':
				switch (event.data.type) {
					case 'ppManuOverride':
						if (event.data.state == true) {
							$('#override_matrix').show();
						} else {
							$('#override_matrix').hide();
						}
						break;
					case 'parkpattern':
						if (event.data.state == true) {
							$('#parkpattern_matrix').show();
						} else {
							$('#parkpattern_matrix').hide();
						}
						break;
					case 'cornercruise':
						if (event.data.state == true) {
							$('#cornercruiselights_matrix').show();
						} else {
							$('#cornercruiselights_matrix').hide();
						}
						break;
					case 'cruise':
						if (event.data.state == true) {
							$('#cruiselights_matrix').show();
						} else {
							$('#cruiselights_matrix').hide();
						}
						break;
					case 'fullLightKill':
						if (event.data.state == true) {
							$('#fullkill_matrix').show();
						} else {
							$('#fullkill_matrix').hide();
						}
						break;
					case 'wail':
						if (event.data.state == true) {
							$('#wail_matrix').show();
						} else {
							$('#wail_matrix').hide();
						}
						break;
					case 'yelp':
						if (event.data.state == true) {
							$('#yelp_matrix').show();
						} else {
							$('#yelp_matrix').hide();
						}
						break;
					case 't3':
						if (event.data.state == true) {
							$('#alttone_matrix').show();
						} else {
							$('#alttone_matrix').hide();
						}
						break;
					case 'manu':
						if (event.data.state == true) {
							$('#manual_matrix').show();
						} else {
							$('#manual_matrix').hide();
						}
						break;
					case 'standBy':
						if (event.data.state == true) {
							$('#Stage_1_matrix').show();
							$('#Stage_matrix').show();
							$('#Stage_0_matrix').hide();
						} else {
							$('#Stage_1_matrix').hide();
							$('#Stage_matrix').hide();
							$('#Stage_0_matrix').show();
						}
						break;
					case 'tac':
						if (event.data.state == true) {
							$('#flash_matrix').show();
							$('#center_matrix').show();
							makeTaFlashMatrix = true;
							flashTaMatrix(true, '');
						} else {
							$('#flash_matrix').hide();
							$('#center_matrix').hide();
							makeTaFlashMatrix = false;
							flashTaMatrix(false, '');
						}
						break;
					case 'takeDowns':
						if (event.data.state == true) {
							$('#td_matrix').show();
						} else {
							$('#td_matrix').hide();
						}
						break;
					default:
						break;
				}
			case 'update_state_matrix-bat':
				switch (event.data.type) {
					case 'frontFlood':
						if (event.data.state == true) {
							$('#cmmdlight_matrix-bat').show();
						} else {
							$('#cmmdlight_matrix-bat').hide();
						}
						break;
					case 'ppManuOverride':
						if (event.data.state == true) {
							$('#override_matrix-bat').show();
						} else {
							$('#override_matrix-bat').hide();
						}
						break;
					case 'parkpattern':
						if (event.data.state == true) {
							$('#parkpattern_matrix-bat').show();
						} else {
							$('#parkpattern_matrix-bat').hide();
						}
						break;
					case 'cornercruise':
						if (event.data.state == true) {
							$('#cornercruiselights_matrix-bat').show();
						} else {
							$('#cornercruiselights_matrix-bat').hide();
						}
						break;
					case 'cruise':
						if (event.data.state == true) {
							$('#cruiselights_matrix-bat').show();
						} else {
							$('#cruiselights_matrix-bat').hide();
						}
						break;
					case 'fullLightKill':
						if (event.data.state == true) {
							$('#fullkill_matrix-bat').show();
						} else {
							$('#fullkill_matrix-bat').hide();
						}
						break;
					case 'wail':
						if (event.data.state == true) {
							$('#wail_matrix-bat').show();
						} else {
							$('#wail_matrix-bat').hide();
						}
						break;
					case 'yelp':
						if (event.data.state == true) {
							$('#yelp_matrix-bat').show();
						} else {
							$('#yelp_matrix-bat').hide();
						}
						break;
					case 't3':
						if (event.data.state == true) {
							$('#alttone_matrix-bat').show();
						} else {
							$('#alttone_matrix-bat').hide();
						}
						break;
					case 'manu':
						if (event.data.state == true) {
							$('#manual_matrix-bat').show();
						} else {
							$('#manual_matrix-bat').hide();
						}
						break;
					case 'tac':
						if (event.data.state == true) {
							$('#flash_matrix-bat').show();
							$('#center_matrix-bat').show();
							makeTaFlashMatrix = true;
							flashTaMatrix(true, '-bat');
						} else {
							$('#flash_matrix-bat').hide();
							$('#center_matrix-bat').hide();
							makeTaFlashMatrix = false;
							flashTaMatrix(false, '-bat');
						}
						break;
					case 'stage1':
						if (event.data.state == true) {
							$('#Stage_1_matrix-bat').show();
							$('#Stage_0_matrix-bat').hide();
							$('#Stage_3_matrix-bat').hide();
							$('#Stage_2_matrix-bat').hide();
						} else {
							$('#Stage_1_matrix-bat').hide();
							$('#Stage_0_matrix-bat').show();
						}
						break;
					case 'stage2':
						if (event.data.state == true) {
							$('#Stage_2_matrix-bat').show();
							$('#Stage_1_matrix-bat').hide();
							$('#Stage_0_matrix-bat').hide();
							$('#Stage_3_matrix-bat').hide();
						} else {
							$('#Stage_2_matrix-bat').hide();
							$('#Stage_0_matrix-bat').show();
						}
						break;
					case 'stage3':
						if (event.data.state == true) {
							$('#Stage_3_matrix-bat').show();
							$('#Stage_2_matrix-bat').hide();
							$('#Stage_1_matrix-bat').hide();
							$('#Stage_0_matrix-bat').hide();
						} else {
							$('#Stage_3_matrix-bat').hide();
							$('#Stage_0_matrix-bat').show();
						}
						break;
					case 'takeDowns':
						if (event.data.state == true) {
							$('#td_matrix-bat').show();
						} else {
							$('#td_matrix-bat').hide();
						}
						break;
					default:
						break;
				}
			case 'update_state_matrix-extras':
				switch (event.data.type) {
					case 'ppManuOverride':
						if (event.data.state == true) {
							$('#override_matrix-extras').show();
						} else {
							$('#override_matrix-extras').hide();
						}
						break;
					case 'parkpattern':
						if (event.data.state == true) {
							$('#parkpattern_matrix-extras').show();
						} else {
							$('#parkpattern_matrix-extras').hide();
						}
						break;
					case 'leftFlood':
						if (event.data.state == true) {
							$('#l_flood_matrix-extras').show();
						} else {
							$('#l_flood_matrix-extras').hide();
						}
						break;
					case 'rightFlood':
						if (event.data.state == true) {
							$('#r_flood_matrix-extras').show();
						} else {
							$('#r_flood_matrix-extras').hide();
						}
						break;
					case 'rearFlood':
						if (event.data.state == true) {
							$('#rear_flood_matrix-extras').show();
						} else {
							$('#rear_flood_matrix-extras').hide();
						}
						break;
					case 'cruise':
						if (event.data.state == true) {
							$('#cruiselights_matrix-extras').show();
						} else {
							$('#cruiselights_matrix-extras').hide();
						}
						break;
					case 'fullLightKill':
						if (event.data.state == true) {
							$('#fullkill_matrix-extras').show();
						} else {
							$('#fullkill_matrix-extras').hide();
						}
						break;
					case 'wail':
						if (event.data.state == true) {
							$('#wail_matrix-extras').show();
						} else {
							$('#wail_matrix-extras').hide();
						}
						break;
					case 'yelp':
						if (event.data.state == true) {
							$('#yelp_matrix-extras').show();
						} else {
							$('#yelp_matrix-extras').hide();
						}
						break;
					case 't3':
						if (event.data.state == true) {
							$('#alttone_matrix-extras').show();
						} else {
							$('#alttone_matrix-extras').hide();
						}
						break;
					case 'manu':
						if (event.data.state == true) {
							$('#manual_matrix-extras').show();
						} else {
							$('#manual_matrix-extras').hide();
						}
						break;
					case 'standBy':
						if (event.data.state == true) {
							$('#Stage_1_matrix-extras').show();
							$('#Stage_matrix-extras').show();
							$('#Stage_0_matrix-extras').hide();
						} else {
							$('#Stage_1_matrix-extras').hide();
							$('#Stage_matrix-extras').hide();
							$('#Stage_0_matrix-extras').show();
						}
						break;
					case 'tac':
						if (event.data.state == true) {
							$('#flash_matrix-extras').show();
							$('#center_matrix-extras').show();
							makeTaFlashMatrix = true;
							flashTaMatrix(true, '-extras');
						} else {
							$('#flash_matrix-extras').hide();
							$('#center_matrix-extras').hide();
							makeTaFlashMatrix = false;
							flashTaMatrix(false, '-extras');
						}
						break;
					case 'takeDowns':
						if (event.data.state == true) {
							$('#td_matrix-extras').show();
						} else {
							$('#td_matrix-extras').hide();
						}
						break;
					default:
						break;
				}
			default:
				break;
		}
	}
});

// Exit HUD Move Mode
$(document).keyup(function (event) {
	//					Esc				Backspace				Space
	if (event.keyCode == 27 || event.keyCode == 9 || event.keyCode == 32) {
		sendData(
			'hud:setHudPositon',
			(data = {
				left:
					controller !== undefined && controller !== 'default'
						? elements[controller].style.right
						: elements.sirenbox.style.left,
				top:
					controller !== undefined && controller !== 'default'
						? elements[controller].style.top
						: elements.sirenbox.style.top,
			})
		);
		sendData('hud:setMoveState', (state = false));
	}
});

$(document).contextmenu(function () {
	sendData(
		'hud:setHudPositon',
		(data = {
			left:
				controller !== undefined && controller !== 'default'
					? elements[controller].style.right
					: elements.sirenbox.style.left,
			top:
				controller !== undefined && controller !== 'default'
					? elements[controller].style.top
					: elements.sirenbox.style.top,
		})
	);
	sendData('hud:setMoveState', (state = false));
});

// This function is used to send data back through to the LUA side
function sendData(name, data) {
	$.post('https://spark/' + name, JSON.stringify(data), function (datab) {
		if (datab != 'ok') {
			console.log(datab);
		}
	});
}

//Credit to xotikorukx playSound Fn.
function playSound(file, volume) {
	if (audioPlayer != null) {
		audioPlayer.pause();
	}

	soundID++;

	audioPlayer = new Audio('../sounds/' + file + '.ogg');
	audioPlayer.volume = volume;
	var didPlayPromise = audioPlayer.play();

	if (didPlayPromise === undefined) {
		audioPlayer = null; //The audio player crashed. Reset it so it doesn't crash the next sound.
	} else {
		didPlayPromise
			.then((_) => {
				//This does not execute until the audio is playing.
			})
			.catch((error) => {
				audioPlayer = null; //The audio player crashed. Reset it so it doesn't crash the next sound.
			});
	}
}

// Drag to move functions below.
elements.sirenbox.onmousedown = dragMouseDown;
elements['whelen-gw'].onmousedown = dragMouseDown;
elements['whelen-skeet'].onmousedown = dragMouseDown;
elements.arrow.onmousedown = dragMouseDown;
elements.pathfinder.onmousedown = dragMouseDown;
elements.cencom.onmousedown = dragMouseDown;
elements.zthree.onmousedown = dragMouseDown;
elements.matrix.onmousedown = dragMouseDown;
elements['matrix-bat'].onmousedown = dragMouseDown;
elements['matrix-extras'].onmousedown = dragMouseDown;

function dragMouseDown(e) {
	e = e || window.event;
	e.preventDefault();
	// get the mouse cursor position at startup:
	pos3 = e.clientX;
	pos4 = e.clientY;
	document.onmouseup = closeDragElement;
	// call a function whenever the cursor moves:
	document.onmousemove = elementDrag;
}

function elementDrag(e) {
	e = e || window.event;
	e.preventDefault();
	// calculate the new cursor position:
	pos1 = pos3 - e.clientX;
	pos2 = pos4 - e.clientY;
	pos3 = e.clientX;
	pos4 = e.clientY;
	// set the element's new position:
	if (controller !== undefined && controller !== 'default') {
		elements[controller].style.top =
			elements[controller].offsetTop - pos2 + 'px';
		elements[controller].style.left =
			elements[controller].offsetLeft - pos1 + 'px';
	} else {
		elements.sirenbox.style.top = elements.sirenbox.offsetTop - pos2 + 'px';
		elements.sirenbox.style.left = elements.sirenbox.offsetLeft - pos1 + 'px';
	}
}

function closeDragElement() {
	// stop moving when mouse button is released:
	document.onmouseup = null;
	document.onmousemove = null;
}

// TA Functions
function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
async function flashTa(status) {
	if (status === true) {
		while (makeTaFlash) {
			$('#3').fadeIn('fast');
			$('#4').fadeIn('fast');
			await sleep(250);
			$('#5').fadeIn('fast');
			$('#2').fadeIn('fast');
			await sleep(250);
			$('#6').fadeIn('fast');
			$('#1').fadeIn('fast');
			await sleep(250);
			$('#0').fadeIn('fast');
			$('#7').fadeIn('fast');
			await sleep(10);
			$('#3').fadeOut('fast');
			$('#4').fadeOut('fast');
			await sleep(250);
			$('#5').fadeOut('fast');
			$('#2').fadeOut('fast');
			await sleep(250);
			$('#6').fadeOut('fast');
			$('#1').fadeOut('fast');
			await sleep(250);
			$('#0').fadeOut('fast');
			$('#7').fadeOut('fast');
			await sleep(500);
		}
	} else {
		$('#0').hide();
		$('#1').hide();
		$('#2').hide();
		$('#3').hide();
		$('#4').hide();
		$('#5').hide();
		$('#6').hide();
		$('#7').hide();
	}
}

async function flashTa3Z(status) {
	if (status === true) {
		while (makeTaFlash3Z) {
			$('#3_zthree').fadeIn('fast');
			$('#4_zthree').fadeIn('fast');
			await sleep(100);
			$('#5_zthree').fadeIn('fast');
			$('#2_zthree').fadeIn('fast');
			await sleep(100);
			$('#6_zthree').fadeIn('fast');
			$('#1_zthree').fadeIn('fast');
			await sleep(100);
			$('#0_zthree').fadeIn('fast');
			$('#7_zthree').fadeIn('fast');
			await sleep(5);
			$('#3_zthree').fadeOut('fast');
			$('#4_zthree').fadeOut('fast');
			await sleep(100);
			$('#5_zthree').fadeOut('fast');
			$('#2_zthree').fadeOut('fast');
			await sleep(100);
			$('#6_zthree').fadeOut('fast');
			$('#1_zthree').fadeOut('fast');
			await sleep(100);
			$('#0_zthree').fadeOut('fast');
			$('#7_zthree').fadeOut('fast');
			await sleep(250);
			$('#0_zthree').fadeIn('fast');
			$('#7_zthree').fadeIn('fast');
			await sleep(50);
			$('#0_zthree').fadeOut('fast');
			$('#7_zthree').fadeOut('fast');
			await sleep(100);
			$('#6_zthree').fadeIn('fast');
			$('#1_zthree').fadeIn('fast');
			await sleep(50);
			$('#6_zthree').fadeOut('fast');
			$('#1_zthree').fadeOut('fast');
			await sleep(100);
			$('#5_zthree').fadeIn('fast');
			$('#2_zthree').fadeIn('fast');
			await sleep(50);
			$('#5_zthree').fadeOut('fast');
			$('#2_zthree').fadeOut('fast');
			await sleep(100);
			$('#3_zthree').fadeIn('fast');
			$('#4_zthree').fadeIn('fast');
			await sleep(50);
			$('#3_zthree').fadeOut('fast');
			$('#4_zthree').fadeOut('fast');
			await sleep(250);
		}
	} else {
		$('#0_zthree').hide();
		$('#1_zthree').hide();
		$('#2_zthree').hide();
		$('#3_zthree').hide();
		$('#4_zthree').hide();
		$('#5_zthree').hide();
		$('#6_zthree').hide();
		$('#7_zthree').hide();
	}
}
async function flashTa3ZRight(status) {
	if (status === true) {
		while (makeTaFlash3ZRight) {
			$('#7_zthree').hide();
			$('#1_zthree').fadeIn('fast');
			await sleep(50);
			$('#1_zthree').fadeOut('fast');
			await sleep(100);
			$('#2_zthree').fadeIn('fast');
			await sleep(50);
			$('#2_zthree').fadeOut('fast');
			await sleep(100);
			$('#3_zthree').fadeIn('fast');
			await sleep(50);
			$('#3_zthree').fadeOut('fast');
			await sleep(100);
			$('#4_zthree').fadeIn('fast');
			await sleep(50);
			$('#4_zthree').fadeOut('fast');
			await sleep(100);
			$('#5_zthree').fadeIn('fast');
			await sleep(50);
			$('#5_zthree').fadeOut('fast');
			await sleep(100);
			$('#6_zthree').fadeIn('fast');
			await sleep(50);
			$('#6_zthree').fadeOut('fast');
			await sleep(100);
			$('#7_zthree').fadeIn('fast');
			await sleep(5);
			$('#7_zthree').fadeOut('fast');
			await sleep(5);
			$('#7_zthree').fadeIn('fast');
			await sleep(5);
			$('#7_zthree').fadeOut('fast');
			await sleep(5);
			$('#7_zthree').fadeIn('fast');
			await sleep(5);
			$('#7_zthree').fadeOut('fast');
			await sleep(900);
		}
	} else {
		$('#0_zthree').hide();
		$('#1_zthree').hide();
		$('#2_zthree').hide();
		$('#3_zthree').hide();
		$('#4_zthree').hide();
		$('#5_zthree').hide();
		$('#6_zthree').hide();
		$('#7_zthree').hide();
	}
}
async function flashTa3ZLeft(status) {
	if (status === true) {
		while (makeTaFlash3ZLeft) {
			$('#0_zthree').hide();
			$('#6_zthree').fadeIn('fast');
			await sleep(50);
			$('#6_zthree').fadeOut('fast');
			await sleep(100);
			$('#5_zthree').fadeIn('fast');
			await sleep(50);
			$('#5_zthree').fadeOut('fast');
			await sleep(100);
			$('#4_zthree').fadeIn('fast');
			await sleep(50);
			$('#4_zthree').fadeOut('fast');
			await sleep(100);
			$('#3_zthree').fadeIn('fast');
			await sleep(50);
			$('#3_zthree').fadeOut('fast');
			await sleep(100);
			$('#2_zthree').fadeIn('fast');
			await sleep(50);
			$('#2_zthree').fadeOut('fast');
			await sleep(100);
			$('#1_zthree').fadeIn('fast');
			await sleep(50);
			$('#1_zthree').fadeOut('fast');
			await sleep(100);
			$('#0_zthree').fadeIn('fast');
			await sleep(5);
			$('#0_zthree').fadeOut('fast');
			await sleep(5);
			$('#0_zthree').fadeIn('fast');
			await sleep(5);
			$('#0_zthree').fadeOut('fast');
			await sleep(5);
			$('#0_zthree').fadeIn('fast');
			await sleep(5);
			$('#0_zthree').fadeOut('fast');
			await sleep(900);
		}
	} else {
		$('#0_zthree').hide();
		$('#1_zthree').hide();
		$('#2_zthree').hide();
		$('#3_zthree').hide();
		$('#4_zthree').hide();
		$('#5_zthree').hide();
		$('#6_zthree').hide();
		$('#7_zthree').hide();
	}
}

async function flashTaPath(status) {
	if (status === true) {
		while (makeTaFlashPathfinder) {
			$('#3_pathfinder').fadeIn('fast');
			$('#4_pathfinder').fadeIn('fast');
			await sleep(250);
			$('#3_pathfinder').fadeOut('fast');
			$('#4_pathfinder').fadeOut('fast');
			$('#5_pathfinder').fadeIn('fast');
			$('#2_pathfinder').fadeIn('fast');
			await sleep(250);
			$('#5_pathfinder').fadeOut('fast');
			$('#2_pathfinder').fadeOut('fast');
			$('#6_pathfinder').fadeIn('fast');
			$('#1_pathfinder').fadeIn('fast');
			await sleep(150);
			$('#6_pathfinder').fadeOut('fast');
			$('#1_pathfinder').fadeOut('fast');
			await sleep(10);
			$('#6_pathfinder').fadeIn('fast');
			$('#1_pathfinder').fadeIn('fast');
			await sleep(10);
			$('#6_pathfinder').fadeOut('fast');
			$('#1_pathfinder').fadeOut('fast');
			await sleep(500);
		}
	} else {
		$('#1_pathfinder').hide();
		$('#2_pathfinder').hide();
		$('#3_pathfinder').hide();
		$('#4_pathfinder').hide();
		$('#5_pathfinder').hide();
		$('#6_pathfinder').hide();
	}
}

async function flashTaMatrix(status, controller) {
	if (status === true) {
		while (makeTaFlashMatrix) {
			$(`#4_matrix${controller}`).fadeIn(`fast`);
			$(`#0_matrix${controller}`).fadeIn(`fast`);
			$(`#1_matrix${controller}`).fadeIn(`fast`);
			$(`#2_matrix${controller}`).fadeIn(`fast`);
			await sleep(20);
			$(`#0_matrix${controller}`).fadeOut(`fast`);
			$(`#1_matrix${controller}`).fadeOut(`fast`);
			$(`#2_matrix${controller}`).fadeOut(`fast`);
			$(`#3_matrix${controller}`).fadeOut(`fast`);
			await sleep(35);
			$(`#3_matrix${controller}`).fadeIn(`fast`);
			$(`#5_matrix${controller}`).fadeIn(`fast`);
			$(`#6_matrix${controller}`).fadeIn(`fast`);
			$(`#7_matrix${controller}`).fadeIn(`fast`);
			await sleep(20);
			$(`#5_matrix${controller}`).fadeOut(`fast`);
			$(`#6_matrix${controller}`).fadeOut(`fast`);
			$(`#7_matrix${controller}`).fadeOut(`fast`);
			$(`#4_matrix${controller}`).fadeOut(`fast`);
			await sleep(20);
			$(`#3_matrix${controller}`).fadeOut(`fast`);
			await sleep(35);
		}
	} else {
		$(`#0_matrix${controller}`).hide();
		$(`#1_matrix${controller}`).hide();
		$(`#2_matrix${controller}`).hide();
		$(`#3_matrix${controller}`).hide();
		$(`#4_matrix${controller}`).hide();
		$(`#5_matrix${controller}`).hide();
		$(`#6_matrix${controller}`).hide();
		$(`#7_matrix${controller}`).hide();
	}
}
