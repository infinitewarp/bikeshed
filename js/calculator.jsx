import React from 'react';
import ReactDOM from 'react-dom';

class ParticipantInput extends React.Component {
  constructor(props) {
    super(props);
    this.index = props.index
    this.handleAmountChange = this.handleAmountChange.bind(this);
  }

  handleAmountChange(e) {
    console.log(e.target)
    this.props.handleParticipantChange(this.index, e.target.value);
  }

  render() {
    const id = this.index + 1
    const input_id = 'salary_input_' + id
    return (
      <div className="participant">
        <label htmlFor={input_id}>Annual Gross Salary #{id}</label>
        <input id={input_id} type="number" placeholder={'$£€'} value={this.props.salary} onChange={this.handleAmountChange} />
        <button value={this.index} onClick={this.props.deleteParticipant}>Remove</button>
        <button value={this.index} onClick={this.props.cloneParticipant}>Clone</button>
      </div>
    );
  }
}

function ParticipantInputsList(props) {
  const participantItems = props.salaries.map((salary, index) =>
    <ParticipantInput key={index} salary={salary} index={index} handleParticipantChange={props.handleParticipantChange} deleteParticipant={props.deleteParticipant} cloneParticipant={props.cloneParticipant}/>
  )
  return (
    <div>
      <h2>Participants {'👥'}</h2>
      <div className="inset">
        {participantItems}
        <AddDefaultParticipant handleAddDefaultParticipant={props.handleAddDefaultParticipant} />
      </div>
    </div>
  );
}

function Duration(props) {
    return (
        <div>
          <h2>Elapsed Time {'⌛'}</h2>
          <div className="inset" id="time">
              <label htmlFor="minutes">This waste of time took</label> <input type="number" size="5" placeholder="0" id="minutes" type="number" value={props.minutes} onChange={props.handleMinutesChange} /> minutes.
          </div>
        </div>
    );
}

function TheCost(props) {
    return (
        <div>
          <h2>The Cost {'💸'}</h2>
          <div className="inset" id="result">
              Your discussion just cost the company <span id="cost">{props.cost}</span> simoleons.
              <p>
                <input id="overhead_toggle" type="checkbox" checked={props.overhead} onChange={props.handleOverheadChange} />
                <label htmlFor="overhead_toggle"> include additional overhead costs</label>
              </p>
          </div>
        </div>
    );
}

function AddDefaultParticipant(props) {
    return (
        <div>
            <button id="add_participant" onClick={props.handleAddDefaultParticipant}>Add Default Salary</button>
        </div>
    );
}

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handleParticipantChange = this.handleParticipantChange.bind(this);
    this.handleMinutesChange = this.handleMinutesChange.bind(this);
    this.deleteParticipant = this.deleteParticipant.bind(this);
    this.cloneParticipant = this.cloneParticipant.bind(this);
    this.handleAddDefaultParticipant = this.handleAddDefaultParticipant.bind(this);
    this.handleOverheadChange = this.handleOverheadChange.bind(this);

    this.defaultSalary = 107100
    const defaultSalaries = [this.defaultSalary, this.defaultSalary, '']
    const defaultMinutes = 30
    const defaultOverhead = true
    this.state = {
      salaries: defaultSalaries,
      minutes: defaultMinutes,
      overhead: defaultOverhead,
      total: this.calculateShed(defaultSalaries, defaultMinutes, defaultOverhead)
    };
  }

  deleteParticipant(e) {
    const index = parseInt(e.target.value, 10);
    console.log('deleting salary at index ' + index);
    const updatedSalaries = this.state.salaries;
    updatedSalaries.splice(index, 1);
    this.setState({
      salaries: updatedSalaries,
      total: this.calculateShed(updatedSalaries, this.state.minutes, this.state.overhead)
    });
  }

  cloneParticipant(e) {
    const index = parseInt(e.target.value, 10);
    console.log('cloning salary at index ' + index);
    var updatedSalaries = this.state.salaries;
    const valueToClone = this.state.salaries[index]
    console.log('cloning value ' + valueToClone)
    updatedSalaries.push(valueToClone);
    this.setState({
      salaries: updatedSalaries,
      total: this.calculateShed(updatedSalaries, this.state.minutes, this.state.overhead)
    });
  }

  handleAddDefaultParticipant(e) {
    console.log('handleAddDefaultParticipant')
    var updatedSalaries = this.state.salaries;
    updatedSalaries.push(this.defaultSalary);
    this.setState({
      salaries: updatedSalaries,
      total: this.calculateShed(updatedSalaries, this.state.minutes, this.state.overhead)
    });
  }

  handleParticipantChange(index, value) {
    console.log('index: ' + index + ', value: ' + value)
    const updatedSalaries = this.state.salaries
    updatedSalaries[index] = value
    this.setState({
      salaries: updatedSalaries,
      total: this.calculateShed(updatedSalaries, this.state.minutes, this.state.overhead)
    });
  }

  handleMinutesChange(e) {
    const minutes = parseInt(e.target.value, 10) || 0
    this.setState({
      minutes: minutes,
      total: this.calculateShed(this.state.salaries, minutes, this.state.overhead)
    });
  }

  handleOverheadChange(e) {
    const new_overhead = !this.state.overhead
    this.setState({
      overhead: new_overhead,
      total: this.calculateShed(this.state.salaries, this.state.minutes, new_overhead)
    })
  }

  calculateShed(salaries, minutes, overhead) {
    // Assumes US average of 40 hours/week for 46.3 weeks/year.
    // If "US overhead" is enabled, the calculator adds costs including:
    // 6.2% on the first $113,700/person for Social Security,
    // 1.45% for Medicare,
    // 2.8% on the first $16,488/person for unemployment insurance,
    // 2.5% for 401(k) matching,
    // and $10,119/person for healthcare.

    const salary_sum = Number(salaries.reduce(function(previousValue, currentValue) {
      return (parseInt(currentValue, 10) || 0) + previousValue;
    }, 0))

    var total_annual = salary_sum

    if (overhead) {
      const socialsecurity = Number(salaries.reduce(function(previousValue, currentValue) {
        const socialsecurityfirst = 113700
        const socialsecurityrate = 0.062
        const amount = (parseInt(currentValue, 10) || 0)
        const taxableamount = Math.min(amount, socialsecurityfirst)
        return (taxableamount * socialsecurityrate) + previousValue;
      }, 0));
      const medicare = salary_sum * 0.0145
      const unemployment = Number(salaries.reduce(function(previousValue, currentValue) {
        const unemploymentfirst = 16488
        const unemploymentrate = 0.028
        const amount = (parseInt(currentValue, 10) || 0)
        const taxableamount = Math.min(amount, unemploymentfirst)
        return (taxableamount * unemploymentrate) + previousValue;
      }, 0));
      const match401k = salary_sum * 0.025
      const healthcare = 10119 * salaries.reduce(function(previousValue, currentValue) {
        const amount = (parseInt(currentValue, 10) || 0)
        return (amount > 0 ? 1 : 0) + previousValue;
      }, 0)
      console.log('salary_sum: ' + salary_sum + ', socialsecurity: ' + socialsecurity + ', medicare: ' + medicare + ', unemployment: ' + unemployment + ', match401k: ' + match401k + ', healthcare: ' + healthcare)
      total_annual += socialsecurity + medicare + unemployment + match401k + healthcare
    }

    const weeks_per_year = 46.3
    const minutely = total_annual / weeks_per_year / 40.0 / 60.0;
    const cost = (minutes * minutely).toFixed(2);
    console.log('total_annual: ' + total_annual + ', minutely: ' + minutely + ', minutes: ' + minutes + ', cost: ' + cost)
    return cost;
  }

  render() {
    return (
      <div>
        <Duration minutes={this.state.minutes} handleMinutesChange={this.handleMinutesChange} />
        <ParticipantInputsList
            salaries={this.state.salaries}
            handleParticipantChange={this.handleParticipantChange}
            deleteParticipant={this.deleteParticipant}
            cloneParticipant={this.cloneParticipant}
            handleAddDefaultParticipant={this.handleAddDefaultParticipant} />
        <TheCost cost={this.state.total} overhead={this.state.overhead} handleOverheadChange={this.handleOverheadChange} />
      </div>
    );
  }
}

ReactDOM.render(
  <Calculator />,
  document.getElementById('calculator')
)
