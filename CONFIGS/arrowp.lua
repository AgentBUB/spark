local data = {
	-- The controller image folder name
	controller = "arrow",

	-- If the vehicle has door kill function / extras
	doorKill = false,

	-- If the vehicle has traffic advisory function / extras
	tac = false,
	
	-- If the vehicle has park pattern function / extras
	pp = false,
	
	-- If the vehicle has to be repaired when changing extras (Extras HAVE collisions)
	repair = true,

    -- Stage lighting extras (Leave as nil to disable)
	stages = nil,

	-- The extra configurations for SPARK's special functions
	extras = {
		["fullLightKill"] = {
            enabled = {
                on = {},
                off = {4, 5}
            },
            disabled = {
                on = {4, 5},
                off = {}
            },
        }, -- Full Light Kill
        ["frontLightKill"] = {
            enabled = {
                on = {},
                off = {4}
            },
            disabled = {
                on = {4},
                off = {}
            },
        }, -- Front Light Kill
        ["rearFlood"] = {
            enabled = {
                on = {3},
                off = {}
            },
            disabled = {
                on = {},
                off = {3}
            },
        }, -- Rear Flood Light
        ["leftFlood"] = {
            enabled = {
                on = {1},
                off = {}
            },
            disabled = {
                on = {},
                off = {1}
            },
        }, -- Left Flood Lighting
        ["rightFlood"] = {
            enabled = {
                on = {2},
                off = {}
            },
            disabled = {
                on = {},
                off = {2}
            },
        }, -- Right Flood Lighting
        ["cruise"] = {
            enabled = {
                on = {6},
                off = {}
            },
            disabled = {
                on = {},
                off = {6}
            },
        }, -- Cruise lighting
	},
}

return data