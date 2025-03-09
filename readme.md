# Mudae-OP Selfbot

## 📋 Long / Technical Version

This project is a Discord selfbot developed in Node.js using the [discord.js-selfbot-v13](https://github.com/AnIdiotsGuide/discord.js-selfbot-v13) library. It interacts automatically with the Mudae bot to optimize rolls, claims, and kakera reactions.

## 🎯 General Description

The selfbot connects to Discord to listen for messages in a specific channel coming from Mudae. It analyzes messages to:
- Process the results of the `$tu` command (remaining rolls, claim status, kakera stocks, etc.)
- Detect claim opportunities (in the form of "Wished by") and execute the corresponding command.
- Identify and react to high-value kakera by clicking on the associated buttons.

## 🔧 Main Features

### Analyzing Mudae Messages
- **Detailed Parsing**: Extracting useful information via regular expressions.
- **Opportunity Detection**: Identifying claim possibilities and recognizing high-value kakera.

### Automating Mudae Commands
- Automatically sending the `$ma` (roll) command based on available rolls.
- Executing the `$mk` and `$tu` commands once the rolls are exhausted.
- Resetting the claim timer using the `$rt` command when necessary.

### Managing Cooldowns and Timers
- Using `setTimeout` to respect the delays imposed by Mudae.
- Dynamically calculating the remaining time before roll or claim reset.
- Incorporating random delays (between 2s and 15s) to simulate human behavior.

### Automated Interactions with Discord
- Utilizing `clickButton` to automatically act on kakera buttons.
- Automatically reacting to messages that display high-value kakera.

## ⚙️ Technologies Used

- **Node.js**  
    Server-side JavaScript runtime environment.

- **discord.js-selfbot-v13**  
    Library for creating and managing a Discord selfbot.

- **ms**  
    Module to convert time values into milliseconds.

- **Configuration**  
    Managed via a `config.js` file to customize and adapt the bot's parameters.

## 🛠️ Architecture and Logic

### Main Event
- **messageCreate**  
    The bot listens to all message creations and filters those originating from Mudae in a predefined channel.

### Extraction and Parsing
- Analyzing messages to obtain:
    - Claim status.
    - Number of available rolls.
    - Kakera stocks.
    - Applicable cooldowns and resets.

### Decision Making
- If rolls remain: automatically execute the `$ma` command.
- If a claim opportunity is detected: click the corresponding button.
- If kakera are identified: perform the necessary action (click or react).

### Managing Timers and Delays
- Implementing random delays to avoid overly "bot-like" behavior by better simulating human interaction.

## 🚀 Use Cases

- **Mudae Roll Automation**  
    Optimizes interactions in Mudae to maximize the chances of acquiring rare characters and accumulating kakera.

- **Action Optimization**  
    Speeds up claims and kakera collection while adhering to Discord's rules.

- **Time Saving**  
    Reduces manual intervention by automating repetitive actions on Discord.

## ⚠️ Legal and Ethical Notice

This project utilizes a selfbot, which is against Discord's Terms of Service. Using selfbots can lead to account suspension. It is recommended to use this project for educational purposes or on private/test servers.
