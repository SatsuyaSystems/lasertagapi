url_base = 'http://raspberrypi:4479'
from requests import get
import json

class Updater:
    expected = None
    current = None
    def update(self, exp_version):
        g = get(f"{url_base}/downloads/weapon/main.py", allow_redirects=True)
        open('main.py', 'wb').write(g.content)
        print("Downloaded main.py")
        with open("version.json", "r+") as jsonFile:
            data = json.load(jsonFile)
            data["version"] = exp_version
            jsonFile.seek(0)
            json.dump(data, jsonFile)
            jsonFile.truncate()
        print("Changed version.json")

    def start(self, program_name = "weapon"):
        print("Sending version request to API")
        version = get(f"{url_base}/version/{program_name}")
        print(f"Expected: {version.json()['version']}")
        expected = version.json()['version']
        f = open("version.json")
        data = json.load(f)
        print(f"Current: {data['version']}")
        current = data['version']
        f.close()
        if current != expected:
            print("Client is outdated")
            Updater().update(exp_version=expected)
        else:
            print("Client is up to date")


Updater().start()