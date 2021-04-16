import React from 'react';
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
  }

  componentDidMount() {
    if (this.twitch) {
      const { configuration } = window.Twitch.ext;
      configuration.onChanged(() => {
        const config = configuration.broadcaster;
        console.log('PANEL');
        console.log(config);
      });

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
            { Character
              ? <CharacterSheet Character={Character} />
              : <div className='not-found'>Character not found</div>}
          </div>
        </div>
      );
    }
    return (
      <div className='App' />
    );
  }
}
