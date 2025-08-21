--[[
---------------------------------------------------
SPARK Vehicle Control (FOR FIVEM)
---------------------------------------------------
Coded by AgentBUB
With help from Sonoran Systems' Team
---------------------------------------------------
FILE: cl_spark.lua
PURPOSE: Core Functionality and User Input for SPARK
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
]]

StoB={ ["true"]=true, ["false"]=false }
local pp_from_stopping = false
local ppManualOverride = false
local validVehicle = {}
local frontLightKill = false
local rearLightKill = false
local rearFlood = false
local frontFlood = false
local leftFlood = false
local rightFlood = false
local pp = false
local wigwag = false
local wigwagOverright = false
local tar = false
local tac = false
local tal = false
local fullLightKill = false
local cruise = false
local cornerCruise = false
local driverModuleKilled = false
pedVeh = nil
lastVeh = nil
local lastSync = 0
local isStage = false
local stage = 0
local state_lx = 0
local state_pwr = 0

local function has_value (tab, val)
    for _,value in ipairs(tab) do
        if value == val then
            return true
        end
    end

    return false
end

local function extra(version, type)
	if GetPedInVehicleSeat(pedVeh, -1) == 0 then return end -- Must be driver
	if UTIL:LoadVehicleConfig(pedVeh) and UTIL:LoadVehicleConfig(pedVeh)?.extras[type] then
		if type ~= "parkpattern" then
			AUDIO:Play('Press', AUDIO.upgrade_volume)
		end
		if not UTIL:LoadVehicleConfig(pedVeh)?.repair then SetVehicleAutoRepairDisabled(pedVeh, true) end
		if version then
			for _, v in ipairs(UTIL:LoadVehicleConfig(pedVeh)?.extras[type].enabled.on) do
				SetVehicleExtra(pedVeh, v, 0)
			end
			SendNuiMessage(json.encode({_type = 'sparkHud', action = 'update_state_'..controller, state = true, type = type}))
			for _, v in ipairs(UTIL:LoadVehicleConfig(pedVeh)?.extras[type].enabled.off) do
				SetVehicleExtra(pedVeh, v, 1)
			end
		else
			for _, v in ipairs(UTIL:LoadVehicleConfig(pedVeh)?.extras[type].disabled.on) do
				SetVehicleExtra(pedVeh, v, 0)
			end
			SendNuiMessage(json.encode({_type = 'sparkHud', action = 'update_state_'..controller, state = false, type = type}))
			for _, v in ipairs(UTIL:LoadVehicleConfig(pedVeh)?.extras[type].disabled.off) do
				SetVehicleExtra(pedVeh, v, 1)
			end
		end
		SetVehicleAutoRepairDisabled(pedVeh, false)
	end
end

AddEventHandler('spark:UpdateThirdParty', function(data)
	state_lx = data.state_lxsiren
	state_pwr = data.state_pwrcall
end)

Citizen.CreateThread(function()
	for k, _ in pairs(configured_vehicles) do
		validVehicle[GetHashKey(k)] = k
	end

	while true do
		-- if state_lx ~= 0 and state_pwr ~= 0 and pedVeh ~= nil then
		-- 	SendNuiMessage(json.encode({action = 'update_state_whelen', state = true, type = 'twoTone'}))
		-- else
		-- 	SendNuiMessage(json.encode({action = 'update_state_whelen', state = false, type = 'twoTone'}))
		-- end

		if GetVehiclePedIsIn(PlayerPedId(), false) ~= 0 then
			pedVeh = GetVehiclePedIsIn(PlayerPedId(), false)
		elseif GetVehiclePedIsIn(PlayerPedId(), true) ~= 0 then
			pedVeh = GetVehiclePedIsIn(PlayerPedId(), true)
		else
			pedVeh = nil
		end
		Citizen.Wait(100)
	end
end)

Citizen.CreateThread(function()
	while true do
		if GetVehicleClass(pedVeh) == 18 and UTIL:LoadVehicleConfig(pedVeh) then
			-- Are they pressing 'r'? (Manual siren)
			if IsDisabledControlPressed(0, 80) and (state_lx == 0 or not state_lx) and (state_pwr == 0 or not state_pwr) then
				SendNuiMessage(json.encode({_type = 'sparkHud', action = 'update_state_'..controller, state = true, type = 'manu'}))
			else
				SendNuiMessage(json.encode({_type = 'sparkHud', action = 'update_state_'..controller, state = false, type = 'manu'}))
			end	
			-- Are hey in HF mode?
			-- if (state_lx == 0 or not state_lx) and (state_pwr == 0 or not state_pwr) then
			-- 	SendNuiMessage(json.encode({_type = 'sparkHud', action = 'update_state_'..controller, state = false, type = 'handsFree'}))
			-- else
			-- 	SendNuiMessage(json.encode({_type = 'sparkHud', action = 'update_state_'..controller, state = true, type = 'handsFree'}))
			-- end
			-- Is wail on?
			if state_lx == 2 or state_pwr == 2 then
				SendNuiMessage(json.encode({_type = 'sparkHud', action = 'update_state_'..controller, state = true, type = 'wail'}))
			else
				SendNuiMessage(json.encode({_type = 'sparkHud', action = 'update_state_'..controller, state = false, type = 'wail'}))
			end
			-- Is yelp on?
			if state_lx == 3 or state_pwr == 3 then
				SendNuiMessage(json.encode({_type = 'sparkHud', action = 'update_state_'..controller, state = true, type = 'yelp'}))
			else
				SendNuiMessage(json.encode({_type = 'sparkHud', action = 'update_state_'..controller, state = false, type = 'yelp'}))
			end
			-- Is T3/Prio on?
			if state_lx == 4 or state_pwr == 4 then
				SendNuiMessage(json.encode({_type = 'sparkHud', action = 'update_state_'..controller, state = true, type = 't3'}))
			else
				SendNuiMessage(json.encode({_type = 'sparkHud', action = 'update_state_'..controller, state = false, type = 't3'}))
			end
			-- Are the lights on but no sirens?
			if IsVehicleSirenOn(GetVehiclePedIsIn(PlayerPedId(), false)) and (state_lx == 0 or false) and (state_pwr == 0 or false) then
				SendNuiMessage(json.encode({_type = 'sparkHud', action = 'update_state_'..controller, state = true, type = 'standBy'}))
			else
				SendNuiMessage(json.encode({_type = 'sparkHud', action = 'update_state_'..controller, state = false, type = 'standBy'}))
			end
			-- Are High beams on?
			local lights, lightsOn, highbeamsOn = GetVehicleLightsState(pedVeh)
			if highbeamsOn == 1 then
				SendNuiMessage(json.encode({_type = 'sparkHud', action = 'update_state_'..controller, state = true, type = 'takeDowns'}))
			else
				SendNuiMessage(json.encode({_type = 'sparkHud', action = 'update_state_'..controller, state = false, type = 'takeDowns'}))
			end
			-- Is their siren on, checking for the siren switch
			if IsVehicleSirenOn(GetVehiclePedIsIn(PlayerPedId(), false)) then
				if UTIL:LoadVehicleConfig(pedVeh)?.stages ~= nil then
					isStage = true
					if IsVehicleExtraTurnedOn(pedVeh, UTIL:LoadVehicleConfig(pedVeh)?.stages.one[1]) and not IsVehicleExtraTurnedOn(pedVeh, UTIL:LoadVehicleConfig(pedVeh)?.stages.two[1]) then
						SendNuiMessage(json.encode({_type = 'sparkHud', action = 'update_state_'..controller, state = true, type = 'stage1'}))
						stage = 1
					elseif IsVehicleExtraTurnedOn(pedVeh, UTIL:LoadVehicleConfig(pedVeh)?.stages.two[1]) and not IsVehicleExtraTurnedOn(pedVeh, UTIL:LoadVehicleConfig(pedVeh)?.stages.three[1]) then
						SendNuiMessage(json.encode({_type = 'sparkHud', action = 'update_state_'..controller, state = true, type = 'stage2'}))
						stage = 2
					elseif IsVehicleExtraTurnedOn(pedVeh, UTIL:LoadVehicleConfig(pedVeh)?.stages.three[1]) then
						SendNuiMessage(json.encode({_type = 'sparkHud', action = 'update_state_'..controller, state = true, type = 'stage3'}))
						if not wigwagOverright and UTIL:LoadVehicleConfig(pedVeh)?.extras.wigwags then
							SendNuiMessage(json.encode({_type = 'sparkHud', action = 'update_state_'..controller, state = true, type = 'wigwags'}))
						end
						stage = 3
					end
				else
					isStage = false
					stage = 3
				end
			else
				-- Check if their is no TAC
				if not UTIL:LoadVehicleConfig(pedVeh)?.tac then
					-- Is there TA on but no sirens?
					if not tac then
						extra(tac, 'tac')
						SendNuiMessage(json.encode({_type = 'sparkHud', action = 'update_state_'..controller, state = false, type = 'tac'}))
						tac = not tac
					end
				end
				wigwagOverright = false
				stage = 0
				SendNuiMessage(json.encode({_type = 'sparkHud', action = 'update_state_'..controller, state = false, type = 'wigwags'}))
				SendNuiMessage(json.encode({_type = 'sparkHud', action = 'update_state_'..controller, state = false, type = 'stage3'}))
			end
		end
		if auto_park_pattern and GetVehicleClass(pedVeh) == 18 and UTIL:LoadVehicleConfig(pedVeh) and not pp and UTIL:LoadVehicleConfig(pedVeh)?.pp and (GetEntitySpeed(pedVeh) < 1) and not ppManualOverride and IsVehicleSirenOn(pedVeh) and not fullLightKill and not frontLightKill then
			Wait(3000)
			if ppManualOverride or not UTIL:LoadVehicleConfig(pedVeh)?.pp then
				return
			end
			extra(true, 'parkpattern')
			pp = true
			pp_from_stopping = true
			if cruise then
				SendNuiMessage(json.encode({_type = 'sparkHud', action = 'update_state_'..controller, state = true, type = 'dvi'}))
			end
			if parkPatternSync then
				local gameSeconds = GetGameTimer() / 1000
				if gameSeconds >= lastSync + parkPatternSyncCooldown then
					lastSync = gameSeconds
					local loadedVehicles = GetGamePool('CVehicle')
					local vehsToSync = {}
					for _, v in pairs(loadedVehicles) do
						if v ~= GetVehiclePedIsIn(PlayerPedId()) then
							local vehCoords = GetEntityCoords(v)
							local pedCoords = GetEntityCoords(PlayerPedId())
							local distance = GetDistanceBetweenCoords(vehCoords, pedCoords)
							if distance < parkPatternSyncDistance then
								if GetVehicleClass(v) == 18 and validVehicle[(GetEntityModel(v))] and IsVehicleSirenOn(v) then
									if (GetEntitySpeed(GetVehiclePedIsUsing(PlayerPedId())) < 1) then
										table.insert(vehsToSync, v)
									end
								end
							end
						end
					end
					if #vehsToSync > 0 then
						SetVehicleSiren(GetVehiclePedIsIn(PlayerPedId()), false)
						SetVehicleSiren(GetVehiclePedIsIn(PlayerPedId()), true)
						for _, v in pairs(vehsToSync) do
							SetVehicleSiren(v, false)
							SetVehicleSiren(v, true)
						end
						local vehsToSyncNet = {}
						for _, v in pairs(vehsToSync) do
							table.insert(vehsToSyncNet, VehToNet(v))
						end
						TriggerServerEvent('parkPattern::sync::send', vehsToSyncNet)
					end
				end
			end
		elseif auto_park_pattern and pp and pp_from_stopping and not ppManualOverride and UTIL:LoadVehicleConfig(pedVeh) and (GetEntitySpeed(pedVeh) >= 1) and not fullLightKill and not frontLightKill then
			extra(false, 'parkpattern')
			if isStage then
				if stage == 1 then
					for _,k in pairs(UTIL:LoadVehicleConfig(pedVeh)?.stages.two) do
						SetVehicleExtra(pedVeh, k, 1)
					end
					for _,k in pairs(UTIL:LoadVehicleConfig(pedVeh)?.stages.three) do
						SetVehicleExtra(pedVeh, k, 1)
					end
					SendNuiMessage(json.encode({_type = 'sparkHud', action = 'update_state_'..controller, state = true, type = 'stage1'}))
				elseif stage == 2 then
					for _,k in pairs(UTIL:LoadVehicleConfig(pedVeh)?.stages.three) do
						SetVehicleExtra(pedVeh, k, 1)
					end
					SendNuiMessage(json.encode({_type = 'sparkHud', action = 'update_state_'..controller, state = true, type = 'stage2'}))
				end
			end
			pp = false
			pp_from_stopping = false
			if cruise then
				SendNuiMessage(json.encode({_type = 'sparkHud', action = 'update_state_'..controller, state = false, type = 'dvi'}))
			end
		end
		if UTIL:LoadVehicleConfig(pedVeh)?.doorKill and GetVehicleDoorAngleRatio(pedVeh, 0) > 0.1 then
			if isStage then
				if stage == 2 or stage == 3 then
					if not pp and not fullLightKill then
						driverModuleKilled = true
						SetVehicleExtra(pedVeh, 5, 1)
					end
				end
			else
				if not pp and not fullLightKill then
					driverModuleKilled = true
					SetVehicleExtra(pedVeh, 5, 1)
				end
			end
		end
		if driverModuleKilled and UTIL:LoadVehicleConfig(pedVeh)?.doorKill and GetVehicleDoorAngleRatio(pedVeh, 0) <= 0 then
			Wait(500)
			driverModuleKilled = false
			SetVehicleExtra(pedVeh, 5, 0)
		end
		Citizen.Wait(100)
	end
end)

RegisterNetEvent('parkPattern::sync::receive', function(vehicles)
	for _, v in pairs(vehicles) do
		SetVehicleSiren(NetToVeh(v), false)
		SetVehicleSiren(NetToVeh(v), true)
	end
end)

RegisterKeyMapping('_spark_cruiseLights', 'Cruise Lights', 'keyboard', 'DECIMAL')
RegisterKeyMapping('_spark_cornerCruiseLights', 'Corner Cruise Lights', 'keyboard', 'NUMPAD6')
RegisterKeyMapping('_spark_fullLightKill', 'Full Light Kill', 'keyboard', 'PLUS')
RegisterKeyMapping('_spark_tac', 'Traffic Advisor Center', 'keyboard', 'NUMPAD5')
RegisterKeyMapping('_spark_pp', 'Park Pattern', 'keyboard', 'NUMPAD0')
RegisterKeyMapping('_spark_frontLightKill', 'Front Light Kill', 'keyboard', 'NUMPAD1')
RegisterKeyMapping('_spark_rearLightKill', 'Front Light Kill', 'keyboard', 'NUMPAD4')
RegisterKeyMapping('_spark_rearFlood', 'Rear Flood Lighting', 'keyboard', 'NUMPAD2')
RegisterKeyMapping('_spark_frontFlood', 'Front Flood Lighting', 'keyboard', 'NUMPAD3')
RegisterKeyMapping('_spark_rightFlood', 'Right Flood Lighting', 'keyboard', 'NUMPAD7')
RegisterKeyMapping('_spark_leftFlood', 'Left Flood Lighting', 'keyboard', 'NUMPAD8')
RegisterKeyMapping('_spark_tal', 'Traffic Advisor Left', 'keyboard', 'NUMPAD7')
RegisterKeyMapping('_spark_tar', 'Traffic Advisor Right', 'keyboard', 'NUMPAD8')
RegisterKeyMapping('_spark_wigwag', 'Wig Wags', 'keyboard', 'NUMPAD9')

-- Front Kill Handler
RegisterCommand('_spark_frontLightKill', function()
	if not GetVehicleClass(pedVeh) == 18 then
		return
	end
	if frontLightKill then
		extra(false, 'frontLightKill')
		frontLightKill = false
	elseif not frontLightKill then
		extra(true, 'frontLightKill')
		frontLightKill = true
	end
	extra(frontLightKill, 'frontLightKill')
end)

-- Rear Kill Handler
RegisterCommand('_spark_rearLightKill', function()
	if not GetVehicleClass(pedVeh) == 18 then
		return
	end
	if rearLightKill then
		extra(false, 'rearLightKill')
		rearLightKill = false
	elseif not rearLightKill then
		extra(true, 'rearLightKill')
		rearLightKill = true
	end
	extra(rearLightKill, 'rearLightKill')
end)

-- Stage 2 Lighting Handler
RegisterCommand('_spark_rearFlood', function()
	if not GetVehicleClass(pedVeh) == 18 then
		return
	end
	extra(rearFlood, 'rearFlood')
	rearFlood = not rearFlood
end)

-- Stage 3 Lighting Handler
RegisterCommand('_spark_frontFlood', function()
	if not GetVehicleClass(pedVeh) == 18 then
		return
	end
	extra(frontFlood, 'frontFlood')
	frontFlood = not frontFlood
end)

-- Right Flood Lighting Handler
RegisterCommand('_spark_rightFlood', function()
	if not GetVehicleClass(pedVeh) == 18 then
		return
	end
	extra(rightFlood, 'rightFlood')
	rightFlood = not rightFlood
end)

-- Left Flood Lighting Handler
RegisterCommand('_spark_leftFlood', function()
	if not GetVehicleClass(pedVeh) == 18 then
		return
	end
	extra(leftFlood, 'leftFlood')
	leftFlood = not leftFlood
end)

-- Park Pattern Handler
RegisterCommand('_spark_pp', function(source, args)
	if not GetVehicleClass(pedVeh) == 18 or GetPedInVehicleSeat(pedVeh, -1) == 0 then
		return
	end
	if not UTIL:LoadVehicleConfig(pedVeh)?.pp then
		return
	end
	if not ppManualOverride and not pp then
		ppManualOverride = true
		AUDIO:Play('Press', AUDIO.upgrade_volume)
		SendNuiMessage(json.encode({_type = 'sparkHud', action = 'update_state_'..controller, state = true, type = 'ppManualOverride'}))
	elseif pp and not ppManualOverride then
		extra(false, 'parkpattern')
		if isStage then
			if stage == 1 then
				for _,k in pairs(UTIL:LoadVehicleConfig(pedVeh)?.stages.two) do
					SetVehicleExtra(pedVeh, k, 1)
				end
				for _,k in pairs(UTIL:LoadVehicleConfig(pedVeh)?.stages.three) do
					SetVehicleExtra(pedVeh, k, 1)
				end
				SendNuiMessage(json.encode({_type = 'sparkHud', action = 'update_state_'..controller, state = true, type = 'stage1'}))
			elseif stage == 2 then
				for _,k in pairs(UTIL:LoadVehicleConfig(pedVeh)?.stages.three) do
					SetVehicleExtra(pedVeh, k, 1)
				end
				SendNuiMessage(json.encode({_type = 'sparkHud', action = 'update_state_'..controller, state = true, type = 'stage2'}))
			end
		end
		pp = false
		ppManualOverride = true
		SendNuiMessage(json.encode({_type = 'sparkHud', action = 'update_state_'..controller, state = true, type = 'ppManualOverride'}))
		if cruise then
			SendNuiMessage(json.encode({_type = 'sparkHud', action = 'update_state_'..controller, state = false, type = 'dvi'}))
		end
	elseif ppManualOverride and not pp then
		ppManualOverride = false
		AUDIO:Play('Press', AUDIO.upgrade_volume)
		SendNuiMessage(json.encode({_type = 'sparkHud', action = 'update_state_'..controller, state = false, type = 'ppManualOverride'}))
	elseif ppManualOverride and pp then
		extra(true, 'parkpattern')
		pp = true
		ppManualOverride = false
		SendNuiMessage(json.encode({_type = 'sparkHud', action = 'update_state_'..controller, state = false, type = 'ppManualOverride'}))
		if cruise then
			SendNuiMessage(json.encode({_type = 'sparkHud', action = 'update_state_'..controller, state = true, type = 'dvi'}))
		end
	end
end)

-- Wig Wags Handler
RegisterCommand('_spark_wigwag', function()
	if not GetVehicleClass(pedVeh) == 18 then
		return
	end
	if UTIL:LoadVehicleConfig(pedVeh)?.extras['wigwags'] == nil then
		return
	end
	if not wigwag then
		extra(true, 'wigwags')
		wigwag = true
	elseif wigwag or IsVehicleExtraTurnedOn(pedVeh, UTIL:LoadVehicleConfig(pedVeh)?.stages.three[1]) then
		extra(false, 'wigwags')
		wigwag = false
		if IsVehicleExtraTurnedOn(pedVeh, UTIL:LoadVehicleConfig(pedVeh)?.stages.three[1]) then
			wigwagOverright = true
		end
	end
end)

-- Traffic Advisor Right Handler
RegisterCommand('_spark_tar', function()
	if not GetVehicleClass(pedVeh) == 18 then
		return
	end
	if IsVehicleSirenOn(GetVehiclePedIsIn(PlayerPedId(), false)) then
		extra(tar, 'tar')
		tar= not tar
	end
end)

-- Traffic Advisor Center Handler
RegisterCommand('_spark_tac', function()
	if not GetVehicleClass(pedVeh) == 18 then
		return
	end
	if IsVehicleSirenOn(GetVehiclePedIsIn(PlayerPedId(), false)) then
		extra(tac, 'tac')
		tac = not tac
	end
end)

-- Traffic Advisor Left Handler
RegisterCommand('_spark_tal', function()
	if not GetVehicleClass(pedVeh) == 18 then
		return
	end
	if IsVehicleSirenOn(GetVehiclePedIsIn(PlayerPedId(), false)) then
		extra(tal, 'tal')
		tal= not tal
	end
end)

-- Full Kill Handler
RegisterCommand('_spark_fullLightKill', function()
	if not GetVehicleClass(pedVeh) == 18 then
		return
	end
	if fullLightKill then
		extra(false, 'fullLightKill')
		fullLightKill = false
	elseif not fullLightKill then
		extra(true, 'fullLightKill')
		fullLightKill = true
	end
end)

-- Cruise Lights Handler
RegisterCommand('_spark_cruiseLights', function()
	if not GetVehicleClass(pedVeh) == 18 then
		return
	end
	if cruise then
		cruise = false
		if pp then
			SendNuiMessage(json.encode({_type = 'sparkHud', action = 'update_state_'..controller, state = false, type = 'dvi'}))
		end
	elseif not cruise then
		cruise = true
		if pp then
			SendNuiMessage(json.encode({_type = 'sparkHud', action = 'update_state_'..controller, state = true, type = 'dvi'}))
		end
	end
	extra(cruise, 'cruise')
end)

-- Corner Cruise Lights Handler
RegisterCommand('_spark_cornerCruiseLights', function()
	if not GetVehicleClass(pedVeh) == 18 then
		return
	end
	if cornerCruise then
		cornerCruise = false
	elseif not cornerCruise then
		cornerCruise = true
	end
	extra(cornerCruise, 'cornerCruise')
end)

function Alert(msg)
	BeginTextCommandDisplayHelp("STRING")
	AddTextComponentSubstringPlayerName(msg)
	EndTextCommandDisplayHelp(0, false, true, 5000)
end