/* eslint-disable no-console */
import React, { createRef } from 'react';
import fetch from 'node-fetch';
import Authentication from '../../util/Authentication/Authentication';
import OtherTools from './OtherTools';
import Contribute from './Contribute';
import SystemMessage from './SystemMessage';
import ProfilePreview from './ProfilePreview';
import './Config.css';

export default class ConfigPage extends React.Component {
  constructor(props) {
    super(props);
    this.Authentication = new Authentication();

    // if the extension is running on twitch or dev rig, set the shorthand here. otherwise, set to null.
    this.twitch = window.Twitch ? window.Twitch.ext : null;
    this.state = {
      finishedLoading: false,
      theme: 'light',
      message: undefined,
      characterId: undefined
    };
    this.textInput = createRef();
    this.saveSettings = this.saveSettings.bind(this);
  }

  componentDidMount() {
    // do config page setup as needed here
    if (this.twitch) {
      this.twitch.onAuthorized((auth) => {
        this.Authentication.setToken(auth.token, auth.userId);
        if (!this.state.finishedLoading) {
          // if the component hasn't finished loading (as in we've not set up after getting a token), let's set it up now.

          // now we've done the setup for the component, let's set the state to true to force a rerender with the correct data.
          this.setState(() => ({ finishedLoading: true }));
        }
      });

      this.twitch.onContext((context, delta) => {
        this.contextUpdate(context, delta);
      });

      const configuration = this.twitch.configuration;
      configuration.onChanged(() => {
        if (configuration.broadcaster.content) {
          const { characterId } = JSON.parse(configuration.broadcaster.content);
          this.setState(() => ({ characterId }));
        }
      });
    }
  }

  contextUpdate(context, delta) {
    if (delta.includes('theme')) {
      this.setState(() => ({ theme: context.theme }));
    }
  }

  saveSettings() {
    const textInputValue = this.textInput.current.value;
    const characterId = textInputValue.split('/')
      .filter((i) => (i && i.match(/^\d*$/)))[0];

    if (!characterId) {
      this.setState(() => ({
        message: { type: 'error', message: 'Invalid character ID or URL' }
      }));
    } else {
      this.setState(() => ({
        message: { type: 'loading', message: 'Fetching character profie...' },
      }));

      this.fetchCharacterData(characterId);
    }
  }

  fetchCharacterData(characterId) {
    fetch(`https://xivapi.com/character/${characterId}?extended=1`)
      .then((results) => results.json())
      .then((data) => {
        console.log(data);
        const message = data.Error
          ? {
            type: 'error',
            message: 'Could not find character. Please make sure you entered the correct ID or URL.'
          }
          : { type: 'success', message: 'Character profile found!' };

        this.setState(() => ({
          message,
          characterId,
          data: data.Character
        }));
        this.twitch.configuration.set(
          'broadcaster', '2', JSON.stringify({ characterId })
        );
      })
      .catch((error) => {
        console.error(error);
        this.twitch.rig.log(error);
        this.setState(() => ({
          message: { type: 'error', message: 'Could not fetch character' },
          data: null
        }));
      });
  }

  render() {
    if (this.state.finishedLoading && this.Authentication.isModerator()) {
      return (
        <div className='Config'>
          <div className={
              this.state.theme === 'light' ? 'Config-light' : 'Config-dark'
            }
          >
            <h1>Eorzea Profile Panel Configuration</h1>

            { this.state.message && (
              <SystemMessage message={this.state.message} />
            )}

            { this.state.data && (
              <ProfilePreview
                avatar={this.state.data.Avatar}
                name={this.state.data.Name}
                classJob={this.state.data.ActiveClassJob}
              />
            )}

            <label>
              <span className='label-text'>
                Your Character ID or Lodestone Character Profile URL:
              </span>
              <br />
              <input
                type='text'
                name='characterId'
                className='form-control'
                ref={this.textInput}
                data-state={this.state.message ? this.state.message.type : null}
                placeholder={this.state.characterId}
              />
            </label>

            <p className='guide'>
              <a target='_blank' href='https://na.finalfantasyxiv.com/lodestone/' rel='noreferrer'>Visit the Final Fantasy Lodestone website</a> and log in with your account to access your character profile.
            </p>

            <button
              type='button'
              className='save-button'
              onClick={this.saveSettings}
              disabled={
                this.state.message && this.state.message.type === 'loading'
              }
              data-state={this.state.message ? this.state.message.type : null}
            >
              Save
            </button>

            <hr />

            <OtherTools />

            <hr />

            <Contribute />
          </div>
        </div>
      );
    }

    return (
      <div className='Config'>
        <div className={this.state.theme === 'light' ? 'Config-light' : 'Config-dark'}>
          Loading...
        </div>
      </div>
    );
  }
}
