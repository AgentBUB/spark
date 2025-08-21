local data = {
	-- The controller image folder name
	controller = "whelen-gw",

	-- If the vehicle has door kill function / extras
	doorKill = true,

	-- If the vehicle has traffic advisory function / extras
	tac = true,
	
	-- If the vehicle has park pattern function / extras
	pp = true,
	
	-- If the vehicle has to be repaired when changing extras (Extras HAVE collisions)
	repair = true,

    -- Stage lighting extras (Leave as nil to disable)
	stages = nil,

	-- The extra configurations for SPARK's special functions
	extras = {
        ["fullLightKill"] = {
            enabled = {
                on = {},
                off = {2, 3, 4, 5, 6, 7, 8}
            },
            disabled = {
                on = {2, 3, 4, 5},
                off = {}
            },
        }, -- Full Light Kill
        ["frontLightKill"] = {
            enabled = {
                on = {2, 3, 5},
                off = {4}
            },
            disabled = {
                on = {2, 3, 4, 5},
                off = {}
            },
        }, -- Front Light Kill
        ["rearFlood"] = {
            enabled = {
                on = {10},
                off = {}
            },
            disabled = {
                on = {},
                off = {10}
            },
        }, -- Rear Flood Light
        ["frontFlood"] = {
            enabled = {
                on = {9},
                off = {}
            },
            disabled = {
                on = {},
                off = {9}
            },
        }, -- Front Flood Lighting
        ["tac"] = {
            enabled = {
                on = {1},
                off = {}
            },
            disabled = {
                on = {},
                off = {1}
            },
        }, -- Traffic Advisor Center
        ["parkpattern"] = {
            enabled = {
                on = {6, 7, 8},
                off = {2, 3, 4, 5}
            },
            disabled = {
                on = {2, 3, 4, 5},
                off = {6, 7, 8}
            },
        }, -- Park Pattern Lighting
        ["cruise"] = {
            enabled = {
                on = {11, 12},
                off = {}
            },
            disabled = {
                on = {},
                off = {11, 12}
            },
        }, -- Cruise lighting
    },
}

return data