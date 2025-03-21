const fs = require('fs');
const axios = require('axios');

const INFLUX_URL = process.env.INFLUX_URL;
const INFLUX_TOKEN = process.env.INFLUX_TOKEN;

if (!INFLUX_URL || !INFLUX_TOKEN) {
    console.error("Thiếu INFLUX_URL hoặc INFLUX_TOKEN. Vui lòng kiểm tra lại.");
    process.exit(1);
}

fs.readdirSync('.').filter(file => file.startsWith('results_') && file.endsWith('.json')).forEach(file => {
    console.log(`📂 Đọc file: ${file}`);

    const data = fs.readFileSync(file, 'utf8');
    const jsonData = JSON.parse(data);
    let influxData = '';

    jsonData.run.executions.forEach(exec => {
        const requestName = exec.item.name;
        const responseTime = exec.response.responseTime;
        const statusCode = exec.response.code;

        influxData += `newman_results,request="${requestName}" response_time=${responseTime},status_code=${statusCode} ${Date.now()}\n`;
    });

    axios.post(INFLUX_URL, influxData, {
        headers: {
            'Authorization': `Token ${INFLUX_TOKEN}`,
            'Content-Type': 'text/plain'
        }
    }).then(() => {
        console.log(`✅ Dữ liệu từ ${file} đã gửi thành công!`);
    }).catch(error => {
        console.error(`❌ Lỗi gửi dữ liệu từ ${file}:`, error);
    });
});
