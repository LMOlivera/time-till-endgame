const React = require('react');

class InputName extends React.Component{
  constructor(props){
    super(props); 
    //var calculateLoop = setInterval(()=>{this.calculate()},1000);
    this.state={
      show: false,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      //calculateLoop: calculateLoop,
      name: ""
    }    
  }
  
  updateTimeInputValue(txt){
    this.setState({
      name: txt.target.value
    });    
  }
  
  redirectBeware(){
    window.location = "/bewareof?name=" + this.state.name
                      + "&time=" + this.props.timeInput
                      + "&date=" + this.props.dateInput
                      ;
  }
  redirectSuccess(){
    window.location = "/success?name=" + this.state.name
                      + "&days=" + this.props.days
                      + "&hours=" + this.props.hours
                      + "&minutes=" + this.props.minutes
                      + "&seconds=" + this.props.seconds
                      + "&time=" + this.props.timeInput
                      + "&date=" + this.props.dateInput;
  }
  
  render(){
    return(
      <p>
        Tell everybody you are going to watch Endgame!
        <br/><br/>
        <input id="importantName" type="text" onChange={(txt)=>this.updateTimeInputValue(txt)} name="name" value={this.state.name} required placeholder="Enter your name..." />  <button type="button" className="btn-share" onClick={()=>this.redirectSuccess()}>Submit</button> or <button type="button" className="btn-share" onClick={()=>this.redirectBeware()}> Tell me who can spoil me</button>
      </p>
    )  
  }
  
}

module.exports = InputName;