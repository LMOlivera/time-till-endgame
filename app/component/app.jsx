const React = require('react');
const Timer = require('./timer-component');

class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      today: new Date(),
      premiere: new Date(2019,3,24,23,59,0,0),
      dateValue: '',
      dateBackup: '',
      timeValue: '00:00',
      timeBackup: '',
      hide: false
    };  
    setInterval(()=>{
      this.setState({today: new Date()})
    }, 1000);
  }
  
  updateDateInputValue(txt){
    this.setState({
      dateValue: txt.target.value
    });    
  }
  
  updateTimeInputValue(txt){
    this.setState({
      timeValue: txt.target.value
    });
  }
  
  render(){
    //if(){
    //}else{
    //}
    return(
      <div id="timer">
        <p>
          Today is: {this.state.today.toLocaleString()}
          <br/><br/>
          Endgame's Premiere is on: {this.state.premiere.toLocaleString()}
        </p>
        <p>
          <form action="/success" method="POST">
            Insert the day you are watching Endgame: <input
                                                     type="date"
                                                     name="date"
                                                     id="date"
                                                     value={this.state.dateValue}
                                                     min="2019-04-24"
                                                     onChange={(txt) => this.updateDateInputValue(txt)}
                                                     placeholder="yyyy-mm-dd"/>
            <br/><br/>
            And the time: <input
                          type="time"
                          name="time"
                          id="time"
                          value={this.state.timeValue}
                          onChange={(txt) => this.updateTimeInputValue(txt)}
                          placeholder="hh:mm"/>
            <br/><br/>
            <Timer dateInput={this.state.dateValue} timeInput={this.state.timeValue} today={this.state.today} hideTimer={this.state.hideTimer}/>
          </form>
        </p>  
      </div>
    )
  }
}
module.exports = App;