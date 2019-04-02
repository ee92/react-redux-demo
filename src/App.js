import React from 'react'
import {api_key} from './config.js'

const moods = ['😎', '🤔', '😍', '👽', '🤠']

class App extends React.Component {

  state = {
    gif: '',
    gifSpinner: false,
    currentMood: '🤔'
  }

  updateGif = (url) => this.setState({gif: url})

  toggleSpinner = () => this.setState({gifSpinner: !this.state.gifSpinner})

  updateMood = (emoji) => this.setState({currentMood: emoji}, this.fetchGif)

  fetchGif = () => {
    this.toggleSpinner()
    let mood = this.state.currentMood
    let url = `https://api.giphy.com/v1/gifs/random?tag=${mood}&api_key=${api_key}`
    fetch(url)
    .then(res => res.json())
    .then(json => {
      if (json.meta.status === 200) {
        this.updateGif(json.data.image_url)
        this.toggleSpinner()
      }
      else{
        this.toggleSpinner()
      }
    })
    .catch(err => this.toggleSpinner())
  }

  componentDidMount() {
    this.fetchGif()
  }

  render() {
    let { gif, gifSpinner, currentMood } = this.state
    return (
      <div className="root">
        <h1>current mood:</h1>
        <div className="picker">
          {moods.map((mood) =>
            <span
              key={mood}
              className="mood"
              style={{background: currentMood === mood && 'grey'}}
              onClick={() => this.updateMood(mood)}
            >
              {mood}
            </span>
          )}
        </div>
        {gifSpinner
          ? 'loading...'
          : gif && <img src={gif} width='300px' alt='gif'/>
        }
      </div>
    )
  }
}

export default App
