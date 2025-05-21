# Telegram Self Forwarder in JavaScript

### <strong>I take no responsibility for restricted or banned Telegram accounts using this script.</strong>
### <strong>Using a self-bot on a Telegram user account may violate the <a href="https://core.telegram.org/terms">Telegram Terms of Service</a>.</strong>
### <strong>Use this tool at your own risk.</strong>

## Getting Started

To set up a local copy of this self-bot and get it running, follow the steps below.

### Prerequisites

Here’s what you need to use the self-bot and how to install it:

### How to Get the Telegram API ID and API Hash?

- **Node.js**  
  Get them by registering an application at [my.telegram.org](https://my.telegram.org).

- **Node.js**  
  To install Node.js, go to [nodejs.org](https://nodejs.org/) and download the latest stable version. Once installed, you can verify that Node.js and NPM are correctly installed by running:

  **Node.js 16.6.0 or newer is required.**

  > Recommended Node.js version: 18+ (LTS)
  ```sh
  node -v
  npm -v
  ```

### Installation

1. **Clone the repository**  
   Use the following command to clone the GitHub repository:

   ```sh
   git clone https://github.com/originels/Telegram-Self-Forwarder.git
   ```

2. **Install NPM dependencies**  
   Run the following command to install the necessary packages via NPM:

   ```sh
   npm install
   ```

3. **Configure your bot**  
   Create a `config.json` file in the project folder and enter your Telegram API ID, API hash, source channel ID, and the phone number details linked to your account (country prefix and phone number):

   ```json
   {
     "session": false,
     "hash": "YOUR_APP_HASH_HERE",
     "id": 123456789,
     "channel": 123456789012345,
     "phone": {
          "prefix": "YOUR_COUNTRY_CODE",
          "number": "PHONE_NUMBER_WITHOUT_PREFIX"
     }
   }
   ```

### Running the Bot

To start the bot, execute the following command:

   ```sh
   node index.js
   ```

### Features

   - [x] **Automatic Transfer**: Automatically transfers the latest message from a source channel or group to all channels and groups where the account is present.
   - [x] **Regular Interval Check**: Transfers messages at a fixed interval while the script is running.
   - [ ] **Exclusion Management**: *(Coming soon)* Supports a list of channels or groups to exclude from transfers. Messages will not be transferred to these excluded destinations even if the account is a member.

### Warning

Using self-bots or unofficial scripts on Telegram may violate their terms of service and could lead to restrictions or account actions. Use this self-forwarder script at your own risk.

### Help and Support

For any questions or issues, please open an issue on GitHub.
