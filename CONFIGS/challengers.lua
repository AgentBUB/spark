local data = {
	-- The controller image folder name
	controller = "whelen-skeet",

	-- If the vehicle has door kill function / extras
	doorKill = false,

	-- If the vehicle has traffic advisory function / extras
	tac = false,
	
	-- If the vehicle has park pattern function / extras
	pp = false,
	
	-- If the vehicle has to be repaired when changing extras (Extras HAVE collisions)
	repair = false,

	-- Stage lighting extras (Leave as nil to disable)
	stages = {
		one = {1},
        two = {2},
        three = {3, 4}
	},

	-- The extra configurations for SPARK's special functions
	extras = {
		["parkpattern"] = {
            enabled = {
                on = {5},
                off = {1, 2, 3, 4}
            },
            disabled = {
                on = {1, 2, 3, 4},
                off = {5}
            },
        }, -- Park Pattern Lighting
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