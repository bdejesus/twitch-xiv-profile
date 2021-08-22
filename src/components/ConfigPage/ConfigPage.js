/* eslint-disable no-console */
import React, { createRef } from 'react';
import fetch from 'node-fetch';
import Authentication from '../../util/Authentication/Authentication';
import OtherTools from './OtherTools';
import Contribute from './Contribute';
import SystemMessage from './SystemMessage';
import ProfilePreview from './ProfilePreview';
import '../App/Themes.css';
import './Config.css';
import './ThemeSelect.css';

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
      inputValue: '',
      appConfig: {
        characterId: undefined,
        panelTheme: undefined
      }
    };
    this.textInput = createRef();
    this.saveSettings = this.saveSettings.bind(this);
    this.themeSelect = createRef();
    this.selectTheme = this.selectTheme.bind(this);
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
    }
  }

  componentDidUpdate() {
    const config = this.twitch.configuration;

    config.onChanged(() => {
      if (config
        && typeof config.broadcaster !== 'undefined'
        && typeof this.twitch.configuration.broadcaster.content !== 'undefined'
      ) {
        const { appConfig } = JSON.parse(
          this.twitch.configuration.broadcaster.content
        );

        if (typeof appConfig.characterId !== 'undefined') {
          const { characterId } = appConfig;
          this.setState({ inputValue: characterId, appConfig });
          this.fetchCharacterData(characterId);
        }
      }
    });
  }

  selectTheme(e) {
    const panelTheme = e.target.value;
    this.setState((state) => {
      const appConfig = { ...state.appConfig, panelTheme };
      this.twitch.configuration.set(
        'broadcaster', '2', JSON.stringify({ appConfig })
      );
      return { ...state, appConfig };
    });
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

  contextUpdate(context, delta) {
    if (delta.includes('theme')) {
      this.setState(() => ({ theme: context.theme }));
    }
  }

  fetchCharacterData(characterId) {
    fetch(`https://xivapi.com/character/${characterId}?extended=1`)
      .then((results) => results.json())
      .then((data) => {
        const message = data.Error
          ? {
            type: 'error',
            message: 'Could not find character. Please make sure you entered the correct ID or URL.'
          }
          : undefined;

        this.setState((state) => {
          const appConfig = { ...state.appConfig, characterId };
          this.twitch.configuration.set(
            'broadcaster', '2', JSON.stringify({ appConfig })
          );

          return {
            message,
            appConfig,
            data: data.Character
          };
        });
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

  updateInputValue(inputValue) {
    this.setState(() => ({ inputValue }));
  }

  render() {
    const {
      data, theme, appConfig, message, inputValue
    } = this.state;
    const themeClass = `App-${appConfig.panelTheme || theme}`;

    if (this.state.finishedLoading && this.Authentication.isModerator()) {
      return (
        <div className={`Config App ${themeClass}`}>
          <div className='content'>
            <h1>Eorzea Profile Panel Configuration</h1>

            { data && (
              <ProfilePreview
                avatar={data.Avatar}
                name={data.Name}
                classJob={data.ActiveClassJob}
                theme={themeClass}
              />
            )}

            <label>
              <span className='label-text'>
                Your Character ID or Lodestone Character Profile URL:
              </span>

              <div className='fieldset'>
                <input
                  type='text'
                  name='characterId'
                  className='form-control'
                  ref={this.textInput}
                  data-state={message ? message.type : null}
                  value={inputValue}
                  onChange={({ currentTarget }) => {
                    this.updateInputValue(currentTarget.value);
                  }}
                />

                <button
                  type='button'
                  className='save-button'
                  onClick={this.saveSettings}
                  disabled={message && message.type === 'loading'}
                  data-state={message ? message.type : null}
                >
                  Load Profile
                </button>
              </div>
            </label>

            { message && <SystemMessage message={message} /> }

            <p className='guide'>
              <a target='_blank' href='https://na.finalfantasyxiv.com/lodestone/' rel='noreferrer'>Visit the Final Fantasy Lodestone website</a> and log in with your account to access your character profile.
            </p>

            <fieldset
              className='theme-select'
              onChange={this.selectTheme}
              ref={this.themeSelect}
            >
              <span className='label-text'>
                Theme
              </span>

              <ul className='theme-options'>
                <li>
                  <label className='App-dark'>
                    <input
                      type='radio'
                      name='panelTheme'
                      value='dark'
                      defaultChecked={appConfig.panelTheme === 'dark'}
                    />
                    <span className='label-text'>Dark</span>
                  </label>
                </li>

                <li>
                  <label className='App-light'>
                    <input
                      type='radio'
                      name='panelTheme'
                      value='light'
                      defaultChecked={appConfig.panelTheme === 'light'}
                    />
                    <span className='label-text'>Light</span>
                  </label>
                </li>

                <li>
                  <label className='App-classic'>
                    <input
                      type='radio'
                      name='panelTheme'
                      value='classic'
                      defaultChecked={appConfig.panelTheme === 'classic'}
                    />
                    <span className='label-text'>Classic</span>
                  </label>
                </li>
              </ul>
            </fieldset>

            <hr />
            <OtherTools />
            <hr />
            <Contribute />
          </div>
        </div>
      );
    }

    return (
      <div className={`Config App ${themeClass}`}>
        <div>
          Loading...
        </div>
      </div>
    );
  }
}
