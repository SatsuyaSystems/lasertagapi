#include <iostream>
#include <vector>
#include <fec.h>

// Encode and decode data using reed solomon algorithm for error correction

// Reed-Solomon encoding
std::vector<unsigned char> Encode(const std::vector<unsigned char>& data, int numCheckBytes) {
    int numDataBytes = data.size();
    
    // Create the fec_t object for encoding
    fec_t* enc = fec_new(numDataBytes, numCheckBytes);

    if (enc == nullptr) {
        std::cerr << "Error creating FEC encoder." << std::endl;
        exit(1);
    }

    // Encoding
    std::vector<unsigned char> encodedData(numDataBytes + numCheckBytes);

    if (fec_encode(enc, numDataBytes, data.data(), encodedData.data()) < 0) {
        std::cerr << "Error encoding data." << std::endl;
        fec_free(enc);
        exit(1);
    }

    fec_free(enc);

    return encodedData;
}

// Reed-Solomon Decoding
std::vector<unsigned char> Decode(const std::vector<unsigned char>& receivedData, int numCheckBytes) {
    int numDataBytes = receivedData.size() - numCheckBytes;

    // Create the fec_t object for decoding
    fec_t* dec = fec_new(numDataBytes, numCheckBytes);

    if (dec == nullptr) {
        std::cerr << "Error creating FEC decoder." << std::endl;
        exit(1);
    }

    // Decoding
    std::vector<unsigned char> decodedData(numDataBytes);

    if (fec_decode(dec, numDataBytes, receivedData.data(), decodedData.data()) < 0) {
        std::cerr << "Error decoding data." << std::endl;
        fec_free(dec);
        exit(1);
    }

    fec_free(dec);

    return decodedData;
}

int main() {
    // Input data (bits) for encoding
    std::vector<unsigned char> inputBits = {'H', 'e', 'l', 'l', 'o'};

    int numCheckBytes = 5; // Number of check bytes to add

    // Encoding
    std::vector<unsigned char> encodedData = Encode(inputBits, numCheckBytes);

    // Simulate errors in received data (for testing)
    // Change a few bytes in receivedData to simulate errors
    std::vector<unsigned char> receivedData = encodedData;
    receivedData[1] = 'X';
    receivedData[5] = 'Y';

    // Decoding
    std::vector<unsigned char> decodedData = Decode(receivedData, numCheckBytes);

    // Check for successful decoding and print the result
    std::cout << "Original Data: ";
    for (unsigned char val : inputBits) {
        std::cout << val;
    }
    std::cout << std::endl;

    std::cout << "Decoded Data: ";
    for (unsigned char val : decodedData) {
        std::cout << val;
    }
    std::cout << std::endl;

    return 0;
}



