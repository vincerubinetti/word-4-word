/*
    This C++ program pre-computes the par distance between each pair of
    regular words, i.e. shortest path between them using only regular words.
    
    The Floyd-Warshall algorithm used to do this is too slow to be used in real
    time, or to be implemented in JavaScript at all.
*/

// includes
#include <limits.h>
#include <iostream>
#include <fstream>
#include <string>
#include <vector>

using namespace std;

// large number constant for path finding
const int Infinity = UCHAR_MAX;

// word object
struct Word {
    string text;
    vector<Word*> links;

    Word(string word)
    {
        text = word;
    }
};

// checks if two words are exactly 1 letter different
bool OneLetterDifferent(string wordA, string wordB)
{
    unsigned int diff = 0;
    for (unsigned int letter = 0; letter < wordA.length(); letter++) {
        if (wordA[letter] != wordB[letter])
            diff++;
        if (diff > 1)
            return false;
    }

    return diff == 1;
}

// checks if two words are linked
bool AreLinked(Word* wordA, Word* wordB)
{
    for (unsigned int link = 0; link < wordA->links.size(); link++)
        if (wordA->links[link] == wordB)
            return true;

    for (unsigned int link = 0; link < wordB->links.size(); link++)
        if (wordB->links[link] == wordA)
            return true;

    return false;
}

// main processing
int main()
{
    cout << "importing dictionary..." << endl;

    vector<Word*> Dictionary;
    vector<Word*>::size_type DictionarySize;
    ifstream dictionaryFile("dictionary.yaml");
    string line;
    while (getline(dictionaryFile, line))
        // only extract regular words
        if (line.find("1") != string::npos)
            Dictionary.push_back(new Word(line.substr(0, 4)));
    dictionaryFile.close();
    DictionarySize = Dictionary.size();

    if (DictionarySize > 0) {
        cout << "dictionary imported" << endl;
        cout << DictionarySize << " words" << endl;
    }
    else {
        cout << "dictionary not found" << endl;
        return 0;
    }

    cout << "linking words..." << endl;

    // link together words that are one letter different
    for (unsigned int x = 0; x < DictionarySize; x++)
        for (unsigned int y = 0; y < DictionarySize; y++)
            if (x < y)
                if (OneLetterDifferent(Dictionary[x]->text, Dictionary[y]->text)) {
                    Dictionary[x]->links.push_back(Dictionary[y]);
                    Dictionary[y]->links.push_back(Dictionary[x]);
                }

    cout << "words linked" << endl;

    cout << "processing pars..." << endl;

    // floyd warshall algorithm

    // init 2d array of pars
    unsigned int** Pars;
    Pars = new unsigned int*[DictionarySize];
    for (unsigned int x = 0; x < DictionarySize; x++)
        Pars[x] = new unsigned int[DictionarySize];

    // fill array with values
    for (unsigned int x = 0; x < DictionarySize; x++)
        for (unsigned int y = 0; y < DictionarySize; y++) {
            // main diagonal cells, where start/end words are same
            if (x == y)
                Pars[x][y] = 0;
            // cells where start/end words are directly linked
            else if (AreLinked(Dictionary[x], Dictionary[y]))
                Pars[x][y] = 1;
            // all other cells, where dist between start/end words unknown
            else
                Pars[x][y] = Infinity;
        }

    // reduce and find min paths
    for (unsigned int z = 0; z < DictionarySize; z++)
        for (unsigned int x = 0; x < DictionarySize; x++)
            for (unsigned int y = 0; y < DictionarySize; y++)
                if (Pars[x][y] > Pars[x][z] + Pars[z][y])
                    Pars[x][y] = Pars[x][z] + Pars[z][y];

    // for convenience:
    // increment by 1 to reflect number of words in path rather than # of steps
    // set cells with infinite value to 0 (by forcing overflow)
    for (unsigned int x = 0; x < DictionarySize; x++)
        for (unsigned int y = 0; y < DictionarySize; y++)
            Pars[x][y]++;

    cout << "pars processed" << endl;

    cout << "exporting pars..." << endl;

    ofstream file;
    file.open("pars.dat", fstream::binary);

    // write triangular matrix of pars, 1 byte each
    for (unsigned int x = 0; x < DictionarySize; x++)
        for (unsigned int y = 0; y < DictionarySize; y++)
            if (x < y)
                file.write(reinterpret_cast<char*>(&Pars[x][y]), sizeof(unsigned char));

    file.close();

    cout << "pars exported" << endl;

    // clean up
    for (int word = 0; word < DictionarySize; word++) {
        delete Dictionary[word];
        delete[] Pars[word];
    }
    delete[] Pars;

    cout << "FINISHED" << endl;

    return 0;
}
