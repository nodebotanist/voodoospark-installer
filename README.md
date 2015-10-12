# voodoospark-installer

Installs voodoospark from the command line, so you don't have to use the Particle IDE.

## Installation

`npm install -g voodoospark-installer`

## Usage

Don't use this until you've created a Particle login (it makes you create one when you claim a device.)

It'll ask for your username and password, then ask which device you want to flash voodoospark to.

`voodoospark`

You can install the voodoospark latest from GitHub using

`voodoospark install`

Or run `voodoospark` alone, which will install the firmware if it is missing.

`voodoospark update` fetches the newest voodoospark from GitHub.

`voodoospark flash` is aliased to `voodoospark` and will ask you for information, then install voodoospark on your device.