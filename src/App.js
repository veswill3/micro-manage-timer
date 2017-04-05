import React, { Component } from 'react';
import './App.css';
import alarmBeep from './alarm-beep.mp3';
import earlyWarning from './early-warning.mp3';
import EventEditor from './EventEditor';

function seconds2string(seconds) {
  if (seconds === 0) return 'Now';
  if (seconds < 0)   return 'Done';
  let min = Math.floor(seconds / 60);
  let sec = seconds - min * 60;
  if (min < 10) min = '0' + min; // padd a zero
  if (sec < 10) sec = '0' + sec; // padd a zero
  return min + ':' + sec;
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showEventList: true,
      start: null,
      secondsElapsed: 0,
      earlyWarnSeconds: 5,
      earlyWarnCompleteCnt: 0,
      eventCompleteCnt: 0,
      alertColor: null,
      events: [
        {time: 10,   text: 'Add Cascade'},
        {time: 20,   text: 'Add Citra'},
        {time: 35,   text: 'Add Fuggle'},
        {time: 50,   text: 'Drink a beer'},
        {time: 3540, text: 'Add Chinook'},
        {time: 3630, text: 'Drink another beer'},
      ],
    };
    this.editEventList = this.editEventList.bind(this);
    this.startCountdown = this.startCountdown.bind(this);
    this.tick = this.tick.bind(this);
    this.clearCountdown = this.clearCountdown.bind(this);
    this.alert = this.alert.bind(this);
    this.beepSound = new Audio(alarmBeep);
    this.earlyWarningSound = new Audio(earlyWarning);
  }

  editEventList(editedListText) {
    let newState = { events: [] };
    editedListText.split('\n').forEach((line) => {
      if (line.startsWith('//') || line === '') return;
      if (line.startsWith('early warning seconds=')) {
        newState.earlyWarnSeconds = +line.split('=')[1];
        if (isNaN(newState.earlyWarnSeconds)) {
          newState.earlyWarnSeconds = 0;
        }
        return;
      }
      let [min, sec, desc] = line.split(new RegExp(',|:', 'g'));
      let newtime = min * 60 + +sec;
      newState.events.push({time: newtime, text: desc});
    });
    newState.events.sort((a, b) => a.time - b.time);
    this.setState(newState);
  }

  startCountdown() {
    this.setState({start: new Date()});
    this.timerID = setInterval(
      () => this.tick(),
      500
    );
  }

  tick() {
    let elapsed = new Date() - this.state.start;
    if (elapsed < 0) {
      this.setState({secondsElapsed: 0});
      return;
    }
    elapsed = Math.floor(elapsed/1000);
    let newState = {secondsElapsed: elapsed};
    // do we need to sound the alarm?
    let i = this.state.eventCompleteCnt;
    if (i < this.state.events.length && this.state.events[i].time - elapsed <= 0) {
      this.alert();
      newState.eventCompleteCnt = ++i;
    }
    // do we need an early warning?
    let j = this.state.earlyWarnCompleteCnt;
    if (j < this.state.events.length && this.state.events[j].time - elapsed <= this.state.earlyWarnSeconds) {
      this.alert(true);
      newState.earlyWarnCompleteCnt = ++j;
    }
    this.setState(newState);
  }

  clearCountdown() {
    clearInterval(this.timerID);
    this.setState({
      start: null,
      now: null,
      secondsElapsed: 0,
      earlyWarnCompleteCnt: 0,
      eventCompleteCnt: 0,
    });
  }

  alert(early) {
    if (this.alertIntervalID) {
      return;
    }
    let x, audio;
    if (early) {
      audio = this.earlyWarningSound;
      x = 3;
    } else {
      audio = this.beepSound;
      x = 15;
    }
    audio.play();
    // flash the background color
    let handle = setInterval(() => {
      this.setState({alertColor: this.state.alertColor === 'red' ? 'white' : 'red'});
      if (--x === 0) {
        this.setState({alertColor: null});
        clearInterval(handle);
        if (!early) {
          this.alertIntervalID = null;
        }
      }
    }, 120);
    if (!early) {
      this.alertIntervalID = handle
    }
  }

  render() {
    const eventList = this.state.events.map((event, i) => {
      let timeRemaining = event.time - this.state.secondsElapsed;
      return (
        <tr key={i} style={(timeRemaining > 0 && timeRemaining <= this.state.earlyWarnSeconds ? {color: 'yellow'} : {})}>
          <td>{event.text}</td>
          <td>{seconds2string(timeRemaining)}</td>
        </tr>
      );
    });

    let nextUpEvent = this.state.events.find((event) => (event.time - this.state.secondsElapsed) > 0);
    if (nextUpEvent) {
      nextUpEvent.timeRemaining = nextUpEvent.time - this.state.secondsElapsed;
    }

    return (
      <div className="App">
        <div id="sidebar"
             className={(this.state.showEventList ? 'menu-open' : '')}
             style={this.state.alertColor ? {backgroundColor: this.state.alertColor} : {}}
        >
          <div>
            <a onClick={() => this.setState({showEventList: false})}>Hide event list</a>
          </div>

          <table id="eventlist">
            <tbody>
              {eventList}
            </tbody>
          </table>

          <EventEditor
            list={this.state.events}
            earlyWarning={this.state.earlyWarnSeconds}
            update={this.editEventList}
          />
        </div>

        <div id="main"
             className={(this.state.showEventList ? 'menu-open' : '')}
             style={this.state.alertColor ? {backgroundColor: this.state.alertColor} : {}}>
          <div style={{display: 'block'}}>
            <div style={{float: 'left'}}>
              {!this.state.showEventList && <a onClick={() => this.setState({showEventList: true})}>Show event list</a>}
            </div>
            <div style={{float: 'right'}}>
              <div>
                Elapsed time: {this.state.secondsElapsed === 0 ? '00:00' : seconds2string(this.state.secondsElapsed)}
              </div>
              <a onClick={() => this.alert(false)}>Test alert</a>
            </div>
            <div style={{clear: 'both'}}></div>
          </div>

          <div>
            <h3>Next up</h3>
            { nextUpEvent ?
              <h1 style={(nextUpEvent.timeRemaining > 0 && nextUpEvent.timeRemaining <= this.state.earlyWarnSeconds ? {color: 'yellow'} : {})}>
                {nextUpEvent.text} in {seconds2string(nextUpEvent.timeRemaining)}
              </h1>
              :
              <h1>All done</h1>
            }
            {this.state.start ? <a onClick={this.clearCountdown}>Reset</a> : <a onClick={this.startCountdown}>Start</a>}
          </div>
        </div>
        <div id="feature-request">
          <a href="https://github.com/veswill3/micro-manage-timer/issues/new">Request a feature</a>
        </div>
      </div>
    );
  }
}

export default App;
