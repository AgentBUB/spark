RegisterNetEvent('parkPattern::sync::send', function()
    local players = GetPlayers()
    for _,v in ipairs(players) do
        if not v == source then
            TriggerClientEvent('parkPattern::sync::receive', v)
        end
    end
end)