import fs from 'fs';
import { exec } from 'child_process';

// 读取 user.txt 文件，逐行处理每个号码
function readUserFile(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
        const users = data.split('\n').map(line => line.trim()).filter(line => line);
        checkIMessageUsers(users);
    });
}

// 检查每个号码是否为 iMessage 用户
function checkIMessageUsers(users) {
    const imessageUsers = [];
    
    users.forEach(user => {
        const script = `
            tell application "Messages"
                set targetService to 1st service whose service type = iMessage
                set targetBuddy to buddy "${user}" of targetService
                if targetBuddy is not missing value then
                    return "iMessage user"
                else
                    return "Not an iMessage user"
                end if
            end tell
        `;

        exec(`osascript -e '${script}'`, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                return;
            }
            const result = stdout.trim();
            if (result === "iMessage user") {
                console.log(`${user} is an iMessage user`);
                imessageUsers.push(user);
                if (imessageUsers.length === users.length) {
                    saveIMessageUsers(imessageUsers);
                }
            } else {
                console.log(`${user} is not an iMessage user`);
            }
        });
    });
}

// 保存 iMessage 用户到 imessage.txt
function saveIMessageUsers(imessageUsers) {
    const data = imessageUsers.join('\n');
    fs.writeFile('imessage.txt', data, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log('iMessage users have been saved to imessage.txt');
        }
    });
}

// 使用示例：读取 user.txt 文件并检查每个号码
readUserFile('user.txt');

