#include <iostream>
#include <vector>
#include <string>
#include <curl/curl.h>

const std::string url_base = "http://localhost:4479";

class API {
public:
    API() {
        curl = curl_easy_init();
        if (curl) {
            // Set common cURL options here
            headers = curl_slist_append(headers, "Content-Type: application/json");
            curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
        }
    }

    ~API() {
        if (curl) {
            curl_slist_free_all(headers);
            curl_easy_cleanup(curl);
        }
    }

    void getPlayers(const std::string& group) {
        if (!curl) {
            std::cerr << "cURL initialization failed." << std::endl;
            return;
        }
        
        CURLcode res;
        std::string url = url_base + "/api/groupplayers";
        std::string json_data = "{\"group\": \"" + group + "\"}";

        curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, json_data.c_str());

        std::string response;
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);

        res = curl_easy_perform(curl);

        if (res == CURLE_OK) {
            // Process the response JSON
            // You can parse the 'response' string here
            std::cout << "Response: " << response << std::endl;
        } else {
            std::cerr << "Error: " << curl_easy_strerror(res) << std::endl;
        }
    }

    void fetchUser(const std::string& username, const std::string& group){

    }


        void getClassPerks(){

    }

        void getWeaponPerks(){

    }

        void getWeaponPerks(){

    }


private:
    static size_t WriteCallback(void* contents, size_t size, size_t nmemb, std::string* output) {
        size_t total_size = size * nmemb;
        output->append(static_cast<char*>(contents), total_size);
        return total_size;
    }

    CURL* curl = nullptr;
    struct curl_slist* headers = nullptr;
};

int main() {
    API api;

    // Example usage
    api.getPlayers("your_group_name");
    api.fetchUser("your_username", "your_group_name");
    api.classPerks("your_userid", "your_classname");
    api.weaponPerks("your_userid", "your_weaponname");
    api.gameSettings("your_group_name");

    return 0;
}