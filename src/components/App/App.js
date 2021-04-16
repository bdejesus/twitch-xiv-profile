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
      data: {}
    };

    console.log(this.twitch.configuration);

    this.twitch.configuration.onChanged(() => {
      // This value is ALWAYS null
      console.log(this.twitch.configuration);
    });
  }

  componentDidMount() {
    if (this.twitch) {
      fetch('https://xivapi.com/character/6142165?extended=1')
        .then((results) => results.json())
        .then((data) => {
          this.setState(() => ({ data }));
        });

      this.twitch.onAuthorized((auth) => {
        this.Authentication.setToken(auth.token, auth.userId);
        if (!this.state.finishedLoading) {
          const { global, broadcaster } = this.twitch.configuration;

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
            <h1>
              <a
                href='https://github.com/bdejesus/twitch-xiv-profile'
                target='_blank'
                rel='noreferrer'
              >
                Eorzea Profile
              </a>
            </h1>
            { Character && <CharacterSheet Character={Character} />}
          </div>
        </div>
      );
    }
    return (
      <div className='App' />
    );
  }
}
