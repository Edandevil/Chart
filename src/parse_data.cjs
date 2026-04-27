const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('src/raw_data.txt');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const allData = {};

  for await (const line of rl) {
    if (!line.trim()) continue;
    
    // The format seems to be tab-separated:
    // ID \t TIME_PERIOD \t LABEL \t CONFIG_JSON \t DATA_JSON
    const parts = line.split('\t');
    
    if (parts.length >= 5) {
      const timePeriod = parts[1]; // e.g., 'last_month', 'month_to_date'
      const label = parts[2];
      try {
        const config = JSON.parse(parts[3]);
        const dataArray = JSON.parse(parts[4]);
        
        allData[timePeriod] = {
          label,
          config,
          queries: dataArray
        };
        console.log(`Successfully parsed: ${timePeriod}`);
      } catch (e) {
        console.error(`Error parsing JSON for time period ${timePeriod}:`, e.message);
      }
    } else {
        // Fallback: If it's just raw JSON somehow
        try {
            const dataArray = JSON.parse(line);
            allData['unnamed'] = dataArray;
            console.log('Successfully parsed unnamed JSON array');
        } catch (e) {
            console.error('Line does not match expected format and is not pure JSON');
        }
    }
  }

  fs.writeFileSync('src/data.json', JSON.stringify(allData, null, 2));
  console.log('Successfully wrote parsed data to src/data.json');
}

processLineByLine();
