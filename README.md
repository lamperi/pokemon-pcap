#pokémon-pcap
============

**Pokémon-Pcap** is an Instacheck-compactible tool to capture and display Pokémon data structures over 3DS wireless communication on Pokémon X and Pokémon Y on posix systems.


##How to use
============

First, you will need a way to route 3DS traffic via your computer. The simplest way would be to host a wireless hotspot.

Afterwards, get a copy of the repository

    git clone https://github.com/lamperi/pokemon-pcap.git

Load npm dependencies

    cd pokemon-pcap
    npm install

Copy the example configuration file. 

    cp config_example.json config.json
    
Edit *3ds.mac* to be your 3DS MAC address. Edit *runas* to have valid user and group on your system. Choose a suitable device for *pcap.interface*.

Then, run the program.

    sudo node main.js
    
If no error messages are printed, you can open your web browser on <http://localhost:5008>.

## Resources 

* [Smogon thread for Instacheck](http://www.smogon.com/forums/threads/instacheck-hotspot-a-fast-pok%C3%A9mon-checker-for-xy.3492531/)
* [Project Pokemon: Pkx data structure](http://projectpokemon.org/wiki/Pokemon_X/Y_3DS_Structure)
