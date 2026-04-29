const fs = require('fs');
const readline = require('readline');
const path = require('path');

const FILES = [
    'src/raw_data.txt',
    'src/sales.txt',
    'src/Driver.txt',
    'src/Marketing.txt'
];

const MONEY_KEYS = [
    'total_revenue', 'revenue', 'average_order_value', 'avg_order_value',
    'price', 'total_price', 'discount_amount', 'successful_revenue',
    'daily_revenue', 'abandoned_cart_value', 'converted_cart_value',
    'total_cart_value', 'spend', 'cpc', 'discount_value', 'total_points_awarded',
    'abandoned_value', 'total_loyalty_points', 'avg_loyalty_points',
    'revenue_npr', 'avg_order_value_npr', 'total_revenue_npr',
    'cod_revenue', 'digital_revenue', 'delivery_fee_revenue', 'avg_daily_revenue'
];

function scaleData(data) {
    if (Array.isArray(data)) {
        return data.map(item => scaleData(item));
    } else if (typeof data === 'object' && data !== null) {
        const newData = {};
        for (const key in data) {
            const val = data[key];
            if (MONEY_KEYS.includes(key) && typeof val === 'number') {
                newData[key] = val / 100;
            } else if (MONEY_KEYS.includes(key) && typeof val === 'string' && !isNaN(parseFloat(val)) && !val.includes('-')) {
                newData[key] = parseFloat(val) / 100;
            } else {
                newData[key] = scaleData(val);
            }
        }
        return newData;
    }
    return data;
}

async function processFiles() {
    const allData = {};

    for (const filePath of FILES) {
        if (!fs.existsSync(filePath)) {
            console.warn(`File not found: ${filePath}`);
            continue;
        }

        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split(/\r?\n/);

        console.log(`Processing: ${filePath} (${lines.length} lines)`);

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            let parts = line.split('\t');
            if (parts.length < 4) {
                parts = line.split(/\s{2,}/);
            }

            if (parts.length >= 4) {
                const timePeriod = parts[1].trim();
                const label = parts[2].trim();
                let config = {};
                let queries = [];

                if (parts.length >= 5) {
                    // 5 parts: Module, Period, Label, Config, Queries
                    try {
                        config = JSON.parse(parts[3].trim());
                        queries = JSON.parse(parts.slice(4).join('\t').trim());
                    } catch (e) {
                        // Maybe parts[3] was actually the queries?
                        try {
                            queries = JSON.parse(parts.slice(3).join('\t').trim());
                        } catch (e2) {
                            console.error(`  [Line ${i+1}] Parse error (5 parts) in ${path.basename(filePath)}`);
                        }
                    }
                } else {
                    // 4 parts: Module, Period, Label, Queries
                    try {
                        queries = JSON.parse(parts[3].trim());
                    } catch (e) {
                        console.error(`  [Line ${i+1}] Parse error (4 parts) in ${path.basename(filePath)}`);
                    }
                }

                if (queries.length > 0) {
                    if (!allData[timePeriod]) {
                        allData[timePeriod] = {
                            label,
                            config,
                            queries: []
                        };
                    }

                    const scaledQueries = scaleData(queries);
                    scaledQueries.forEach(newQuery => {
                        const existingIdx = allData[timePeriod].queries.findIndex(q => q.query_name === newQuery.query_name);
                        if (existingIdx !== -1) {
                            const existingQuery = allData[timePeriod].queries[existingIdx];
                            
                            // SMART RESOLUTION LOGIC
                            // 1. KPI Summaries (usually 1 row): Keep the one with higher total_revenue or total_orders
                            if (newQuery.result.length === 1 && existingQuery.result.length === 1) {
                                const getVal = (q) => (q.result[0].total_revenue || q.result[0].revenue || q.result[0].total_orders || 0);
                                if (getVal(newQuery) > getVal(existingQuery)) {
                                    allData[timePeriod].queries[existingIdx] = newQuery;
                                    console.log(`    [Conflict Resolved] ${newQuery.query_name} (${timePeriod}): Kept NEW (Larger Metric)`);
                                } else {
                                    console.log(`    [Conflict Resolved] ${newQuery.query_name} (${timePeriod}): Kept EXISTING (Larger/Equal Metric)`);
                                }
                            } 
                            // 2. Trend/List data: Merge results and deduplicate by common keys (date, name, id)
                            else if (newQuery.result.length > 0 && existingQuery.result.length > 0) {
                                const keys = Object.keys(newQuery.result[0]);
                                const uniqueKey = keys.find(k => k.includes('date') || k.includes('name') || k.includes('id') || k.includes('category') || k.includes('type'));
                                
                                if (uniqueKey) {
                                    const merged = [...existingQuery.result];
                                    newQuery.result.forEach(newItem => {
                                        if (!merged.some(oldItem => oldItem[uniqueKey] === newItem[uniqueKey])) {
                                            merged.push(newItem);
                                        }
                                    });
                                    allData[timePeriod].queries[existingIdx].result = merged;
                                    console.log(`    [Conflict Resolved] ${newQuery.query_name} (${timePeriod}): Merged ${newQuery.result.length} new records`);
                                } else {
                                    // Fallback: Keep one with more rows
                                    if (newQuery.result.length > existingQuery.result.length) {
                                        allData[timePeriod].queries[existingIdx] = newQuery;
                                        console.log(`    [Conflict Resolved] ${newQuery.query_name} (${timePeriod}): Overwrote with larger result set`);
                                    }
                                }
                            }
                        } else {
                            allData[timePeriod].queries.push(newQuery);
                        }
                    });
                    console.log(`  [Line ${i+1}] Parsed time period: ${timePeriod}`);
                }
            }
        }
    }

    for (const period in allData) {
        allData[period].queries.sort((a, b) => a.query_name.localeCompare(b.query_name));
    }

    fs.writeFileSync('src/data.json', JSON.stringify(allData, null, 2));
    console.log('\nSuccessfully wrote consolidated and scaled data to src/data.json');
}

processFiles();
