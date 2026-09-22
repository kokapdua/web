function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
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
    recapSheet.appendRow([no++, p.email, p.nama, p.jabatan, p.hadir, p.totalTerlambatMenit, p.pulang, p.dinasLuar, p.izin, totalAktivitas]);
    rowIdx++;
  }
  
  recapSheet.autoResizeColumns(1, headers.length);
  
  return { 
    success: true, 
    message: "Rekap bulanan dan rekap keterlambatan berhasil dibuat di tab sheet: '" + sheetTitle + "'." 
  };
}
