if (isServer || isDedicated) then {
	true call db_fnc_init;
	[] call sog_server_init_fnc_serverSetup;
};