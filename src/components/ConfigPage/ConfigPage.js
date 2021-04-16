/* eslint-disable no-console */
import React, { createRef } from 'react';
import fetch from 'node-fetch';
import Authentication from '../../util/Authentication/Authentication';

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
      error: null,
      success: null,
      isLoading: false,
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

      this.twitch.configuration.onChanged(() => {
        const config = this.twitch.configuration.broadcaster;
        if (config.content) {
          const { characterId } = JSON.parse(config.content);
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
        error: 'Invalid character ID or URL',
        success: false
      }));
    } else {
      this.setState(() => ({
        error: null,
        success: false,
        isLoading: true
      }));

      fetch(`https://xivapi.com/character/${characterId}?extended=1`)
        .then((results) => results.json())
        .then((data) => {
          this.setState(() => ({
            error: null,
            success: true,
            isLoading: false,
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
            error: 'Character not found',
            success: false,
            isLoading: false
          }));
        });
    }
  }

  render() {
    if (this.state.finishedLoading && this.Authentication.isModerator()) {
      return (
        <div className='Config'>
          <div className={
              this.state.theme === 'light'
                ? 'Config-light'
                : 'Config-dark'
            }
          >
            <h1>Eorzea Profile Panel Configuration</h1>

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
                data-error={this.state.error !== null}
                placeholder={this.state.characterId}
              />
            </label>

            { this.state.error && (
              <div className='error-message'>{this.state.error}</div>
            )}

            <p className='guide'>
              <a target='_blank' href='https://na.finalfantasyxiv.com/lodestone/' rel='noreferrer'>Visit the Final Fantasy Lodestone website</a> and log in with your account to access your character profile.
            </p>

            <button
              type='button'
              className='save-button'
              onClick={this.saveSettings}
              disabled={this.state.isLoading}
              data-loading={this.state.isLoading}
            >
              Save
            </button>

            { this.state.isLoading && (
              <span className='info-message'>
                Fetching character profile...
              </span>
            )}
            { this.state.success && (
              <span className='success-message'>Saved!</span>
            )}

            { this.state.success && (
              <div className='profile-preview'>
                {console.log(this.state.data)}
                <div className='profile-avatar'>
                  <img src={this.state.data.Avatar} alt={this.state.data.Name} />
                </div>
                <div className='profile-body'>
                  <h3>{this.state.data.Name}</h3>
                  <div className='activeClassJob'>
                    Level {this.state.data.ActiveClassJob.Level} {this.state.data.ActiveClassJob.UnlockedState.Name}
                  </div>
                </div>
              </div>
            )}

            <div className='contribute'>
              <a
                href='https://github.com/bdejesus/twitch-xiv-profile'
                target='_blank'
                rel='noreferrer'
              >
                Github
              </a>
            &nbsp;•&nbsp;
              <a href='https://github.com/bdejesus/twitch-xiv-profile' target='_blank' rel='noreferrer'>
                Report an Issue or Request a Feature
              </a>
              &nbsp; |&nbsp;
              Powered by <a href='https://xivapi.com'>XIVAPI</a>
            </div>

            <hr />

            <h2>Other Tools</h2>
            <div className='block'>
              <h3>
                <a
                  href='https://xivbars.bejezus.com'
                  target='_blank'
                  rel='noreferrer'
                >
                  XIV Bars – W Cross Hotbar Planner &amp; Simulator
                </a>
              </h3>
              <p>
                A Final Fantasy XIV W Cross Hotbar (WXHB) Planning and Simulation Tool. Lay out and export your Final Fantasy XIV Hotbars for any Job/Class and export to a macro or share with others!
              </p>
            </div>
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
