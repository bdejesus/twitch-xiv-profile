# Changelog

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