import { Router } from 'express';
import { WebSocket } from 'ws';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

const UPLOAD_DIR = path.join(__dirname, '..', '..', 'src', 'lib', 'backgrounds');

try {
    await fs.access(UPLOAD_DIR);
} catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: async (req, file, cb) => {
        const randomString = generateRandomString();
        const ext = path.extname(file.originalname); 

        if (file.mimetype.startsWith('image')) {
            await clearExistingFiles('image');
            cb(null, `image_${randomString}${ext}`); 
        } else if (file.mimetype.startsWith('video')) {
            await clearExistingFiles('video');
            cb(null, `video_${randomString}${ext}`); 
        }
    }
});


const upload = multer({ storage });


const clearExistingFiles = async (fileType) => {
    const files = await fs.readdir(UPLOAD_DIR);
    
    if (fileType === 'image') {
        for (const file of files) {
            if (file.match(/\.(jpg|jpeg|png|gif|webp|heif|heic)$/)) {  
                await fs.unlink(path.join(UPLOAD_DIR, file));
            }
        }
    } else if (fileType === 'video') {
        for (const file of files) {
            if (file.match(/\.(mp4|mov|avi)$/)) {  
                await fs.unlink(path.join(UPLOAD_DIR, file));
            }
        }
    }
};



router.post('/upload', upload.single('media'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ status: 'fail', message: 'No file uploaded' });
    }

    const fileType = req.file.mimetype.startsWith('image') ? 'image' : 'video';
    const fileUrl = req.file.filename;

    
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: fileType,
                file: fileUrl
            }));
        }
    });

    res.status(200).json({ status: 'success', fileType, fileUrl });
});

router.post('/control', (req, res) => {
    const { control } = req.body;

    
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({control: control}));
        }
    });

    
    res.status(200).json({ status: 'success', message: 'Control message sent to WebSocket clients' });
});

router.post('/color', (req, res) => {
    const { color } = req.body;

    
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({color: color}));
        }
    });

    
    res.status(200).json({ status: 'success', message: 'Color Message sent to WebSocket clients' });
});

router.post('/toggle', (req, res) => {
    const { backgroundType } = req.body;

    
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({backgroundType: backgroundType}));
        }
    });

    
    res.status(200).json({ status: 'success', message: 'Toggle Message sent to WebSocket clients' });
});


let clients = [];

export const setupMediaUploadWebSocket = (wss) => {
    wss.on('connection', (ws) => {
        console.log('Client connected to Messages WebSocket');
        clients.push(ws);

        ws.on('message', (message) => {
            console.log(`Received from Messages WebSocket: ${message}`);
            clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(`Message: ${message}`);
                }
            });
        });

        ws.on('close', () => {
            clients = clients.filter(client => client !== ws);
            console.log('Client disconnected from Messages WebSocket');
        });
    });
};

export default router;

function generateRandomString(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }

    return result;
}