const Service = require('node-windows').Service;

// Buat layanan baru
const svc = new Service({
    name: 'Anomaly POS', // Nama layanan
    description: 'Aplikasi Node.js berjalan sebagai service.',
    script: 'server.js', // Path ke script utama aplikasi Anda
    nodeOptions: [
        '--harmony',
        '--max_old_space_size=4096'
    ],
});

// Tambahkan event listener saat service di-install
svc.on('install', () => {
    console.log('Service Installed!');
    svc.start(); // Mulai layanan setelah terinstall
});

svc.on('uninstall', () => {
    console.log('Service Uninstalled!');
});

svc.on('alreadyinstalled', () => {
    console.log('Service already installed.');
});

svc.on('error', (err) => {
    console.error('Service error:', err);
});


// // Install layanan
svc.install();

// Install layanan
// svc.uninstall();