/* eslint-disable no-console */
import React from 'react';
import fetch from 'node-fetch';
import Authentication from '../../util/Authentication/Authentication';
import CharacterSheet from '../CharacterSheet/CharacterSheet';

import './App.css';
import './Themes.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.Authentication = new Authentication();

    // if the extension is running on twitch or dev rig, set the shorthand here. otherwise, set to null.
    this.twitch = window.Twitch ? window.Twitch.ext : null;
    this.state = {
      finishedLoading: false,
      theme: 'light',
      isVisible: true,
      data: {},
      loadingCharacter: false,
      error: null,
      appConfig: undefined
    };
  }

  componentDidMount() {
    if (this.twitch) {
      this.twitch.onAuthorized((auth) => {
        this.Authentication.setToken(auth.token, auth.userId);
        if (!this.state.finishedLoading) {
          // if the component hasn't finished loading (as in we've not set up after getting a token), let's set it up now.

          // now we've done the setup for the component, let's set the state to true to force a rerender with the correct data.
          this.setState(() => ({ finishedLoading: true }));
        }
      });

      // eslint-disable-next-line no-unused-vars
      this.twitch.onVisibilityChanged((isVisible, _c) => {
        this.visibilityChanged(isVisible);
      });

      this.twitch.onContext((context, delta) => {
        this.contextUpdate(context, delta);
      });
    }
  }

  componentDidUpdate() {
    const config = this.twitch.configuration;
    config.onChanged(() => {
      if (config && config.broadcaster.content) {
        const { appConfig } = JSON.parse(config.broadcaster.content);
        this.setState(() => ({ appConfig }));
        this.fetchCharacterData(appConfig.characterId);
      }
    });
  }

  visibilityChanged(isVisible) {
    this.setState(() => ({ isVisible }));
  }

  contextUpdate(context, delta) {
    if (delta.includes('theme')) {
      this.setState(() => ({ theme: context.theme }));
    }
  }

  fetchCharacterData(id) {
    this.setState(() => ({ loadingCharacter: true, error: null }));

    const baseURL = 'https://xivbars.bejezus.com/api/character';
    const characterURL = `${baseURL}/${id}`;

    fetch(characterURL)
      .then((results) => results.json())
      .then((data) => {
        this.setState(() => ({ data: data.character, loadingCharacter: false }));
      })
      .catch((error) => {
        this.setState(() => ({
          loadingCharacter: false,
          error: "Couldn't load FFXIV Character Profile"
        }));
        console.error(error);
      });
  }

  render() {
    if (this.state.finishedLoading && this.state.isVisible) {
      const {
        loadingCharacter, error, data, theme, appConfig
      } = this.state;

      const themeClass = (typeof appConfig.toString() !== 'undefined')
        ? `App-${appConfig.panelTheme}`
        : `App-${theme}`;

      return (
        <div className={`App ${themeClass}`}>
          { loadingCharacter && <div className='message'>Loading...</div> }
          { error && <div className='message'>Character not found</div> }
          { data.profile && <CharacterSheet Character={data} /> }
        </div>
      );
    }
    return (
      <div className='App' />
    );
  }
}
