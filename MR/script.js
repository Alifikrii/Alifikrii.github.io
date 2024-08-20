// URL Google Spreadsheet yang dipublikasikan
const spreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1gEN-UcYcUYJHFikXIsj144jf_FffxjGv_jl2o56UpUQ/pub?gid=429525846&single=true&output=csv';

document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Mencegah form dari reload halaman

    const pnInput = document.getElementById('pn').value.trim();
    const dobInput = document.getElementById('dob').value.trim(); // Input pengguna, format DDMMYY (contoh: 301201)

    // Fungsi untuk mengubah tanggal dari DD/MM/YYYY ke DDMMYY
    function formatDateToSixDigits(dateStr) {
        if (!dateStr || typeof dateStr !== 'string') return '';
        const parts = dateStr.split('/');
        if (parts.length !== 3) return ''; // Pastikan formatnya benar
        const [day, month, year] = parts;
        const shortYear = year.slice(-2); // Ambil 2 digit terakhir tahun
        return `${day.padStart(2, '0')}${month.padStart(2, '0')}${shortYear}`; // Format DDMMYY
    }

    fetch(spreadsheetUrl)
        .then(response => response.text())
        .then(csvText => {
            const rows = csvText.trim().split('\n').map(row => row.split(','));
            const headers = rows[0] || [];
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = '';

            console.log('Headers:', headers); // Log nama-nama kolom
            // console.log('Data Rows:', rows); // Log semua baris data

            if (rows.length <= 1) {
                resultDiv.textContent = 'Tidak ada data dalam spreadsheet.';
                return;
            }

            // Cari data berdasarkan PN terlebih dahulu
            const matchingRow = rows.find(row => row[headers.indexOf('PN')] === pnInput);

            if (matchingRow) {
                // Jika PN ditemukan, cek apakah TTL sesuai
                const ttlIndex = headers.indexOf('Kunci\r');
                const rowDate = matchingRow[ttlIndex].trim();

                console.log('Formatted DOB Input:', dobInput);
                console.log('Row Date:', rowDate); // Log tanggal dari baris
                console.log(rowDate === dobInput);

                if (rowDate === dobInput) {
                    //  Jika TTL sesuai, tampilkan hasil
                    const resultTable = document.createElement('table');
                    resultTable.border = '1';

                    const nameRow = document.createElement('tr');
                    const nameHeader = document.createElement('td');
                    nameHeader.className = 'header-cell';
                    nameHeader.textContent = 'Nama Peserta';
                    const nameData = document.createElement('td');
                    nameData.textContent = matchingRow[headers.indexOf('Nama')] || 'Nama Tidak Diketahui';
                    nameRow.appendChild(nameHeader);
                    nameRow.appendChild(nameData);
                    resultTable.appendChild(nameRow);

                    const relevantHeaders = ['KTP', 'CV', 'SK JABATAN', 'PAS FOTO', 'DUJ', 'Struktur Organisasi', 'APL 01', 'APL 02', 'Portofolio', 'Sertifikat MR', 'Sertifikat Refreshment'];
                    const namaPeserta =['NAMA']

                    // Buat baris untuk setiap header dan value
                    relevantHeaders.forEach(header => {
                        const tr = document.createElement('tr');

                        // Buat cell untuk header
                        const tdHeader = document.createElement('td');
                        tdHeader.textContent = header;
                        tdHeader.className = 'header-cell';
                        tr.appendChild(tdHeader);

                        // Buat cell untuk value
                        const tdValue = document.createElement('td');
                        const valueIndex = headers.indexOf(header);
                        const value = matchingRow[valueIndex] || ''; // Default to empty string if undefined
                        
                        if (value) {
                            const link = document.createElement('a');
                            link.href = value;
                            link.textContent = 'Lihat';
                            link.target = '_blank'; // Buka di tab baru
                            tdValue.appendChild(link);
                        } else {
                            tdValue.textContent = 'Data not available';
                        }
                        tr.appendChild(tdValue);

                        resultTable.appendChild(tr);
                    });

                    resultDiv.appendChild(resultTable);
                } else {
                    resultDiv.textContent = 'Tanggal Lahir tidak sesuai.';
                }
            } else {
                resultDiv.textContent = 'PN tidak ditemukan.';
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('result').textContent = 'Terjadi kesalahan saat mengambil data.';
        });
});
