[] call sog_client_init_fnc_initArmory;
[] spawn sog_client_init_fnc_initPlayer;
[] spawn sog_client_phone_fnc_initPhone;
[] spawn sog_client_store_fnc_initStore;

player addItem "SOG_Phone";

// TODO replace with function
[player] call compile preprocessFileLineNumbers "do_not_edit\briefing.sqf";