--[[
---------------------------------------------------
SPARK EDIT OF LVC (FOR FIVEM)
---------------------------------------------------
Coded by Lt.Caine
ELS Clicks by Faction
LVC Modification by TrevorBarns
SPARK Modifications by AgentBUB
---------------------------------------------------
FILE: cl_plugins.lua
PURPOSE: Builds RageUI Plugin Menu based on plugins 
settings. Handles Plugin -> LVC event communication
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
-- RAGE UI
--	Draws specific button with callback to plugins menu if the plugin is found and enabled. (controlled in plugins settings file)
CreateThread(function()
	while true do
		while plugins_installed and IsMenuOpen() do
			RageUI.IsVisible(RMenu:Get('spark', 'plugins'), function()
				-----------------------------------------------------------------------------------------------------------------
				if tkd_masterswitch ~= nil then
					RageUI.Button(Lang:t('plugins.menu_tkd'), Lang:t('plugins.menu_tkd_desc'), {RightLabel = '→→→'}, tkd_masterswitch, {
					  onSelected = function()
					  end,
					}, RMenu:Get('spark', 'tkdsettings'))	
				end
				-----------------------------------------------------------------------------------------------------------------
				if ei_masterswitch ~= nil then
					RageUI.Button(Lang:t('plugins.menu_ei'), Lang:t('plugins.menu_ei_desc'), {RightLabel = '→→→'}, ei_masterswitch, {
					  onSelected = function()
					  end,
					}, RMenu:Get('spark', 'extrasettings'))	
				end		
				-----------------------------------------------------------------------------------------------------------------
				if ta_masterswitch ~= nil then
					RageUI.Button(Lang:t('plugins.menu_ta'), Lang:t('plugins.menu_ta_desc'), {RightLabel = '→→→'}, ta_masterswitch, {
					  onSelected = function()
					  end,
					}, RMenu:Get('spark', 'tasettings'))	
				end		
				-----------------------------------------------------------------------------------------------------------------
				if trailer_masterswitch ~= nil then
					RageUI.Button(Lang:t('plugins.menu_ts'), Lang:t('plugins.menu_ts_desc'), {RightLabel = '→→→'}, trailer_masterswitch, {
					  onSelected = function()
					  end,
					}, RMenu:Get('spark', 'trailersettings'))	
				end		
				-----------------------------------------------------------------------------------------------------------------
				if ec_masterswitch ~= nil then
					RageUI.Button(Lang:t('plugins.menu_ec'), Lang:t('plugins.menu_ec_desc'), {RightLabel = '→→→'}, ec_masterswitch, {
					  onSelected = function()
					  end,
					}, RMenu:Get('spark', 'extracontrols'))	
				end		
				-----------------------------------------------------------------------------------------------------------------
			end)
			Wait(0)
		end
		Wait(500)
	end
end)

-- FUNCTIONS
--	IsPluginMenuOpen is called inside IsMenuOpen (spark/UI/cl_ragemenu.lua) to separate them, this is useful for plugin updates separate of main spark updates.
local ec_shortcut_menu_visible = false
function IsPluginMenuOpen()
	if ec_masterswitch then
		ec_shortcut_menu_visible = EC.is_menu_open
	end
	
	return  RageUI.Visible(RMenu:Get('spark', 'tkdsettings')) or 
			RageUI.Visible(RMenu:Get('spark', 'extrasettings')) or
			RageUI.Visible(RMenu:Get('spark', 'tasettings')) or
			RageUI.Visible(RMenu:Get('spark', 'trailersettings')) or
			RageUI.Visible(RMenu:Get('spark', 'trailerextras')) or
			RageUI.Visible(RMenu:Get('spark', 'trailerdoors')) or
			RageUI.Visible(RMenu:Get('spark', 'extracontrols')) or
			ec_shortcut_menu_visible
end