const fs = require('fs');
const csv = require('csv-parser');
const { execSync } = require('child_process');

const users = [];

fs.createReadStream('users.csv')
    .pipe(csv())
    .on('data', (row) => {
        users.push(row);
    })
    .on('end', () => {
        console.log(`Tìm thấy ${users.length} tài khoản. Bắt đầu chạy Newman...`);

        users.forEach((user, index) => {
            console.log(`🔹 Chạy với user: ${user.username}`);

            const command = `newman run LMS.postman_collection.json \
                -e LMS.postman_environment.json \
                --env-var "username=${user.username}" \
                --env-var "password=${user.password}" \
                --reporters cli,json \
                --reporter-json-export results_${index}.json`;

            try {
                execSync(command, { stdio: 'inherit' });
                console.log(`✅ Hoàn thành: ${user.username}`);
            } catch (error) {
                console.error(`❌ Lỗi khi chạy với user: ${user.username}`, error);
            }
        });

        console.log("🎯 Load Test hoàn tất!");
    });
