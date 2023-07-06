import { useState } from "react";
import * as XLSX from "xlsx";
import {parseDate} from '@internationalized/date';

import { ComboBox, Item, Section, DatePicker, Button, defaultTheme, Provider, Grid, View, TextField} from '@adobe/react-spectrum';



function App() {
  let [data, setData] = useState([]);
  const [partnersData, setPartnersData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [metricsData, setMetricsData] = useState([]);

  const handleFileUpload = (e) => {
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const parsedData = XLSX.utils.sheet_to_json(workbook.Sheets["Data Entry"]);
      const partnersData = XLSX.utils.sheet_to_json(workbook.Sheets["Entities"]);
      const metricsData = XLSX.utils.sheet_to_json(workbook.Sheets["Metrics"]);
      const productsData = XLSX.utils.sheet_to_json(workbook.Sheets["Products"]);
      

      setData(parsedData);
      setPartnersData(partnersData);
      setProductsData(productsData);
      setMetricsData(metricsData);

      parsedData.sort(function(a,b){
                // Turn your strings into dates, and then subtract them
                // to get a value that is either negative, positive, or zero.
                return new Date(b.date) - new Date(a.date);
              });
              //array.shift();
    };
  }

  let products = [];
  let partners = [];

function makeDropdownProducts (value, index, array){
  products.push({id: index, name: value["Products"]});
}

function makeDropdownPartners (value, index, array){
  partners.push({id: index, name: value["Entities"]});
}

  productsData.forEach(makeDropdownProducts);
  partnersData.forEach(makeDropdownPartners);

  products.sort();
  partners.sort();


  return (
 
    <div className="App">
    <Provider theme={defaultTheme}>

    <input 
        type="file" 
        accept=".xlsx, .xls" 
        onChange={handleFileUpload} 
    />

     <ComboBox
        label="Partner"
        defaultItems={partners}
        defaultInputValue={""}>
        {item => <Item>{item.name}</Item>}
      </ComboBox>

      <ComboBox
        label="Product"
        defaultItems={products}
        defaultInputValue={""}>
        {item => <Item>{item.name}</Item>}
      </ComboBox>

    <DatePicker 
      label="Start Date"
      defaultValue={parseDate('2023-05-01')}
    />

    <DatePicker 
      label="End Date"
      defaultValue={parseDate('2023-07-01')}
    />
    </Provider>

      {data.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              {Object.keys(data[1]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>   
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, index) => (
                  <td key={index}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

      )}
    </div>
  );
}

export default App;
