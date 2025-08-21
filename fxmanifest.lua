------------------------------

fx_version 'adamant'
games { 'gta5' }

author 'Agent BUB w/ credits see GitHub'
real_name 'SPARK Vehicle Control'
description 'Emergency vehicle sirens/lighting controller system for FiveM, designed primarily for Redneck\'s vehicles.'

version '1.0.0'			-- Readonly version of currently installed version.
compatible '1.0.0'		-- Readonly save reverse compatibility.

------------------------------

debug_mode 'false' 		-- More verbose printing on client console.

------------------------------

ui_page('/UI/html/index.html')

dependencies {
    'RageUI'
}

files {
    'UI/html/index.html',
    'UI/html/spark.js',
    'UI/html/style.css',
	'UI/sounds/*.ogg',
	'UI/sounds/**/*.ogg',
	'UI/controllers/**/*.png',
	'UI/controllers/**/*.gif',
	'PLUGINS/**/*.json',
    'CONFIGS/*.lua'
}


shared_script {
	'/UTIL/semver.lua',
	'/UI/cl_locale.lua',
	'/UI/locale/en.lua',	-- Set locale / language file here.
	'SETTINGS.lua',
}

client_scripts {
	---------------RAGE-UI---------------
    '@RageUI/RMenu.lua',
    '@RageUI/menu/RageUI.lua',
    '@RageUI/menu/Menu.lua',
    '@RageUI/menu/MenuController.lua',
    '@RageUI/components/Audio.lua',
    '@RageUI/components/Enum.lua',
    '@RageUI/components/Keys.lua',
    '@RageUI/components/Rectangle.lua',
    '@RageUI/components/Sprite.lua',
    '@RageUI/components/Text.lua',
    '@RageUI/components/Visual.lua',
    '@RageUI/menu/elements/ItemsBadge.lua',
    '@RageUI/menu/elements/ItemsColour.lua',
    '@RageUI/menu/elements/PanelColour.lua',
    '@RageUI/menu/items/UIButton.lua',
    '@RageUI/menu/items/UICheckBox.lua',
    '@RageUI/menu/items/UIList.lua',
    '@RageUI/menu/items/UISeparator.lua',
    '@RageUI/menu/items/UISlider.lua',
    '@RageUI/menu/items/UISliderHeritage.lua',
    '@RageUI/menu/items/UISliderProgress.lua',
    '@RageUI/menu/panels/UIColourPanel.lua',
    '@RageUI/menu/panels/UIGridPanel.lua',
    '@RageUI/menu/panels/UIPercentagePanel.lua',
    '@RageUI/menu/panels/UIStatisticsPanel.lua',
    '@RageUI/menu/windows/UIHeritage.lua',
	-------------------------------------
	'SIRENS.lua',
	'/UTIL/cl_*.lua',
	'/UI/cl_*.lua',
	'/PLUGINS/cl_plugins.lua',
	'/PLUGINS/**/SETTINGS.lua',
	'/PLUGINS/**/cl_*.lua',
}

server_script {
	'/UTIL/sv_*.lua',
	'/PLUGINS/**/sv_*.lua'
}
------------------------------