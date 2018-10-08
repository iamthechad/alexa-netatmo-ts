import * as rp from "request-promise-native";
import {RequestPromise, RequestPromiseOptions} from "request-promise-native";
import {Conversion} from "../util/conversion";

const credentials = require("../data/credentials.json");

const baseUrl = "https://api.netatmo.com";
const tokenPath = "/oauth2/token";
const getDataPath = "/api/getstationsdata";

const doCall = (url: string, options: RequestPromiseOptions): RequestPromise => {
  return rp.post(url, options);
};

const getToken = (): RequestPromise => {
  const options: RequestPromiseOptions = {
    method: "POST",
    form: {
      "grant_type": "password",
      "client_id": credentials.clientId,
      "client_secret": credentials.clientSecret,
      "username": credentials.userId,
      "password": credentials.pass,
      "scope": "read_station"
    }
  };
  return doCall(`${baseUrl}${tokenPath}`, options);
};

const getMeasure = (data: any) => {

  //console.log(JSON.stringify(parsedResponse));
  var mainUnits = data.body.user.administrative.unit;
  var pressureUnits = data.body.user.administrative.pressureunit;

  var rootDevice = data.body.devices[0];

  var parsedData: any = {
    tempIn: Conversion.convertTemperature(rootDevice.dashboard_data.Temperature, mainUnits),
    humIn: rootDevice.dashboard_data.Humidity,
    sound: rootDevice.dashboard_data.Noise,
    co2: rootDevice.dashboard_data.CO2,
    press: Conversion.convertPressure(rootDevice.dashboard_data.Pressure, pressureUnits),
    pressUnits: Conversion.getPressureUnitsString(pressureUnits),
    rain: {},

    extraModules: {}
  };

  rootDevice.modules.forEach((module: any) => {
    switch (module.type) {
      case 'NAModule1':
        parsedData.tempOut = Conversion.convertTemperature(module.dashboard_data.Temperature, mainUnits);
        parsedData.humOut = module.dashboard_data.Humidity;
        parsedData.rfStrengthOut = module.rf_status;
        parsedData.batteryOut = module.battery_percent;
        break;
      case 'NAModule2':
        // Wind module not supported yet
        break;
      case 'NAModule3':
        // Rain module
        parsedData.rain.raining = module.dashboard_data.Rain > 0;
        parsedData.rain.lastHour = Conversion.convertRain(module.dashboard_data.sum_rain_1, mainUnits);
        parsedData.rain.lastDay = Conversion.convertRain(module.dashboard_data.sum_rain_24, mainUnits);
        parsedData.rain.units = mainUnits === 0 ? 'millimeters' : 'inches';
        parsedData.rain.rfStrengthOut = module.rf_status;
        parsedData.rain.batteryOut = module.battery_percent;
        break;
      case 'NAModule4':
        parsedData.extraModules[module.module_name.toLowerCase()] = {
          name: module.module_name,
          temp: Conversion.convertTemperature(module.dashboard_data.Temperature, mainUnits),
          hum: module.dashboard_data.Humidity,
          co2: module.dashboard_data.CO2
        };
        break;
    }
  });

  return parsedData;
};

export const getData = (): Promise<any> => {
  return getToken()
    .then((body: any) => {
    const tokenJSON = JSON.parse(body);
    const token = tokenJSON.access_token;

    const options: RequestPromiseOptions = {
      method: "POST",
      form: {
        access_token: token
      }
    };

    return doCall(`${baseUrl}${getDataPath}`, options);
  })
    .then(data => getMeasure(JSON.parse(data)));
};
