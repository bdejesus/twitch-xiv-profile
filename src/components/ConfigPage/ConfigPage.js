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
    this.themeSelect = createRef();
    this.loadProfile = this.loadProfile.bind(this);
    this.unloadProfile = this.unloadProfile.bind(this);
    this.selectTheme = this.selectTheme.bind(this);
    this.state = {
      finishedLoading: false,
      message: undefined,
      appConfig: {
        character: undefined,
        panelTheme: 'dark'
      }
    };
  }

  componentDidMount() {
    // do config page setup as needed here
    if (this.twitch) {
      this.twitch.onAuthorized((auth) => {
        // if the component hasn't finished loading (as in we've not set up after getting a token), let's set it up now.
        this.Authentication.setToken(auth.token, auth.userId);

        if (!this.state.finishedLoading) {
          const configuration = this.twitch.configuration?.broadcaster
            ? JSON.parse(this.twitch.configuration?.broadcaster?.content)
            : undefined;

          // now we've done the setup for the component, let's set the state to true to force a rerender with the correct data.
          this.setState((prevState) => ({
            finishedLoading: true,
            appConfig: configuration?.appConfig || prevState.appConfig
          }));
        }
      });

      this.twitch.onContext((context, delta) => {
        this.contextUpdate(context, delta);
      });
    }
  }

  componentDidUpdate() {
    const config = this.twitch.configuration;
    const appConfig = { ...config.appConfig, ...this.state.appConfig };
    this.twitch.configuration.set('broadcaster', '3', JSON.stringify({ appConfig }));
  }

  componentWillUnmount() {
    this.setState({ finishedLoading: false });
  }

  selectTheme(e) {
    const panelTheme = e.target.value;
    this.setState((prevState) => ({ ...prevState, appConfig: { ...prevState.appConfig, panelTheme } }));
  }

  loadProfile() {
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
    const baseURL = 'https://www.xivbars.com/api/character';
    const characterURL = `${baseURL}/${characterId}`;
    fetch(characterURL)
      .then((results) => results.json())
      .then((data) => {
        const message = (!data.character) ? { type: 'error', message: 'Character not found' } : null;

        if (message) {
          this.setState({ message });
        } else {
          this.setState((state) => {
            const appConfig = { ...state.appConfig, character: data.character };
            return { appConfig, message };
          });
        }
      })
      .catch(() => this.setState({ message: { type: 'error', message: 'Could not fetch character' } }));
  }

  unloadProfile() {
    this.setState((prevState) => {
      this.textInput.current.value = '';
      const updatedConfig = { ...prevState.appConfig, character: undefined };
      return { ...prevState, appConfig: updatedConfig };
    });
  }

  render() {
    const {
      theme, appConfig, message
    } = this.state;
    const themeClass = `App-${appConfig?.panelTheme || theme}`;

    if (this.state.finishedLoading) {
      return (
        <div className={`Config App ${themeClass}`}>
          <div className='content'>
            <h1>Eorzea Profile Panel Configuration</h1>
            { appConfig?.character && (
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
                />

                <button
                  type='button'
                  className='button save-button'
                  onClick={this.loadProfile}
                  disabled={message?.type === 'loading'}
                  data-state={message ? message.type : null}
                >
                  { this.state.appConfig.character ? "Refresh" : "Load Profile" }
                </button>

                <button
                  type='button'
                  className='button'
                  onClick={this.unloadProfile}
                >
                  Reset
                </button>
              </div>
            </label>

            { message && <SystemMessage message={message} /> }

            <p className='guide'>
              <a target='_blank' href='https://na.finalfantasyxiv.com/lodestone/' rel='noreferrer'>Visit the Final Fantasy Lodestone website</a> and log in with your account to access your character profile.
            </p>

            { /* Theme Select  */ }
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
                      defaultChecked={appConfig.panelTheme === 'dark' || !appConfig.panelTheme}
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

            { /* Footer Items */ }
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
