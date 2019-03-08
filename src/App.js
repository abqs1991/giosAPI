import React, { Component } from "react";
import "isomorphic-fetch";
import Footer from "./Footer";

class App extends Component {
  constructor() {
    super();
    this.state = {
      PM10: null,
      C6H6: null,
      PM25: null,
      SO2: null,
      NO2: null,
      O3: null,
      CO: null
    };
    this.getData = this.getData.bind(this);
  }

  getSensorsIDs(res) {
    let sensorsIDs = [];
    let stationIDs = [];
    res.forEach(item => {
      stationIDs.push(item.id);
    });

    stationIDs.forEach(id => {
      let url = `http://api.gios.gov.pl/pjp-api/rest/station/sensors/${id}`;
      fetch(url)
        .then(response => response.json())
        .then(response => response.map(item => sensorsIDs.push(item.id)));
    });
    return sensorsIDs;
  }

  getData(sensorsIds) {
    let data = [];
    sensorsIds.forEach(id => {
      const url = `http://api.gios.gov.pl/pjp-api/rest/data/getData/${id}`;
      fetch(url)
        .then(response => response.json())
        .then(response => {
          let key = response.key;
          let value =
            response.values === undefined || response.values.length === 0
              ? null
              : response.values[1].value;
          if (value !== null) return data.push({ [key]: value });
        });
    });
    return data;
  }

  calculateAvgValues(data) {
    let sumNO2 = 0,
      sumCO = 0,
      sumPM25 = 0,
      sumPM10 = 0,
      sumSO2 = 0,
      sumC6H6 = 0,
      sumO3 = 0,
      iCO = 0,
      iNO2 = 0,
      iPM10 = 0,
      iSO2 = 0,
      iC6H6 = 0,
      iO3 = 0,
      iPM25 = 0;
    data.forEach(obj => {
      const { NO2, CO, SO2, PM10, C6H6, O3, ["PM2.5"]: PM25 } = obj;
      if (NO2 !== undefined) {
        sumNO2 += NO2;
        iNO2++;
      }
      if (PM25 !== undefined) {
        sumPM25 += PM25;
        iPM25++;
      }
      if (CO !== undefined) {
        sumCO += CO;
        iCO++;
      }
      if (SO2 !== undefined) {
        sumSO2 += SO2;
        iSO2++;
      }
      if (PM10 !== undefined) {
        sumPM10 += PM10;
        iPM10++;
      }
      if (C6H6 !== undefined) {
        sumC6H6 += C6H6;
        iC6H6++;
      }
      if (O3 !== undefined) {
        sumO3 += O3;
        iO3++;
      }
    });
    return {
      PM10: sumPM10 / iPM10,
      C6H6: sumC6H6 / iC6H6,
      PM25: sumPM25 / iPM25,
      SO2: sumSO2 / iSO2,
      NO2: sumNO2 / iNO2,
      O3: sumO3 / iO3,
      CO: sumCO / iCO
    };
  }

  componentDidMount() {
    let senIDs;
    let data;
    let getdata;
    fetch("http://api.gios.gov.pl/pjp-api/rest/station/findAll")
      .then(response => response.json())
      .then(response => (senIDs = this.getSensorsIDs(response)))
      .then(senIDs =>
        setTimeout(() => {
          data = this.getData(senIDs);
        }, 8000)
      );
    setTimeout(() => {
      getdata = this.calculateAvgValues(data);
      console.log(getdata);
      this.setState(getdata);
    }, 30000);
  }
  time() {
    const time = new Date();
    return `${time.getHours() - 1}:00`;
  }
  date() {
    const time = new Date();
    console.log(Date());
    return `${time.getDate()}.${time.getMonth() + 1}.${time.getFullYear()}`;
  }

  //added click handler for calculating avg levels in city
  // handleClick() {
  //   const =
  // }
  render() {
    //values.
    const { PM10, C6H6, PM25, SO2, NO2, O3, CO } = this.state;
    const accLvl = {
      PM10: 40,
      C6H6: 40000,
      PM25: 25,
      SO2: 125,
      NO2: 40,
      O3: 180,
      CO: 35000000
    };
    setTimeout(() => {
      const { PM10, C6H6, PM25, SO2, NO2, O3, CO } = Math.round(this.state);
    }, 31000);

    //html render
    return (
      <div>
        <video autoPlay muted loop id="myVideo">
          <source src="smoke.mp4" type="video/mp4" />
        </video>
        <div className="content" style={{ display: PM10 ? "none" : "block" }}>
          <h1>
            OBLICZANIE ŚREDNIEJ JAKOŚCI POWIETRZA W POLSCE. STAN NA GODZINĘ{" "}
            {this.time()} DNIA {this.date()}
          </h1>
          <div className="lds-spinner">
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
          </div>
          <h1>PROSZĘ CZEKAĆ!</h1>
        </div>
        <div
          className="container content"
          style={{ display: PM10 ? "block" : "none" }}
        >
          <h3 className="item">
            Średni poziom stężenia PM10 w Polsce wynosi:
            {Math.round(PM10 * 100) / 100}μg/m3 co stanowi{" "}
            {Math.round((PM10 * 100) / accLvl.PM10)} % normy.
          </h3>
          <hr className="style-two" />
          <h3 className="item">
            Średni poziom stężenia PM2.5 w Polsce wynosi:
            {Math.round(PM25 * 100) / 100}μg/m3{" "}
            {Math.round((PM25 * 100) / accLvl.PM25)} % normy.
          </h3>
          <hr className="style-two" />
          <h3 className="item">
            Średni poziom stężenia CO w Polsce wynosi:
            {Math.round(CO * 100) / 100}μg/m3{" "}
            {Math.round((CO * 100) / accLvl.CO)} % normy.
          </h3>
          <hr className="style-two" />
          <h3 className="item">
            Średni poziom stężenia SO2 w Polsce wynosi:
            {Math.round(SO2 * 100) / 100}μg/m3{" "}
            {Math.round((SO2 * 100) / 40)} % normy.
          </h3>
          <hr className="style-two" />
          <h3 className="item">
            Średni poziom stężenia NO2 w Polsce wynosi:
            {Math.round(NO2 * 100) / 100}μg/m3{" "}
            {Math.round((NO2 * 100) / accLvl.NO2)} % normy.
          </h3>
          <hr className="style-two" />
          <h3 className="item">
            Średni poziom stężenia O3 w Polsce wynosi:
            {Math.round(O3 * 100) / 100}μg/m3{" "}
            {Math.round((O3 * 100) / accLvl.O3)} % normy.
          </h3>
          <hr className="style-two" />
          <h3 className="item">
            Średni poziom stężenia C6H6 w Polsce wynosi:
            {Math.round(C6H6 * 100) / 100}μg/m3{" "}
            {Math.round((C6H6 * 100) / accLvl.C6H6)} % normy.
          </h3>
          <hr className="style-two" />
        </div>
        <Footer />
      </div>
    );
  }
}
export default App;
