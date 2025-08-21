--[[
---------------------------------------------------
SPARK EDIT OF LVC (FOR FIVEM)
---------------------------------------------------
Coded by Lt.Caine
ELS Clicks by Faction
LVC Modification by TrevorBarns
SPARK Modifications by AgentBUB
---------------------------------------------------
FILE: sv_lvc.lua
PURPOSE: Handle version checking, syncing vehicle
states.
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

local curr_version = semver(GetResourceMetadata(GetCurrentResourceName(), 'version', 0))
local repo_version = ''
local repo_beta_version = ''

local plugin_count = 0
local plugins_cv = { }		-- table of active plugins current versions plugins_cv = { ['<pluginname>'] = <version> }
local plugins_rv = { }		-- table of active plugins repository versions

---------------VEHICLE STATE EVENTS----------------
RegisterServerEvent('spark:GetRepoVersion_s')
AddEventHandler('spark:GetRepoVersion_s', function()
	TriggerClientEvent('spark:SendRepoVersion_c', source, repo_version)
end)

RegisterServerEvent('spark:TogDfltSrnMuted_s')
AddEventHandler('spark:TogDfltSrnMuted_s', function()
	TriggerClientEvent('spark:TogDfltSrnMuted_c', -1, source)
end)


RegisterServerEvent('spark:SetLxSirenState_s')
AddEventHandler('spark:SetLxSirenState_s', function(newstate)
	TriggerClientEvent('spark:SetLxSirenState_c', -1, source, newstate)
end)

RegisterServerEvent('spark:SetPwrcallState_s')
AddEventHandler('spark:SetPwrcallState_s', function(newstate)
	TriggerClientEvent('spark:SetPwrcallState_c', -1, source, newstate)
end)

RegisterServerEvent('spark:SetAirManuState_s')
AddEventHandler('spark:SetAirManuState_s', function(newstate)
	TriggerClientEvent('spark:SetAirManuState_c', -1, source, newstate)
end)

RegisterServerEvent('spark:TogIndicState_s')
AddEventHandler('spark:TogIndicState_s', function(newstate)
	TriggerClientEvent('spark:TogIndicState_c', -1, source, newstate)
end)

-------------VERSION CHECKING & STARTUP------------
RegisterServerEvent('spark:plugins_storePluginVersion')
AddEventHandler('spark:plugins_storePluginVersion', function(name, version)
	plugin_count = plugin_count + 1
	plugins_cv[name] = version
end)


CreateThread( function()
-- Get spark version from github
	PerformHttpRequest('https://raw.githubusercontent.com/AgentBUB/spark/master/version', function(err, responseText, headers)
		if responseText ~= nil and responseText ~= '' then
			repo_version = semver(responseText:gsub('\n', ''))
		end
	end)

	Wait(1000)
  -- Get currently installed plugin versions (plugins -> 'spark:plugins_storePluginVersion')
	TriggerEvent('spark:plugins_getVersions')

  -- Get repo version for installed plugins
	for name, _ in pairs(plugins_cv) do
		PerformHttpRequest('https://raw.githubusercontent.com/AgentBUB/spark/master/PLUGINS/'..name..'/version', function(err, responseText, headers)
			if responseText ~= nil and responseText ~= '' then
				plugins_rv[name] = responseText:gsub('\n', '')
			else
				plugins_rv[name] = 'UNKWN'
			end
		end)
	end
	Wait(1000)
	print('\n\t^7 ________________________________________________________')
	print('\t|\t                                                 |')
	print('\t|\t^8 _____     ^7_____    ^9          ^7_____     ^8_  __    ^7|')
	print('\t|\t^8/ ____|   ^7|  __ \\   ^9  /\\     ^7|  __ \\   ^8| |/ /    ^7|')
	print('\t|\t^8| (___    ^7| |__) |  ^9 /  \\    ^7| |__) |  ^8|   /     ^7|')
	print('\t|\t^8 \\___ \\   ^7|  ___/   ^9/ /\\ \\   ^7|  _  /   ^8|   \\     ^7|')
	print('\t|\t^8 ____) |  ^7| |      ^9/ ____ \\  ^7| | \\ \\   ^8| |\\ \\    ^7|')
	print('\t|\t^8|_____/   ^7|_|     ^9/_/    \\_\\ ^7|_|  \\_\\  ^8|_| \\_\\   ^7|')
	print('\t|\t                                                 |')
	print(('\t|\t            COMMUNITY ID: %-23s|'):format(community_id))
	print('\t^7|________________________________________________________|')
	print(('\t|\t           INSTALLED: %-27s|'):format(curr_version))
	print(('\t|\t              LATEST: %-27s|'):format(repo_version))
	if GetResourceState('lvc') ~= 'started' and GetResourceState('lvc') ~= 'starting' then
		if GetCurrentResourceName() == 'spark' then
			if community_id ~= nil and community_id ~= '' then
				--	UPDATE DETECTED
				if curr_version < repo_version then
					print('\t^7|________________________________________________________|')
					print('\t|\t             ^8UPDATE AVAILABLE                    ^7|')
					print('\t|^8                      DOWNLOAD AT:                      ^7|')
					print('\t|^2           github.com/AgentBUB/spark/releases           ^7|')
				end

				--	IF PLUGINS ARE INSTALLED
				if plugin_count > 0 then
					print('\t^7|________________________________________________________|')
					print('\t^7|INSTALLED PLUGINS               | INSTALLED |  LATEST   |')
					for name, version in pairs(plugins_cv) do
						local plugin_string
						if plugins_rv[name] ~= nil and plugins_rv[name] ~= 'UNKWN' and plugins_cv[name] < plugins_rv[name]  then
							plugin_string = ('\t|^8  %-30s^7|^8   %s   ^7|^8   %s   ^7|^8 UPDATE REQUIRED    ^7'):format(name, plugins_cv[name], plugins_rv[name])
						elseif plugins_rv[name] ~= nil and plugins_cv[name] > plugins_rv[name] or plugins_rv[name] == 'UNKWN' then
							plugin_string = ('\t|^3  %-30s^7|^3   %s   ^7|^3   %s   ^7|^3 EXPERIMENTAL VERSION ^7'):format(name, plugins_cv[name], plugins_rv[name])
						else
							plugin_string = ('\t|  %-30s|   %s   |   %s   |'):format(name, plugins_cv[name], plugins_rv[name])
						end
						print(plugin_string)
					end
				end
			else	-- NO COMMUNITY ID SET
				print('\t|\t^8             CONFIGURATION ERROR                 ^7|')
				print('\t|^8 COMMUNITY ID MISSING, THIS IS REQUIRED TO PREVENT      ^7|')
				print('\t|^8 CONFLICTS FOR PLAYERS WHO PLAY ON MULTIPLE SERVERS     ^7|')
				print('\t|^8 WITH spark. PLEASE SET THIS IN SETTINGS.LUA.             ^7|')
			end
		else	-- INCORRECT RESOURCE NAME
				print('\t|\t^8             CONFIGURATION ERROR                 ^7|')
				print('\t|^8 INVALID RESOURCE NAME. PLEASE VERIFY RESOURCE FOLDER   ^7|')
				print('\t|^8 NAME READS \'^3spark^8\' (CASE-SENSITIVE). THIS IS REQUIRED  ^7|')
				print('\t|^8 FOR PROPER SAVE / LOAD FUNCTIONALITY. PLEASE RENAME,   ^7|')
				print('\t|^8 REFRESH, AND ENSURE.                                   ^7|')
		end
	elseif GetResourceState('redneck-lighting') == 'started' and GetResourceState('redneck-lighting') == 'starting' then
		print('\t|\t^8        RESOURCE CONFLICT DETECTED               ^7|')
		print('\t|^8          DETECTED "redneck-lighting" RUNNING.          ^7|')
		print('\t|^8    PLEASE STOP "redneck-lighting" AND RESTART spark.   ^7|')
	else	-- RESOURCE CONFLICT
			print('\t|\t^8        RESOURCE CONFLICT DETECTED               ^7|')
			print('\t|^8       DETECTED "lvc" RUNNING, THIS CONFLICTS WITH      ^7|')
			print('\t|^8       spark. PLEASE STOP "lvc" AND RESTART spark.      ^7|')
	end
	print('\t^7|________________________________________________________|')
	print('\t^7|  Updates, Support, Feedback: ^5discord.gg/redneckmods    ^7|')
	print('\t^7|________________________________________________________|\n\n')
end)