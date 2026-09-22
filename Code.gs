function doGet() {
  var html = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Presensi Berbasis Lokasi - UPT Puskesmas Kokap II</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
        }
        .glass-card {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.5);
        }
    </style>
</head>
<body class="flex items-center justify-center p-4 text-gray-800">

    <div class="w-full max-w-lg bg-white/85 backdrop-blur-xl rounded-[32px] shadow-2xl overflow-hidden border border-white/60 p-6 relative">
        
        <!-- Header -->
        <div class="text-center mb-5">
            <div class="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl mx-auto flex items-center justify-center text-white text-2xl shadow-lg mb-3">
                <i class="fa-solid fa-location-dot"></i>
            </div>
            <h1 class="text-xl font-bold text-gray-900">Presensi Berbasis Lokasi</h1>
            <p class="text-xs text-gray-500 mt-1">UPT Puskesmas Kokap II</p>
        </div>

        <!-- TAB SWITCHER (Login / Daftar) -->
        <div id="authTabs" class="flex bg-gray-200/70 p-1 rounded-2xl mb-5">
            <button onclick="switchTab('login')" id="tabLoginBtn" class="flex-1 py-2 text-xs font-bold rounded-xl bg-white text-blue-600 shadow-sm transition-all">Masuk</button>
            <button onclick="switchTab('register')" id="tabRegisterBtn" class="flex-1 py-2 text-xs font-bold rounded-xl text-gray-500 transition-all">Daftar Akun</button>
        </div>

        <!-- VIEW 1A: FORM LOGIN -->
        <div id="loginView" class="space-y-4">
            <button onclick="handleGoogleLogin()" id="googleLoginBtn" 
                class="w-full py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl shadow-md border border-gray-300 transition-all flex items-center justify-center space-x-3 text-sm">
                <svg class="w-5 h-5" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                <span>Masuk dengan Akun Google</span>
            </button>

            <div class="relative flex py-1 items-center">
                <div class="flex-grow border-t border-gray-200"></div>
                <span class="flex-shrink mx-4 text-gray-400 text-xs font-medium">Atau ketik email</span>
                <div class="flex-grow border-t border-gray-200"></div>
            </div>

            <div>
                <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">Email Pegawai</label>
                <div class="relative">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400"><i class="fa-solid fa-envelope"></i></span>
                    <input type="email" id="emailInput" placeholder="nama@email.com" 
                        class="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all">
                </div>
            </div>
            <button onclick="handleLogin()" id="loginBtn" 
                class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-sm">
                <span>Masuk dengan Email</span>
                <i class="fa-solid fa-arrow-right text-xs"></i>
            </button>
            <div id="loginError" class="hidden text-center text-xs text-red-500 font-medium mt-2"></div>
        </div>

        <!-- VIEW 1B: FORM PENDAFTARAN -->
        <div id="registerView" class="hidden space-y-3">
            <div>
                <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">Email Aktif</label>
                <input type="email" id="regEmail" placeholder="nama@email.com" class="w-full px-3 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
                <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">Nama Lengkap & Gelar</label>
                <input type="text" id="regNama" placeholder="Dr. Budi Santoso" class="w-full px-3 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
                <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">Jabatan / Unit</label>
                <input type="text" id="regJabatan" placeholder="Dokter Umum / Staf BOK" class="w-full px-3 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <button onclick="handleRegister()" id="regBtn" 
                class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all text-sm">
                Daftar Sekarang
            </button>
            <div id="regAlert" class="hidden p-2 rounded-xl text-xs font-medium text-center"></div>
        </div>

        <!-- VIEW 2: DASHBOARD USER (Pegawai) -->
        <div id="dashboardView" class="hidden space-y-4">
            <div class="glass-card p-4 rounded-2xl flex items-center space-x-3 shadow-sm">
                <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-lg font-bold" id="userInitial">U</div>
                <div class="flex-1 min-w-0">
                    <h2 class="font-bold text-sm text-gray-900 truncate" id="userName">-</h2>
                    <p class="text-xs text-gray-500 truncate" id="userEmail">-</p>
                    <span class="inline-block px-2 py-0.5 mt-1 bg-green-100 text-green-700 text-[10px] font-semibold rounded-full" id="userRoleTag">Pegawai</span>
                </div>
                <button onclick="handleLogout()" class="text-gray-400 hover:text-red-500 text-sm p-2" title="Keluar"><i class="fa-solid fa-right-from-bracket"></i></button>
            </div>

            <div class="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-4 rounded-2xl text-center shadow-md">
                <p class="text-xs text-blue-200 uppercase tracking-widest font-medium" id="currentDate">-</p>
                <h3 class="text-3xl font-bold my-1 tracking-tight" id="currentTime">00:00:00</h3>
                <p class="text-[11px] text-blue-300"><i class="fa-solid fa-tower-broadcast mr-1"></i> Radius Max: <span class="font-semibold">150 Meter</span></p>
            </div>

            <div class="space-y-3">
                <div>
                    <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">Status Kehadiran</label>
                    <select id="statusSelect" class="w-full px-3 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="Hadir">Hadir (Masuk Kerja)</option>
                        <option value="Pulang">Pulang Kerja</option>
                        <option value="Dinas Luar">Dinas Luar</option>
                        <option value="Izin / Sakit">Izin / Sakit</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">Catatan Kegiatan (Opsional)</label>
                    <textarea id="notesInput" rows="2" placeholder="Catatan singkat..." class="w-full px-3 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"></textarea>
                </div>

                <!-- Status GPS Indicator -->
                <div id="gpsStatus" class="text-xs text-gray-500 bg-gray-50 p-2.5 rounded-xl border border-gray-200 flex items-center justify-between">
                    <span class="flex items-center space-x-1.5"><i class="fa-solid fa-crosshairs text-blue-500"></i><span id="gpsText">GPS Siap Mendeteksi Lokasi</span></span>
                    <span id="gpsBadge" class="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-[10px] font-bold">Menunggu</span>
                </div>

                <button onclick="submitPresensiWithLocation()" id="submitBtn" class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all text-sm flex items-center justify-center space-x-2">
                    <i class="fa-solid fa-location-arrow"></i><span>Kirim Presensi GPS</span>
                </button>
            </div>
            <div id="responseAlert" class="hidden p-3 rounded-xl text-xs font-medium text-center"></div>
        </div>

        <!-- VIEW 3: DASHBOARD ADMIN -->
        <div id="adminDashboardView" class="hidden space-y-4">
            <div class="glass-card p-4 rounded-2xl flex items-center space-x-3 shadow-sm bg-indigo-50/80">
                <div class="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-lg font-bold"><i class="fa-solid fa-user-shield"></i></div>
                <div class="flex-1 min-w-0">
                    <h2 class="font-bold text-sm text-gray-900 truncate" id="adminName">-</h2>
                    <span class="inline-block px-2 py-0.5 mt-1 bg-indigo-200 text-indigo-800 text-[10px] font-semibold rounded-full">Administrator GPS</span>
                </div>
                <button onclick="handleLogout()" class="text-gray-400 hover:text-red-500 text-sm p-2" title="Keluar"><i class="fa-solid fa-right-from-bracket"></i></button>
            </div>

            <div class="grid grid-cols-2 gap-3 text-center">
                <div class="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                    <p class="text-[11px] text-gray-400 uppercase font-semibold">Total Pegawai</p>
                    <h3 class="text-xl font-bold text-blue-600 mt-1" id="statPegawai">0</h3>
                </div>
                <div class="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                    <p class="text-[11px] text-gray-400 uppercase font-semibold">Masuk Hari Ini</p>
                    <h3 class="text-xl font-bold text-emerald-600 mt-1" id="statPresensi">0</h3>
                </div>
            </div>

            <!-- Panel Rekapitulasi Bulanan -->
            <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-3">
                <h4 class="text-xs font-bold text-gray-700 uppercase tracking-wider"><i class="fa-solid fa-calendar-days text-indigo-600 mr-1.5"></i> Rekapitulasi Bulanan & Keterlambatan</h4>
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <label class="block text-[11px] font-semibold text-gray-500 mb-1">Pilih Bulan</label>
                        <select id="rekapBulan" class="w-full px-2.5 py-2 bg-gray-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="1">Januari</option>
                            <option value="2">Februari</option>
                            <option value="3">Maret</option>
                            <option value="4">April</option>
                            <option value="5">Mei</option>
                            <option value="6">Juni</option>
                            <option value="7">Juli</option>
                            <option value="8">Agustus</option>
                            <option value="9">September</option>
                            <option value="10">Oktober</option>
                            <option value="11">November</option>
                            <option value="12">Desember</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-[11px] font-semibold text-gray-500 mb-1">Tahun</label>
                        <select id="rekapTahun" class="w-full px-2.5 py-2 bg-gray-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="2026">2026</option>
                            <option value="2027">2027</option>
                            <option value="2025">2025</option>
                        </select>
                    </div>
                </div>
                <div class="flex space-x-2">
                    <button onclick="generateRekap()" id="rekapBtn" class="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs transition-all shadow-sm">
                        <i class="fa-solid fa-file-excel mr-1"></i> Buat Sheet Rekap
                    </button>
                </div>
                <div id="rekapAlert" class="hidden p-2.5 rounded-xl text-xs font-medium text-center"></div>
            </div>

            <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-2">
                <h4 class="text-xs font-bold text-gray-700 uppercase tracking-wider">Akses Spreadsheet Utama</h4>
                <a href="#" id="sheetLink" target="_blank" class="block w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-xl text-center text-xs transition-all">
                    <i class="fa-solid fa-table mr-1"></i> Buka Google Spreadsheet
                </a>
            </div>
        </div>

        <!-- Footer -->
        <div class="mt-5 text-center border-t border-gray-100 pt-3">
            <p class="text-[11px] text-gray-400">© 2026 UPT Puskesmas Kokap II</p>
        </div>

    </div>

    <script>
        document.getElementById('rekapBulan').value = new Date().getMonth() + 1;

        setInterval(() => {
            const now = new Date();
            document.getElementById('currentTime').innerText = now.toLocaleTimeString('id-ID');
            document.getElementById('currentDate').innerText = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        }, 1000);

        let currentUser = null;

        function switchTab(tab) {
            let loginView = document.getElementById('loginView');
            let regView = document.getElementById('registerView');
            let btnLogin = document.getElementById('tabLoginBtn');
            let btnReg = document.getElementById('tabRegisterBtn');

            if (tab === 'login') {
                loginView.classList.remove('hidden');
                regView.classList.add('hidden');
                btnLogin.className = "flex-1 py-2 text-xs font-bold rounded-xl bg-white text-blue-600 shadow-sm transition-all";
                btnReg.className = "flex-1 py-2 text-xs font-bold rounded-xl text-gray-500 transition-all";
            } else {
                loginView.classList.add('hidden');
                regView.classList.remove('hidden');
                btnReg.className = "flex-1 py-2 text-xs font-bold rounded-xl bg-white text-indigo-600 shadow-sm transition-all";
                btnLogin.className = "flex-1 py-2 text-xs font-bold rounded-xl text-gray-500 transition-all";
            }
        }

        function handleRegister() {
            let email = document.getElementById('regEmail').value.trim();
            let nama = document.getElementById('regNama').value.trim();
            let jabatan = document.getElementById('regJabatan').value.trim();
            let alertBox = document.getElementById('regAlert');
            let btn = document.getElementById('regBtn');

            if (!email || !nama || !jabatan) {
                alertBox.innerText = "Semua kolom wajib diisi!";
                alertBox.className = "p-2 rounded-xl text-xs font-medium text-center bg-red-100 text-red-700";
                alertBox.classList.remove('hidden');
                return;
            }

            btn.disabled = true;
            btn.innerText = "Mendaftarkan...";

            google.script.run
                .withSuccessHandler(res => {
                    btn.disabled = false;
                    btn.innerText = "Daftar Sekarang";
                    alertBox.innerText = res.message;
                    alertBox.className = res.success ? "p-2 rounded-xl text-xs font-medium text-center bg-green-100 text-green-700" : "p-2 rounded-xl text-xs font-medium text-center bg-red-100 text-red-700";
                    alertBox.classList.remove('hidden');
                    if (res.success) {
                        document.getElementById('regEmail').value = '';
                        document.getElementById('regNama').value = '';
                        document.getElementById('regJabatan').value = '';
                        setTimeout(() => switchTab('login'), 2000);
                    }
                })
                .withFailureHandler(() => {
                    btn.disabled = false;
                    btn.innerText = "Daftar Sekarang";
                    alertBox.innerText = "Gagal memproses pendaftaran.";
                    alertBox.className = "p-2 rounded-xl text-xs font-medium text-center bg-red-100 text-red-700";
                    alertBox.classList.remove('hidden');
                })
                .registerUser(email, nama, jabatan);
        }

        function handleGoogleLogin() {
            let btn = document.getElementById('googleLoginBtn');
            let errDiv = document.getElementById('loginError');

            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> Menghubungkan Google...';
            errDiv.classList.add('hidden');

            google.script.run
                .withSuccessHandler(result => {
                    btn.disabled = false;
                    btn.innerHTML = '<svg class="w-5 h-5" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg><span>Masuk dengan Akun Google</span>';
                    processLoginResult(result);
                })
                .withFailureHandler(() => {
                    btn.disabled = false;
                    btn.innerHTML = '<span>Masuk dengan Akun Google</span>';
                    errDiv.innerText = "Gagal mendeteksi akun Google.";
                    errDiv.classList.remove('hidden');
                })
                .loginWithGoogle();
        }

        function handleLogin() {
            let email = document.getElementById('emailInput').value.trim();
            let errDiv = document.getElementById('loginError');
            let btn = document.getElementById('loginBtn');

            if (!email) {
                errDiv.innerText = "Masukkan alamat email Anda!";
                errDiv.classList.remove('hidden');
                return;
            }

            btn.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> Memeriksa...';
            errDiv.classList.add('hidden');

            google.script.run
                .withSuccessHandler(result => {
                    btn.innerHTML = '<span>Masuk dengan Email</span><i class="fa-solid fa-arrow-right text-xs"></i>';
                    processLoginResult(result);
                })
                .withFailureHandler(() => {
                    btn.innerHTML = '<span>Masuk dengan Email</span><i class="fa-solid fa-arrow-right text-xs"></i>';
                    errDiv.innerText = "Terjadi kesalahan sistem.";
                    errDiv.classList.remove('hidden');
                })
                .verifyEmail(email);
        }

        function processLoginResult(result) {
            let errDiv = document.getElementById('loginError');
            if (result.success) {
                currentUser = result.data;
                document.getElementById('authTabs').classList.add('hidden');
                document.getElementById('loginView').classList.add('hidden');

                if (currentUser.role.toLowerCase() === 'admin') {
                    document.getElementById('adminName').innerText = currentUser.nama;
                    document.getElementById('sheetLink').href = result.sheetUrl;
                    document.getElementById('statPegawai').innerText = result.totalPegawai;
                    document.getElementById('statPresensi').innerText = result.totalMasukHariIni;
                    document.getElementById('adminDashboardView').classList.remove('hidden');
                } else {
                    document.getElementById('userName').innerText = currentUser.nama;
                    document.getElementById('userEmail').innerText = currentUser.email;
                    document.getElementById('userRoleTag').innerText = currentUser.jabatan;
                    document.getElementById('userInitial').innerText = currentUser.nama.charAt(0).toUpperCase();
                    document.getElementById('dashboardView').classList.remove('hidden');
                }
            } else {
                errDiv.innerText = result.message;
                errDiv.classList.remove('hidden');
            }
        }

        function handleLogout() {
            currentUser = null;
            document.getElementById('emailInput').value = '';
            document.getElementById('authTabs').classList.remove('hidden');
            document.getElementById('loginView').classList.remove('hidden');
            document.getElementById('dashboardView').classList.add('hidden');
            document.getElementById('adminDashboardView').classList.add('hidden');
            document.getElementById('responseAlert').classList.add('hidden');
        }

        function generateRekap() {
            let bulan = parseInt(document.getElementById('rekapBulan').value);
            let tahun = parseInt(document.getElementById('rekapTahun').value);
            let btn = document.getElementById('rekapBtn');
            let alertBox = document.getElementById('rekapAlert');

            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> Menyusun Rekap...';
            alertBox.classList.add('hidden');

            google.script.run
                .withSuccessHandler(res => {
                    btn.disabled = false;
                    btn.innerHTML = '<i class="fa-solid fa-file-excel mr-1"></i> Buat Sheet Rekap';
                    alertBox.innerText = res.message;
                    alertBox.className = res.success ? "p-2.5 rounded-xl text-xs font-medium text-center bg-green-100 text-green-700" : "p-2.5 rounded-xl text-xs font-medium text-center bg-red-100 text-red-700";
                    alertBox.classList.remove('hidden');
                })
                .withFailureHandler(() => {
                    btn.disabled = false;
                    btn.innerHTML = '<i class="fa-solid fa-file-excel mr-1"></i> Buat Sheet Rekap';
                    alertBox.innerText = "Gagal membuat rekap bulanan.";
                    alertBox.className = "p-2.5 rounded-xl text-xs font-medium text-center bg-red-100 text-red-700";
                    alertBox.classList.remove('hidden');
                })
                .exportMonthlyRecapToSheet(bulan, tahun);
        }

        function submitPresensiWithLocation() {
            let status = document.getElementById('statusSelect').value;
            let notes = document.getElementById('notesInput').value;
            let btn = document.getElementById('submitBtn');
            let alertBox = document.getElementById('responseAlert');
            let gpsText = document.getElementById('gpsText');
            let gpsBadge = document.getElementById('gpsBadge');

            if (!navigator.geolocation) {
                alertBox.innerText = "Browser Anda tidak Mendukung GPS Geolocation.";
                alertBox.className = "p-3 rounded-xl text-xs font-medium text-center bg-red-100 text-red-700";
                alertBox.classList.remove('hidden');
                return;
            }

            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> Mendapatkan Lokasi GPS...';
            gpsText.innerText = "Mendeteksi posisi perangkat...";
            gpsBadge.innerText = "GPS...";
            gpsBadge.className = "px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-[10px] font-bold";

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    let lat = position.coords.latitude;
                    let lng = position.coords.longitude;

                    gpsText.innerText = \`Lat: \${lat.toFixed(5)}, Lng: \${lng.toFixed(5)}\`;
                    gpsBadge.innerText = "Aktif";
                    gpsBadge.className = "px-2 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-bold";

                    btn.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> Memvalidasi & Mengirim...';

                    google.script.run
                        .withSuccessHandler(res => {
                            btn.disabled = false;
                            btn.innerHTML = '<i class="fa-solid fa-location-arrow"></i><span>Kirim Presensi GPS</span>';
                            alertBox.innerText = res.message;
                            
                            // Styling dinamis jika ada notifikasi keterlambatan
                            if(res.success && res.isLate) {
                                alertBox.className = "p-3 rounded-xl text-xs font-semibold text-center bg-amber-100 text-amber-800 border border-amber-300";
                            } else {
                                alertBox.className = res.success ? "p-3 rounded-xl text-xs font-medium text-center bg-green-100 text-green-700" : "p-3 rounded-xl text-xs font-medium text-center bg-red-100 text-red-700";
                            }
                            
                            alertBox.classList.remove('hidden');
                            if(res.success) document.getElementById('notesInput').value = '';
                        })
                        .withFailureHandler(() => {
                            btn.disabled = false;
                            btn.innerHTML = '<i class="fa-solid fa-location-arrow"></i><span>Kirim Presensi GPS</span>';
                            alertBox.innerText = "Gagal mengirim data presensi.";
                            alertBox.className = "p-3 rounded-xl text-xs font-medium text-center bg-red-100 text-red-700";
                            alertBox.classList.remove('hidden');
                        })
                        .recordAttendanceWithGPS(currentUser.email, currentUser.nama, status, notes, lat, lng);
                },
                (error) => {
                    btn.disabled = false;
                    btn.innerHTML = '<i class="fa-solid fa-location-arrow"></i><span>Kirim Presensi GPS</span>';
                    gpsText.innerText = "Gagal mendeteksi lokasi GPS";
                    gpsBadge.innerText = "Error";
                    gpsBadge.className = "px-2 py-0.5 bg-red-100 text-red-700 rounded text-[10px] font-bold";

                    let errMsg = "Pastikan izin GPS / Lokasi diaktifkan pada browser Anda.";
                    if(error.code === error.PERMISSION_DENIED) {
                        errMsg = "Izin akses lokasi ditolak. Mohon izinkan akses lokasi pada browser.";
                    }
                    alertBox.innerText = errMsg;
                    alertBox.className = "p-3 rounded-xl text-xs font-medium text-center bg-red-100 text-red-700";
                    alertBox.classList.remove('hidden');
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        }
    </script>
</body>
</html>`;

  return HtmlService.createHtmlOutput(html)
      .setTitle('Presensi Lokasi - UPT Puskesmas Kokap II')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1');
}

// Backend: Pendaftaran Pegawai Baru
function registerUser(email, nama, jabatan) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Pegawai');
  if (!sheet) return { success: false, message: "Sheet 'Pegawai' tidak ditemukan." };
  
  var data = sheet.getDataRange().getValues();
  for (var i = 3; i < data.length; i++) {
    if (String(data[i][0]).trim().toLowerCase() === email.toLowerCase()) {
      return { success: false, message: "Email sudah terdaftar dalam sistem." };
    }
  }
  
  sheet.appendRow([email, nama, jabatan, 'Pegawai']);
  return { success: true, message: "Pendaftaran berhasil! Silakan masuk." };
}

// Backend: Login Google
function loginWithGoogle() {
  try {
    var email = Session.getActiveUser().getEmail();
    if (!email) return { success: false, message: "Tidak dapat mendeteksi akun Google Anda." };
    return verifyEmail(email);
  } catch (err) {
    return { success: false, message: "Error Google Login: " + err.message };
  }
}

// Backend: Verifikasi Email & Role
function verifyEmail(email) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetPegawai = ss.getSheetByName('Pegawai');
  if (!sheetPegawai) return { success: false, message: "Sheet 'Pegawai' tidak ditemukan." };
  
  var data = sheetPegawai.getDataRange().getValues();
  var userData = null;
  
  for (var i = 3; i < data.length; i++) {
    if (String(data[i][0]).trim().toLowerCase() === email.toLowerCase()) {
      userData = {
        email: data[i][0],
        nama: data[i][1],
        jabatan: data[i][2] || 'Pegawai',
        role: String(data[i][3] || 'Pegawai').trim()
      };
      break;
    }
  }
  
  if (!userData) {
    return { success: false, message: "Email (" + email + ") belum terdaftar. Silakan daftar terlebih dahulu." };
  }
  
  var response = { success: true, data: userData, sheetUrl: ss.getUrl() };
  
  if (userData.role.toLowerCase() === 'admin') {
    response.totalPegawai = data.length > 3 ? data.length - 3 : 0;
    
    var sheetMasuk = ss.getSheetByName('Masuk');
    var totalMasuk = 0;
    if (sheetMasuk && sheetMasuk.getLastRow() > 1) {
      var pData = sheetMasuk.getDataRange().getValues();
      var todayStr = Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd");
      for (var j = 1; j < pData.length; j++) {
        var pDate = Utilities.formatDate(new Date(pData[j][0]), "Asia/Jakarta", "yyyy-MM-dd");
        if (pDate === todayStr) totalMasuk++;
      }
    }
    response.totalMasukHariIni = totalMasuk;
  }
  
  return response;
}

// Fungsi Hitung Jarak Haversine (meter)
function calculateDistance(lat1, lon1, lat2, lon2) {
  var R = 6371000;
  var dLat = (lat2 - lat1) * Math.PI / 180;
  var dLon = (lon2 - lon1) * Math.PI / 180;
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Backend: Catat Presensi Berdasarkan Status & Hitung Keterlambatan
function recordAttendanceWithGPS(email, nama, status, notes, userLat, userLng) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  var now = new Date();
  var timeString = Utilities.formatDate(now, "Asia/Jakarta", "HH:mm");
  var dayOfWeek = parseInt(Utilities.formatDate(now, "Asia/Jakarta", "u"));
  var parts = timeString.split(":");
  var currentTimeMinutes = parseInt(parts[0]) * 60 + parseInt(parts[1]);

  if (dayOfWeek === 7) {
    return { success: false, message: "Hari Minggu libur. Presensi ditutup." };
  }

  var latenessMinutes = 0;
  var standardStart = 7 * 60 + 0; // 07:00 WIB batas jam masuk

  if (status === "Hadir") {
    var startTime = 7 * 60 + 0;
    var endTime = 8 * 60 + 30;
    if (currentTimeMinutes < startTime || currentTimeMinutes > endTime) {
      return { success: false, message: "Presensi Masuk (Hadir) hanya dibuka pukul 07:00 - 08:30 WIB." };
    }
    // Hitung keterlambatan jika hadir di atas 07:00 WIB
    if (currentTimeMinutes > standardStart) {
      latenessMinutes = currentTimeMinutes - standardStart;
    }
  } else if (status === "Pulang") {
    var pulangStart = 0, pulangEnd = 0, jamKet = "";
    if (dayOfWeek >= 1 && dayOfWeek <= 4) {
      pulangStart = 14 * 60 + 30; pulangEnd = 15 * 60 + 0; jamKet = "14:30 - 15:00 WIB";
    } else if (dayOfWeek === 5) {
      pulangStart = 11 * 60 + 30; pulangEnd = 12 * 60 + 0; jamKet = "11:30 - 12:00 WIB";
    } else if (dayOfWeek === 6) {
      pulangStart = 13 * 60 + 0; pulangEnd = 13 * 60 + 30; jamKet = "13:00 - 13:30 WIB";
    }
    if (currentTimeMinutes < pulangStart || currentTimeMinutes > pulangEnd) {
      return { success: false, message: "Presensi Pulang hari ini dibatasi pukul " + jamKet + "." };
    }
  } else {
    if (currentTimeMinutes < (7 * 60) || currentTimeMinutes > (15 * 60)) {
      return { success: false, message: "Pengajuan izin/dinas luar hanya pukul 07:00 - 15:00 WIB." };
    }
  }

  var puskLat = -7.798867;
  var puskLng = 110.114815;
  var maxRadius = 150;

  var distance = calculateDistance(puskLat, puskLng, userLat, userLng);
  var locationInfo = "Lat: " + userLat.toFixed(5) + ", Lng: " + userLng.toFixed(5) + " (Jarak: " + Math.round(distance) + "m)";

  if ((status === "Hadir" || status === "Pulang") && distance > maxRadius) {
    return { 
      success: false, 
      message: "Gagal! Anda berada di luar radius Puskesmas Kokap II (" + Math.round(distance) + " meter dari lokasi). Maksimal radius adalah " + maxRadius + " meter." 
    };
  }

  var targetSheetName = "Masuk";
  if (status === "Pulang") {
    targetSheetName = "Pulang";
  } else if (status === "Dinas Luar") {
    targetSheetName = "Dinas Luar";
  } else if (status === "Izin / Sakit") {
    targetSheetName = "Izin";
  }

  var targetSheet = ss.getSheetByName(targetSheetName);
  if (!targetSheet) {
    targetSheet = ss.insertSheet(targetSheetName);
    if (targetSheetName === "Masuk") {
      targetSheet.appendRow(["Waktu", "Email", "Nama", "Status", "Catatan", "Info GPS / Jarak", "Terlambat (Menit)"]);
    } else {
      targetSheet.appendRow(["Waktu", "Email", "Nama", "Status", "Catatan", "Info GPS / Jarak"]);
    }
  }

  // Jika sheet sudah ada tapi belum ada kolom keterlambatan di baris header, pastikan aman
  if (targetSheetName === "Masuk" && targetSheet.getLastRow() === 1) {
    targetSheet.clear();
    targetSheet.appendRow(["Waktu", "Email", "Nama", "Status", "Catatan", "Info GPS / Jarak", "Terlambat (Menit)"]);
  }

  if (targetSheetName === "Masuk") {
    targetSheet.appendRow([now, email, nama, status, notes || '-', locationInfo, latenessMinutes]);
  } else {
    targetSheet.appendRow([now, email, nama, status, notes || '-', locationInfo]);
  }

  var responseMessage = "Berhasil! Presensi (" + status + ") tercatat (" + Math.round(distance) + "m).";
  var isLate = false;

  if (status === "Hadir" && latenessMinutes > 0) {
    isLate = true;
    responseMessage = "⚠️ PERHATIAN: Presensi tercatat, namun Anda TERLAMBAT " + latenessMinutes + " menit dari jam masuk standar (07:00 WIB).";
  }
  
  return { success: true, message: responseMessage, isLate: isLate };
}

// Backend: Generate Rekap Bulanan Termasuk Keterlambatan
function exportMonthlyRecapToSheet(targetMonth, targetYear) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  var sheetPegawai = ss.getSheetByName('Pegawai');
  if (!sheetPegawai) return { success: false, message: "Sheet 'Pegawai' tidak ditemukan." };
  var pegawaiData = sheetPegawai.getDataRange().getValues();
  
  var recapMap = {};
  for (var i = 3; i < pegawaiData.length; i++) {
    var email = String(pegawaiData[i][0]).trim().toLowerCase();
    if (email) {
      recapMap[email] = {
        email: pegawaiData[i][0],
        nama: pegawaiData[i][1],
        jabatan: pegawaiData[i][2] || 'Pegawai',
        hadir: 0,
        totalTerlambatMenit: 0,
        pulang: 0,
        dinasLuar: 0,
        izin: 0
      };
    }
  }
  
  // Proses sheet Masuk dan hitung akumulasi menit keterlambatan
  var sheetMasuk = ss.getSheetByName('Masuk');
  if (sheetMasuk && sheetMasuk.getLastRow() > 1) {
    var rowsMasuk = sheetMasuk.getDataRange().getValues();
    for (var r = 1; r < rowsMasuk.length; r++) {
      var rowDate = new Date(rowsMasuk[r][0]);
      if (!isNaN(rowDate.getTime())) {
        var m = rowDate.getMonth() + 1;
        var y = rowDate.getFullYear();
        if (m === targetMonth && y === targetYear) {
          var emailRow = String(rowsMasuk[r][1]).trim().toLowerCase();
          if (recapMap[emailRow]) {
            recapMap[emailRow].hadir++;
            var lateMins = parseInt(rowsMasuk[r][6]) || 0;
            recapMap[emailRow].totalTerlambatMenit += lateMins;
          }
        }
      }
    }
  }
  
  function processOtherSheet(sheetName, keyName) {
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet || sheet.getLastRow() <= 1) return;
    var rows = sheet.getDataRange().getValues();
    for (var r = 1; r < rows.length; r++) {
      var rowDate = new Date(rows[r][0]);
      if (!isNaN(rowDate.getTime())) {
        var m = rowDate.getMonth() + 1;
        var y = rowDate.getFullYear();
        if (m === targetMonth && y === targetYear) {
          var emailRow = String(rows[r][1]).trim().toLowerCase();
          if (recapMap[emailRow]) {
            recapMap[emailRow][keyName]++;
          }
        }
      }
    }
  }

  processOtherSheet('Pulang', 'pulang');
  processOtherSheet('Dinas Luar', 'dinasLuar');
  processOtherSheet('Izin', 'izin');
  
  var monthNames = ["", "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  var sheetTitle = "Rekap " + monthNames[targetMonth] + " " + targetYear;
  
  var recapSheet = ss.getSheetByName(sheetTitle);
  if (recapSheet) {
    recapSheet.clear();
  } else {
    recapSheet = ss.insertSheet(sheetTitle);
  }
  
  recapSheet.appendRow(["REKAPITULASI KEHADIRAN & KETERLAMBATAN PEGAWAI UPT PUSKESMAS KOKAP II"]);
  recapSheet.appendRow(["Periode: " + monthNames[targetMonth] + " " + targetYear]);
  recapSheet.appendRow([]);
  
  var headers = ["No", "Email", "Nama Lengkap", "Jabatan", "Hadir (Masuk)", "Total Terlambat (Menit)", "Pulang", "Dinas Luar", "Izin / Sakit", "Total Aktivitas"];
  recapSheet.appendRow(headers);
  
  recapSheet.getRange(4, 1, 1, headers.length).setBackground("#1E3A8A").setFontColor("#FFFFFF").setFontWeight("bold");
  
  var rowIdx = 5;
  var no = 1;
  for (var key in recapMap) {
    var p = recapMap[key];
    var totalAktivitas = p.hadir + p.pulang + p.dinasLuar + p.izin;
    recapSheet.appendRow([no++, p.email, p.nama, p.jabatan, p.hadir, p.totalTerlambatMenit, p.pulang, p.dinasLunar, p.izin, totalAktivitas]);
    rowIdx++;
  }
  
  recapSheet.autoResizeColumns(1, headers.length);
  
  return { 
    success: true, 
    message: "Rekap bulanan dan rekap keterlambatan berhasil dibuat di tab sheet: '" + sheetTitle + "'." 
  };
}
