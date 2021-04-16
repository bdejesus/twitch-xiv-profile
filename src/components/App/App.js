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

      this.twitch.configuration.onChanged(() => {
        if (this.twitch.configuration) {
          const config = this.twitch.configuration.broadcaster;
          if (config.content) {
            this.setState(() => ({ loadingCharacter: true, error: null }));
            const { characterId } = JSON.parse(config.content);
            fetch(`https://xivapi.com/character/${characterId}?extended=1`)
              .then((results) => results.json())
              .then((data) => {
                this.setState(() => ({ data, loadingCharacter: false }));
              })
              .catch((error) => {
                this.setState(() => ({
                  loadingCharacter: false,
                  error: "Couldn't load FFXIV Character Profile"
                }));
              });
          }
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

  render() {
    if (this.state.finishedLoading && this.state.isVisible) {
      const { Character } = this.state.data;
      return (
        <div className='App'>
          <div className={this.state.theme === 'light' ? 'App-light' : 'App-dark'}>
            { this.state.loadingCharacter && (
              <div className='message'>Loading...</div>
            )}
            { this.state.error && (
              <div className='message'>Character not found</div>
            )}
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
