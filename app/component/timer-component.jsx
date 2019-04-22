const React = require('react');
const InputName = require('./input-name');

class Timer extends React.Component{
  constructor(props){
    super(props); 
    var calculateLoop = setInterval(()=>{this.calculate()},1000);
    this.state={
      show: false,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      date: "",
      calculateLoop: calculateLoop
    }    
  }
  
  //When the input boxes' content change, hides the result to prevent errors
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.dateInput !== this.props.dateInput || prevProps.timeInput !== this.props.timeInput){
      this.setState({show: false});
    }
  }
  
  loop(){
    this.calculate(()=>{},this.setState({
      show: "true"
    }));
  }
  
  calculate(){
    try{
      var inp = this.props.dateInput;//
      var d = new Date(inp.toLocaleString());
      d.setDate(d.getDate() + 2);      
      
      
      d.setHours(0);
      
      //*******Date*******
      // get total seconds between the times
      var delta = Math.abs(this.props.today - d) / 1000;

      var days = Math.floor(delta / 86400);
      delta -= days * 86400;

      var hours = Math.floor(delta / 3600) % 24;
      delta -= hours * 3600;
      
      var minutes = Math.floor(delta / 60) % 60;
      delta -= minutes * 60;

      var seconds = parseInt((delta % 60),10);
      
      //*******Time*******
      inp = this.props.timeInput;
      if(inp == NaN){
        throw "Incorrect input"; 
      }
      
      //Take out numbers from time
      var flag = false;
      var extraMins = 0;
      var extraHours = 0;
      for(var i = 0; i<inp.length; i++){
        if (inp[i] != ":"){
          if (flag == false){
            if(i==0){
              extraHours += (10 * parseInt(inp[i]));
            }else{
              extraHours += parseInt(inp[i]);
            }
          }else{
            if(inp[i] == inp[inp.length-1]){
              extraMins += parseInt(inp[i]);
            }else{
              extraMins += (10 * parseInt(inp[i]));
            }              
          }
        }else{
          flag = true;
        }        
      }
      //console.log(extraHours);
      hours+=extraHours;
      minutes+=extraMins;
      
      if (minutes>59){
        hours+=1;
        minutes-=60;
      }
      if (hours>23){
        days += 1;
        hours -= 24;
      }
      
      if (isNaN(minutes) || isNaN(hours)){
        throw "Incorrect output";
      }
      days-=1;    
      this.setState({
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        date: d.toLocaleString()
      });
    }catch(e){
      this.setState({
        show: false
      });
    }    
  }

  render(){
    const timer = <p>You will have to wait <b>{this.state.days} days and {(this.state.hours <= 9) ? "0" : ''}{this.state.hours}
                                              :{(this.state.minutes <= 9) ? "0" : ''}{this.state.minutes}
                                              :{(this.state.seconds <= 9) ? "0" : ''}{this.state.seconds} </b>
                  to watch Endgame.
            <InputName days={this.state.days} hours={this.state.hours} minutes={this.state.minutes} seconds={this.state.seconds} dateInput={this.props.dateInput} timeInput={this.props.timeInput}/>
          </p>;
    const itsTime = <p><b>GO WATCH ENDGAME!!!</b></p>;
    return(
      <div>
        <center><button className="btn" type="button" onClick={() => this.loop()}><text>How much do I have to wait?</text></button></center>        
        {this.state.show ? (this.state.days <= -1 ? itsTime : timer) : ''}        
      </div>        
    );
  }
}

module.exports = Timer;