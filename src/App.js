import React from 'react'
import { connect } from 'react-redux'
import { moodSelected, appLoaded } from './redux'

const moods = ['😎', '🤔', '😍', '👽', '🤠']

class App extends React.Component {

  componentDidMount() {
    this.props.appLoaded()
  }

  render() {
    let { currentMood, moodSelected, gif, gifSpinner } = this.props
    return (
      <div className="root">
        <h1>current mood:</h1>
        <div className="picker">
          {moods.map((mood) =>
            <span
              key={mood}
              className="mood"
              style={{background: currentMood === mood && 'grey'}}
              onClick={() => moodSelected(mood)}
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

const mapStatetoProps = (state) => ({
  gif: state.gif,
  gifSpinner: state.gifSpinner,
  currentMood: state.currentMood
})

const mapDispatchToProps = {
  appLoaded,
  moodSelected
}

export default connect(mapStatetoProps, mapDispatchToProps)(App)
