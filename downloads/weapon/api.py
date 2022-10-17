import requests
url_base = "http://localhost:4479"

class API:

    def getPlayers(self, group):
        r = requests.post(f"{url_base}/api/groupplayers", json={"group": group})
        self.players = []
        for p_ids in r.json():
            self.players.append(p_ids['username'])

    def fetchUser(self, username, group):
        r = requests.post(f"{url_base}/api/fetchuser", json={"group": group, "username": username})
        self.localplayer = r.json()

    def classPerks(self, userid, classname):
        r = requests.post(f"{url_base}/api/classperks", json={"userid": userid, "classname": classname})
        self.localclass = r.json()

    def weaponPerks(self, userid, weaponname):
        r = requests.post(f"{url_base}/api/weaponperks", json={"userid": userid, "weaponname": weaponname})
        self.localweapon = r.json()

    def gameSettings(self, group):
        r = requests.post(f"{url_base}/api/fetchgroupgame", json={"group": group})
        self.game = r.json()
