import React, { Component } from 'react';
import './App.css';
import ItemEditor from './ItemEditor';

function seconds2string(seconds) {
  if (seconds === 0) return 'Now';
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
      showItems: true,
      start: null,
      secondsElapsed: 0,
      items: [
        {time: 5,  text: 'Add Cascade'},
        {time: 300, text: 'Add Citra'},
        {time: 3000, text: 'Add Fuggle'},
        {time: 3000, text: 'Drink a beer'},
        {time: 3540, text: 'Add Chinook'},
        {time: 3630, text: 'Drink another beer'},
      ],
    };
    this.editItems = this.editItems.bind(this);
    this.startCountdown = this.startCountdown.bind(this);
    this.tick = this.tick.bind(this);
    this.clearCountdown = this.clearCountdown.bind(this);
    this.alert = this.alert.bind(this);
  }

  editItems(editedListText) {
    let newList = [];
    editedListText.split('\n').forEach((line) => {
      if (line.startsWith('//') || line === '') return;
      let [min, sec, desc] = line.split(new RegExp(',|:', 'g'));
      let newtime = min * 60 + +sec;
      newList.push({time: newtime, text: desc});
    });
    newList.sort((a, b) => a.time - b.time);
    this.setState({items: newList});
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
    // do we need to sound the alarm?
    let test = this.state.items.find((item) => {
      return item.time - elapsed >= 0 && item.time - elapsed < 1;
    })
    if (test) {
      console.log(test.text + ' just finished');
      this.alert();
    }
    this.setState({secondsElapsed: elapsed});
  }

  clearCountdown() {
    clearInterval(this.timerID);
    this.setState({start: null, now: null, secondsElapsed: 0});
  }

  alert() {
    if (this.alertIntervalID) {
      return;
    }
    let beep = new Audio("data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3Wm3Q576v////+32///5/EOgAAADVghQAAAAA//uQZAUAB1WI0PZugAAAAAoQwAAAEk3nRd2qAAAAACiDgAAAAAAABCqEEQRLCgwpBGMlJkIz8jKhGvj4k6jzRnqasNKIeoh5gI7BJaC1A1AoNBjJgbyApVS4IDlZgDU5WUAxEKDNmmALHzZp0Fkz1FMTmGFl1FMEyodIavcCAUHDWrKAIA4aa2oCgILEBupZgHvAhEBcZ6joQBxS76AgccrFlczBvKLC0QI2cBoCFvfTDAo7eoOQInqDPBtvrDEZBNYN5xwNwxQRfw8ZQ5wQVLvO8OYU+mHvFLlDh05Mdg7BT6YrRPpCBznMB2r//xKJjyyOh+cImr2/4doscwD6neZjuZR4AgAABYAAAABy1xcdQtxYBYYZdifkUDgzzXaXn98Z0oi9ILU5mBjFANmRwlVJ3/6jYDAmxaiDG3/6xjQQCCKkRb/6kg/wW+kSJ5//rLobkLSiKmqP/0ikJuDaSaSf/6JiLYLEYnW/+kXg1WRVJL/9EmQ1YZIsv/6Qzwy5qk7/+tEU0nkls3/zIUMPKNX/6yZLf+kFgAfgGyLFAUwY//uQZAUABcd5UiNPVXAAAApAAAAAE0VZQKw9ISAAACgAAAAAVQIygIElVrFkBS+Jhi+EAuu+lKAkYUEIsmEAEoMeDmCETMvfSHTGkF5RWH7kz/ESHWPAq/kcCRhqBtMdokPdM7vil7RG98A2sc7zO6ZvTdM7pmOUAZTnJW+NXxqmd41dqJ6mLTXxrPpnV8avaIf5SvL7pndPvPpndJR9Kuu8fePvuiuhorgWjp7Mf/PRjxcFCPDkW31srioCExivv9lcwKEaHsf/7ow2Fl1T/9RkXgEhYElAoCLFtMArxwivDJJ+bR1HTKJdlEoTELCIqgEwVGSQ+hIm0NbK8WXcTEI0UPoa2NbG4y2K00JEWbZavJXkYaqo9CRHS55FcZTjKEk3NKoCYUnSQ0rWxrZbFKbKIhOKPZe1cJKzZSaQrIyULHDZmV5K4xySsDRKWOruanGtjLJXFEmwaIbDLX0hIPBUQPVFVkQkDoUNfSoDgQGKPekoxeGzA4DUvnn4bxzcZrtJyipKfPNy5w+9lnXwgqsiyHNeSVpemw4bWb9psYeq//uQZBoABQt4yMVxYAIAAAkQoAAAHvYpL5m6AAgAACXDAAAAD59jblTirQe9upFsmZbpMudy7Lz1X1DYsxOOSWpfPqNX2WqktK0DMvuGwlbNj44TleLPQ+Gsfb+GOWOKJoIrWb3cIMeeON6lz2umTqMXV8Mj30yWPpjoSa9ujK8SyeJP5y5mOW1D6hvLepeveEAEDo0mgCRClOEgANv3B9a6fikgUSu/DmAMATrGx7nng5p5iimPNZsfQLYB2sDLIkzRKZOHGAaUyDcpFBSLG9MCQALgAIgQs2YunOszLSAyQYPVC2YdGGeHD2dTdJk1pAHGAWDjnkcLKFymS3RQZTInzySoBwMG0QueC3gMsCEYxUqlrcxK6k1LQQcsmyYeQPdC2YfuGPASCBkcVMQQqpVJshui1tkXQJQV0OXGAZMXSOEEBRirXbVRQW7ugq7IM7rPWSZyDlM3IuNEkxzCOJ0ny2ThNkyRai1b6ev//3dzNGzNb//4uAvHT5sURcZCFcuKLhOFs8mLAAEAt4UWAAIABAAAAAB4qbHo0tIjVkUU//uQZAwABfSFz3ZqQAAAAAngwAAAE1HjMp2qAAAAACZDgAAAD5UkTE1UgZEUExqYynN1qZvqIOREEFmBcJQkwdxiFtw0qEOkGYfRDifBui9MQg4QAHAqWtAWHoCxu1Yf4VfWLPIM2mHDFsbQEVGwyqQoQcwnfHeIkNt9YnkiaS1oizycqJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
    let bodyBGcolor = document.body.style.backgroundColor;
    let x = 0;
    this.alertIntervalID = setInterval(() => {
      beep.play();
      if (document.body.style.backgroundColor === 'red') {
        document.body.style.backgroundColor = bodyBGcolor;
      } else {
        document.body.style.backgroundColor = 'red';
      }
      if (++x === 6) {
        document.body.style.backgroundColor = bodyBGcolor;
        clearInterval(this.alertIntervalID);
        this.alertIntervalID = null;
      }
    }, 300);
  }

  render() {
    const itemList = this.state.items.map((item, i) => {
      let timeRemaining = item.time - this.state.secondsElapsed;
      let timeText;
      if (timeRemaining < 0) {
        timeText = 'Done';
      } else {
        timeText = seconds2string(timeRemaining);
      }
      return (
        <tr key={i}>
          <td className="item-text">{item.text}</td>
          <td className="item-time">{timeText}</td>
        </tr>
      );
    });

    let nextUpItem = this.state.items.find((item) => (item.time - this.state.secondsElapsed) > 0);
    if (nextUpItem) {
      nextUpItem.timeRemaining = nextUpItem.time - this.state.secondsElapsed;
    } else {
      nextUpItem = {text: 'Nothing!', timeRemaining: 0};
    }

    return (
      <div className="App">
        <div className={this.state.showItems ? 'item-list items-showing' : 'item-list'}>
          <div>
            <a onClick={() => this.setState({showItems: false})}>Hide item list</a>
          </div>

          <div>
            <table>
              <tbody>
                {itemList}
              </tbody>
            </table>
          </div>

          <ItemEditor list={this.state.items} update={this.editItems} />
        </div>

        <div className={this.state.showItems ? 'up-next items-showing' : 'up-next'}>
          <div style={{display: 'block'}}>
            <div style={{float: 'left'}}>
              {!this.state.showItems && <a onClick={() => this.setState({showItems: true})}>Show item list</a>}
            </div>
            <div style={{float: 'right'}}>
              <div>Elapsed time: {this.state.secondsElapsed === 0 ? '00:00' : seconds2string(this.state.secondsElapsed)}</div>
              <a onClick={this.alert}>Test alert</a>
            </div>
            <div style={{clear: 'both'}}></div>
          </div>

          <div>
            <h3>Next up</h3>
            <h1>{nextUpItem.text} in {seconds2string(nextUpItem.timeRemaining)}</h1>
            {this.state.start ? <a onClick={this.clearCountdown}>Reset</a> : <a onClick={this.startCountdown}>Start</a>}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
