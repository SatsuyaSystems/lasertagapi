from api import API

class Main:

    def __init__(self):
        self.API = API()

    def start(self):
        self.group = 322642

        self.API.getPlayers(group=self.group) # ALL GROUP MEMBERS
        print(self.API.players)

        self.API.fetchUser(username=self.API.players[0], group=self.group) # GET LOCAL PLAYER
        print(self.API.localplayer)

        self.API.classPerks(userid=self.API.localplayer["userid"], classname=self.API.localplayer["class"]) # GET LOCAL PLAYERS CLASS
        print(self.API.localclass)

        self.API.weaponPerks(userid=self.API.localplayer["userid"], weaponname=self.API.localplayer["weapon"])  # GET LOCAL PLAYERS WEAPON
        print(self.API.localweapon)

        self.API.gameSettings(group=self.group) # GET GROUP GAME
        print(self.API.game)

Main().start()