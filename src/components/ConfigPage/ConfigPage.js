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
    this.textInput = createRef();
    this.saveSettings = this.saveSettings.bind(this);
    this.themeSelect = createRef();
    this.selectTheme = this.selectTheme.bind(this);
    this.state = {
      finishedLoading: false,
      theme: 'light',
      message: undefined,
      inputValue: undefined,
      appConfig: {
        characterId: undefined,
        character: undefined,
        panelTheme: undefined
      }
    };
  }

  componentDidMount() {
    // do config page setup as needed here
    if (this.twitch) {
      this.twitch.onAuthorized((auth) => {
        this.Authentication.setToken(auth.token, auth.userId);
        if (!this.state.finishedLoading) {
          // if the component hasn't finished loading (as in we've not set up after getting a token), let's set it up now.
          const configuration = JSON.parse(this.twitch.configuration.broadcaster.content);
          this.twitch.configuration.set('broadcaster', '3', JSON.stringify({
            appConfig: {
              characterId: undefined,
              character: undefined,
              panelTheme: undefined
            }
          }));

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
      if (config && !!config.broadcaster && !!config.broadcaster.content) {
        const content = JSON.parse(this.twitch.configuration.broadcaster.content);
        if (content.appConfig?.characterId) {
          this.setState({ inputValue: content.appConfig.characterId, appConfig: content.appConfig });
          this.fetchCharacterData(content.appConfig.characterId);
        }
      }
    });
  }

  selectTheme(e) {
    const panelTheme = e.target.value;
    this.setState((state) => ({
      ...state,
      appConfig: { ...state.appConfig, panelTheme }
    }));
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
    if (delta.includes('theme')) this.setState(() => ({ theme: context.theme }));
  }

  fetchCharacterData(characterId) {
    const baseURL = 'https://xivbars.bejezus.com/api/character';
    const characterURL = `${baseURL}/${characterId}`;
    fetch(characterURL)
      .then((results) => results.json())
      .then((data) => {
        const message = (!data.character) ? { type: 'error', message: 'Character not found' } : null;
        this.setState((state) => {
          const appConfig = { ...state.appConfig, character: data.character };
          this.twitch.configuration.set('broadcaster', '3', JSON.stringify({ appConfig }));
          return { appConfig, message };
        });
      })
      .catch(() => {
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
      theme, appConfig, message
    } = this.state;
    const themeClass = `App-${appConfig.panelTheme || theme}`;

    if (this.state.finishedLoading && this.Authentication.isModerator()) {
      return (
        <div className={`Config App ${themeClass}`}>
          <div className='content'>
            <h1>Eorzea Profile Panel Configuration</h1>

            { appConfig.character && (
              <ProfilePreview
                avatar={appConfig.character.face}
                name={appConfig.character.name}
                classJobIcon={appConfig.character.activeClassJob.icon}
                classJobText={appConfig.character.activeClassJob.textImage}
                level={appConfig.character.activeClassJob.level}
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
                  defaultValue={appConfig?.character?.id}
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
