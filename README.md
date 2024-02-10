# Factorio Mods and Dependencies.
A small code to download mods for the game factorio. The best thing about this code is that you enter the URL of the mod that you want it to download, and it downloads all the dependencies automatically.
# Requirements
* Pupperteer
* Nodejs
# How to use
1. Clone the repo
   ```sh
   git clone https://github.com/KingDasWinx/FactorioModsDependencies.git
   ```
3. Install Pupperteer
   ```sh
   npm install pupperteer
   ```
4. Open the ```factorio.js``` and change the URL at line 79. Don't forget that the link must be from ```https://re146.dev```
   ```js
   const modBaseUrl = 'https://re146.dev/factorio/mods/en#https://mods.factorio.com/mod/YOUR_MOD_NAME_HERE';
   ```
5. Use this command to run
   ```sh
   node factorio.js
   ```

# Enjoy!
If anyone has any improvements to my code, they can make a commit to the project and I will check and approve it. I'm new to this still 🙂.
