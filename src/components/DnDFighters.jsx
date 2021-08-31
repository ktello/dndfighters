import React from "react";

class DnDFighters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      apiUrl: 'https://www.pensivewright.com/serv',
      //apiUrl: 'http://192.168.50.22:8081/serv',

      figherRace: null,
      fighterClass: null,
      primaryAbility: null,
      secondaryAbility: null,
      
      fighterRaces: [],
      fighterClasses: [],
      savedFighters: [],
      searchFighter: {
        'race': 'Human',
        'class': 'Barbarian',
        'primaryAbility': '',
        'secondaryAbility': '',
        'bond': 0,
        'STR': 1,
        'DEX': 0,
        'CON': 1,
        'INT': 0,
        'WIS': 0,
        'CHR': 0
      }
    };

    this.setFighterRace = this.setFighterRace.bind(this);
    this.setFighterClass = this.setFighterClass.bind(this);
    this.setPrimaryAbility = this.setPrimaryAbility.bind(this);
    this.setSecondaryAbility = this.setSecondaryAbility.bind(this);
    this.generateFighter = this.generateFighter.bind(this);
    this.saveFighter = this.saveFighter.bind(this);
    this.getSavedFighters = this.getSavedFighters.bind(this);
    this.deleteFighter = this.deleteFighter.bind(this);
  }

  componentDidMount() {
    getData(this.state.apiUrl+'/races').then(data => {
      const fighterRaces = data.races;
      this.setState({ fighterRaces });
    }).catch((error) => {
      console.error('Error:', error);
    });

    getData(this.state.apiUrl+'/classes').then(data => {
      const fighterClasses = data.classes;
      this.setState({ fighterClasses });
    }).catch((error) => {
      console.error('Error:', error);
    });

    this.getSavedFighters();
  }

  setFighterRace(race) {
      const fighterRace = (typeof this.state.fighterRaces[race] != 'undefined')?this.state.fighterRaces[race].name:null;
      this.setState({ fighterRace });
  }
  setFighterClass(vclass) {
    const fighterClass = (typeof this.state.fighterClasses[vclass] != 'undefined')?this.state.fighterClasses[vclass].name:null;
    this.setState({ fighterClass });
  }
  setPrimaryAbility(ability){
    const primaryAbility = ability;
    this.setState({ primaryAbility });
  }
  setSecondaryAbility(ability){
    const secondaryAbility = ability;
    this.setState({ secondaryAbility });
  }
  getSavedFighters(){
    getData(this.state.apiUrl+'/savedwaifus').then(data => {
      const savedFighters = data.waifus;
      this.setState({ savedFighters });
    }).catch((error) => {
      console.error('Error:', error);
    });
  }

  generateFighter() {
    const fighter = {
      'race' : (this.state.fighterRace === 'null')?null:this.state.fighterRace,
      'class': (this.state.fighterClass === 'null')?null:this.state.fighterClass,
      'primaryAbility': (this.state.primaryAbility === 'null')?null:this.state.primaryAbility,
      'secondaryAbility': (this.state.secondaryAbility === 'null')?null:this.state.secondaryAbility
    }
    this.setState({ searchFighter:{} });

    postData(this.state.apiUrl+'/waifu', fighter).then(data => {
      if(typeof data.waifu.waifurace != 'undefined' && typeof data.waifu.waifuclass != 'undefined')
      {
        const searchFighter = { 
          "race": data.waifu.waifurace.name,
          "class": data.waifu.waifuclass.name,
          "bond": 0,
          'STR': data.waifu.STR,
          'DEX': data.waifu.DEX,
          'CON': data.waifu.CON,
          'INT': data.waifu.INT,
          'WIS': data.waifu.WIS,
          'CHR': data.waifu.CHR
        }
        this.setState({ searchFighter });
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  saveFighter() {
    if(typeof this.state.searchFighter.race === 'undefined' || this.state.searchFighter.class === 'undefined')
      return;
    postData(this.state.apiUrl+'/savewaifu', this.state.searchFighter).then(data => {
     
     this.getSavedFighters();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  deleteFighter(fighterid) {
    deleteFighterReq(this.state.apiUrl, fighterid).then(
      this.getSavedFighters()
    ).catch((error) => {
      console.error('Error:', error);
    });
  }
  
  render() {
    return (
      <div className="dndfighters">
        <div className="row">
          <div className="table-wrap">
            <table className="table table-striped table-primary">
              <thead>
                <tr>
                  <th colSpan="5">
                    Saved Fighters
                  </th>
                </tr>
              </thead>
              <tbody>
                {(typeof this.state.savedFighters !== 'undefined' && this.state.savedFighters.length > 0) &&
                  this.state.savedFighters.map((fighter,i) => 
                    <FighterRows key={i} fighter={fighter} deleteFighter={this.deleteFighter} />
                  )
                }
              </tbody>
            </table>
            
            <FighterSearchDisplay searchFighter={this.state.searchFighter} />

          </div>
        </div>
        <div className="row">
          <div className="col">
            <select onChange={(event) => this.setFighterRace(event.target.value)}>
              <option value="null">Choose Race</option>
              {this.state.fighterRaces.length > 0 &&
                this.state.fighterRaces.map((race, i) =>
                  <option key={i} value={i}>{race.name}</option>
                )
              }
            </select>
            <select  onChange={(event) => this.setFighterClass(event.target.value)}>
              <option value="null">Choose Class</option>
              {this.state.fighterClasses.length > 0 &&
                this.state.fighterClasses.map((vclass, i) =>
                  <option key={i} value={i}>{vclass.name}</option>
                )
              }
            </select>
          </div>
        </div>
        <div className="row">
          <div className="col align-bottom my-2"><span>OR</span></div>
        </div>
        <div className="row">
          <div className="col my-2">
            <PrimaryAbilitySelect setPrimaryAbility={this.setPrimaryAbility} />
            <SecondaryAbilitySelect setSecondaryAbility={this.setSecondaryAbility} />
          </div>
        </div>
        <div className="row">
          <div className="col my-2">
            <div>
                <button className="add_waifu_link" onClick={this.generateFighter}>Generate</button>
                <button className="add_waifu_link" onClick={this.saveFighter}>Save</button>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="table-wrap2">
              <FigherRacesList races={this.state.fighterRaces} searchFighter={this.state.searchFighter} />
            </div>
          </div>
          <div className="col">
            <div className="table-wrap3" >
              <FighterClassesList vclasses={this.state.fighterClasses} searchFighter={this.state.searchFighter} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DnDFighters;

export function FighterRaceSelect(props){

  return (
    <select>
      <option value="null">Choose Race</option>
      {this.state.fighterRaces.length > 0 &&
        this.state.fighterRaces.map((race, i) =>
          <option key={i} value={race.name}>{race.name}</option>
        )
      }
    </select>
  );
}
export function PrimaryAbilitySelect(props){

  function handleChange(event) {
    props.setPrimaryAbility(event.target.value);
  }

  return(
    <select v-model="reqAbility1" onChange={handleChange}>
      <option value="null">Primary Ability</option>
      <option value="STR">Strength</option>
      <option value="DEX">Dexterity</option>
      <option value="CON">Constitution</option>
      <option value="INT">Intelligence</option>
      <option value="WIS">Wisdom</option>
      <option value="CHR">Charisma</option>
    </select>
  );
}

export function SecondaryAbilitySelect(props){

  function handleChange(event) {
    props.setSecondaryAbility(event.target.value);
  }

  return(
    <select v-model="reqAbility2" onChange={handleChange}>
      <option value="null">Secondary Ability</option>
      <option value="STR">Strength</option>
      <option value="DEX">Dexterity</option>
      <option value="CON">Constitution</option>
      <option value="INT">Intelligence</option>
      <option value="WIS">Wisdom</option>
      <option value="CHR">Charisma</option>
    </select>
  )
}

export function FigherRacesList(props) {
  const fighterRaces = props.races;
  let selectedRace = "";

  const raceLines = fighterRaces.map((race, i) => 
    {
      selectedRace = (props.searchFighter.race === race.name)?'table-active':'';
      return (
        <tr key={i}  className={selectedRace} >
          <td> {race.name} </td>
          <td>
            <span> STR:  { race.STR } </span>
            <span> DEX:  { race.DEX } </span>
            <span> CON:  { race.CON } </span>
            <span> INT:  { race.INT } </span>
            <span> WIS:  { race.WIS } </span>
            <span> CHR:  { race.CHR } </span>
          </td>
        </tr>
      )
    }
  );
  
  return(
    <table className="table table-bordered border-primary table-primary">
      <thead>
          <tr>
              <th>Races</th>
              <th>Abilities</th>
          </tr>
      </thead>
      <tbody>
        { fighterRaces.length > 0 &&
          raceLines
        }
      </tbody>
    </table>
  );
}

export function FighterClassesList(props) {
  const fighterClasses = props.vclasses;
  let selectedClass = "";

  const classLines = fighterClasses.map((vclass,i) => {
      selectedClass = (props.searchFighter.class === vclass.name)?'table-active':'';
      return (
        <tr key={i} className={selectedClass}>
          <td> { vclass.name }</td>
          <td>
            <span> STR:  { vclass.STR } </span>
            <span> DEX:  { vclass.DEX } </span>
            <span> CON:  { vclass.CON } </span>
            <span> INT:  { vclass.INT } </span>
            <span> WIS:  { vclass.WIS } </span>
            <span> CHR:  { vclass.CHR } </span>
          </td>
        </tr>
      )
    }
  );
  return (
    <table className="table table-bordered border-primary table-primary">
      <thead>
          <tr>
              <th>Classes</th>
              <th>Abilities</th>
          </tr>
      </thead>
      <tbody>
          { fighterClasses.length > 0 &&
            classLines
          }
      </tbody>
    </table>
  );
}

export function FighterSearchDisplay(props) {
  const searchFighter = props.searchFighter || null;
  return (
    <table id="fightersearch" data-testid="fightersearchtest" className="table table-primary table-striped">
      <thead>
        <tr>
          <th>Race</th>
          <th>Class</th>
          <th>Abilities</th>
        </tr>
      </thead>
      <tbody>
        <FighterRows fighter={searchFighter} />
      </tbody>
    </table>
  );
}

export function FighterRows(props) {
  if(props.fighter === null)
    return <tr />;
  const fighterID = (typeof props.fighter._id !== undefined)?props.fighter._id:null;
  return(
    <tr data-id={fighterID}>
      <td>{ props.fighter.race }</td>
      <td>{ props.fighter.class }</td>
      <td>
        <span> STR: {props.fighter.STR || props.fighter.str } </span>
        <span> DEX: {props.fighter.DEX || props.fighter.dex } </span>
        <span> CON: {props.fighter.CON || props.fighter.con } </span>
        <span> INT: {props.fighter.INT || props.fighter.int } </span>
        <span> WIS: {props.fighter.WIS || props.fighter.wis } </span>
        <span> CHR: {props.fighter.CHR || props.fighter.chr } </span>
      </td>
      {fighterID != null &&
        <td><button onClick={(event) => props.deleteFighter(fighterID)}>delete</button></td>
      }
    </tr>
  );
}



async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

async function getData(url = '') {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

async function deleteFighterReq(apiUrl, id) {
  const url = apiUrl+'/deletewaifu/'+id;
  const response = await fetch(url, {
    method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  });
  return response.json(); // parses JSON response into native JavaScript objects
}