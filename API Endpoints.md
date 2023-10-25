
### Group Members
	Method: POST
	URL: /api/groupplayers
	Parameter:
		group -> int
	Response: Array of Users

### Group Game
	Method: POST
	URL: /api/fetchgroupgame
	Parameter:
		group -> int
	Response: Gamesettings in JSON
### User
	Method: POST
	URL: /api/fetchuser
	Parameter:
		username -> string
	group -> int
	Response: userid, class, weapon
### Weapon
	Method: POST
	URL: /api/weaponperks
	Parameter:
		weaponname -> string
		userid -> string
	Response: Settings of Weapon
### Class
	Method: POST
	URL: /api/classperks
	Parameter:
		classname -> string
		userid -> string
	Response: Settings of Class