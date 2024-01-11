# Changelog

## v1.2.1 - UI Fixups
- Fixes a bug where the configuration page doesn't load when there is no character data the broadcaster config
- Adds a Reset button for clearing character data

## v1.2.0 - Backend Service Update
- Points configuration to retrieve character data from a new endpoint at xivbars.bejezus.com/api/character/:id
- Removes XHR requests from the public facing app to reduce number of requests
- Updates character data JSON structure
- Adds a Reset Button

## v1.1.2 - Hotfix Release
- Fixes an undefined config object preventing the Config panel from loading.

## v1.1.1 - Dependency Updates
- Bumps dependency versions
- Adds .node-version file

## v1.1.0 - Theme Selection

- Adds selections for Light, Dark, and Classic themes
- Loads character preview if `characterId` is set
- Updates packages to most recent versions

## v1.0.1 - Bugfix for ConfigPage

- Bugfix: ConfigPage getting stuck on a Loading state
  - Moves loading of configuration from `componentDidMount` to `componentDidUpdate` to keep from getting stuck on a loading state
- Cleanup: Removes console.log from CharacterSheet.js

## v1.0.0 - Initial release

- App view
  - Loads Character ID from configuration service and fetch data on load
  - Display Profile details
    - Name
    - Title
    - Hometown, Server, Datacenter
  - Diplay current active JobClass and level
  - Display currently equipped gear
    - Display tooltips on hover for each item
    - Display glamour item if it exists for each item
- Config view
  - Render form controls that accepts:
    - Character ID
    - Character Profile URL
  - Validate input field value
  - Fetching Character Profile when SAVE button is clicked and saves it to configuration service
