/* eslint-disable no-console */
import React from 'react';
import fetch from 'node-fetch';
import Authentication from '../../util/Authentication/Authentication';
import CharacterSheet from '../CharacterSheet/CharacterSheet';

import './App.css';

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
      error: null
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

      this.twitch.listen('broadcast', (target, contentType, body) => {
        this.twitch.rig.log(`New PubSub message!\n${target}\n${contentType}\n${body}`);
        // now that you've got a listener, do something with the result...
        // do something...
      });

      this.twitch.onVisibilityChanged((isVisible, _c) => {
        this.visibilityChanged(isVisible);
      });

      this.twitch.onContext((context, delta) => {
        this.contextUpdate(context, delta);
      });

      const configuration = this.twitch.configuration;
      configuration.onChanged(() => {
        if (configuration && configuration.broadcaster.content) {
          const config = JSON.parse(configuration.broadcaster.content);
          this.fetchCharacterData(config.characterId);
        }
      });
    }
  }

  componentWillUnmount() {
    if (this.twitch) {
      this.twitch.unlisten('broadcast', () => console.log('successfully unlistened'));
    }
  }

  visibilityChanged(isVisible) {
    this.setState(() => ({
      isVisible
    }));
  }

  contextUpdate(context, delta) {
    if (delta.includes('theme')) {
      this.setState(() => ({ theme: context.theme }));
    }
  }

  fetchCharacterData(id) {
    this.setState(() => ({ loadingCharacter: true, error: null }));

    fetch(`https://xivapi.com/character/${id}?extended=1`)
      .then((results) => results.json())
      .then((data) => {
        this.setState(() => ({ data, loadingCharacter: false }));
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
        loadingCharacter, error, data, theme
      } = this.state;
      const { Character } = data;
      return (
        <div className='App'>
          <div
            className={theme === 'light' ? 'App-light' : 'App-dark'}
          >
            { loadingCharacter && <div className='message'>Loading...</div> }
            { error && <div className='message'>Character not found</div> }
            { Character && <CharacterSheet Character={Character} /> }
          </div>
        </div>
      );
    }
    return (
      <div className='App' />
    );
  }
}
