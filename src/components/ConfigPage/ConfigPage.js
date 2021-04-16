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
    window.Twitch.ext.configuration.onChanged(() => {
      console.log('CONFIG');
      console.log(window.Twitch.ext.configuration.broadcaster);
    });
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
    }
  }

  contextUpdate(context, delta) {
    if (delta.includes('theme')) {
      this.setState(() => ({ theme: context.theme }));
    }
  }

  saveSettings() {
    // https://na.finalfantasyxiv.com/lodestone/character/6142165/
    const textInputValue = this.textInput.current.value;
    const characterId = textInputValue.split('/').filter((i) => i.match(/[0-9]/))[0];

    if (!characterId) {
      this.setState(() => ({
        error: 'Invalid character ID or URL',
        success: false
      }));
    } else {
      this.setState(() => ({
        error: null,
        success: false,
        isLoading: true,
        characterId
      }));

      fetch(`https://xivapi.com/character/${characterId}?extended=1`)
        .then((results) => results.json())
        .then((data) => {
          const dataConfig = {
            Name: data.Character.Name,
            Title: data.Character.Title,
            Town: data.Character.Town,
            Server: data.Character.Server,
            DC: data.Character.DC,
            Tribe: data.Character.Tribe,
            Race: data.Character.Race,
            Nameday: data.Character.Nameday,
            GuardianDeity: data.Character.GuardianDeity,
            FreeCompanyName: data.Character.FreeCompanyName,
            Bio: data.Character.Bio,
            ActiveClassJob: data.Character.ActiveClassJob,
            Portrait: data.Character.Portrait,
            GearSet: data.Character.GearSet
          };

          this.setState(() => ({
            error: null,
            success: true,
            isLoading: false
          }));

          window.Twitch.ext.configuration.set(
            'broadcaster', '1', JSON.stringify(dataConfig)
          );

          console.log('SAVED!');
        })
        .catch((error) => {
          console.error(error);
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
                Your Character ID or Lodestone Character URL:
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

            { this.state.success && (
              <span className='success-message'>Saved!</span>
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
            &nbsp;|&nbsp;
              <a href='https://xivapi.com'>XIVAPI</a>
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
