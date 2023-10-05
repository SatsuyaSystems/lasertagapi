#include <iostream>
#include <vector>
#include <ctime>
#include <fec.h>
#include "ReedSolomon.cpp" // Encode and Decode for Error correction when transceiving ir signals

int main() {
    // Input data (bits) for encoding
    std::vector<unsigned char> inputBits = {'H', 'e', 'l', 'l', 'o'};
    int numCheckBytes = 5; // Number of check bytes to add

    // Get the current Unix time
    time_t startTime = time(nullptr);

    // Set the program to run for 10 minutes (600 seconds)
    const int runDuration = 600; // 10 minutes

    while (true) {
        // Check if the program has run for the specified duration
        time_t currentTime = time(nullptr);
        if (currentTime - startTime >= runDuration) {
            std::cout << "Program ended after 10 minutes." << std::endl;
            break;
        }

        // Call the Encode function directly from ReedSolomon.cpp
        std::vector<unsigned char> encodedData = Encode(inputBits, numCheckBytes);

        // You can add further processing or actions with encodedData here

        // Sleep for a short period (e.g., 1 second) before the next iteration
        sleep(1);
    }

    return 0;
}