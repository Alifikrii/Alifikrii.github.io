// URL Google Spreadsheet yang dipublikasikan
const spreadsheetUrl1 = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT7fdqsP1LNEmU-fwGdVksN1DkbfiTFwT84VVRE-5c8WZz8rWRW7Ha0KDqx3KBzrfhq1oGajcChSnmb/pub?gid=1028783576&single=true&output=csv';

document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Mencegah form reload halaman

    const pnInput = document.getElementById('pn').value.trim();
    const loadingDiv = document.getElementById('loading');
    loadingDiv.style.display = 'block'; // Tampilkan animasi loading

    Promise.all([fetch(spreadsheetUrl1).then(response => response.text())])
        .then(([csvText1]) => {
            // Proses CSV dari spreadsheet
            const rows1 = csvText1.trim().split('\n').map(row => row.split(','));

            // Membersihkan nama kolom dari karakter spasi atau \r
            const headers = rows1[0].map(header => header.trim().replace(/\r/g, ''));

            const allRows = rows1.slice(1);

            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = ''; // Reset hasil sebelumnya

            if (allRows.length <= 0) {
                resultDiv.textContent = 'Tidak ada data dalam spreadsheet.';
                return;
            }

            // Cari data berdasarkan PN
            const matchingRow = allRows.find(row => row[headers.indexOf('PN')] === pnInput);

            if (matchingRow) {
                // Jika PN ditemukan, tampilkan hasil
                const resultTable = document.createElement('div');
                resultTable.className = 'card';

                // Nama Peserta
                const nameRow = document.createElement('h3');
                nameRow.textContent = `Nama: ${matchingRow[headers.indexOf('Nama')] || 'Nama Tidak Diketahui'}`;
                resultTable.appendChild(nameRow);

                // Jenjang, Tanggal Exp, Status
                const jenjangRow = document.createElement('p');
                jenjangRow.textContent = `Jenjang: ${matchingRow[headers.indexOf('Jenjang MR')] || 'Tidak Diketahui'}`;
                resultTable.appendChild(jenjangRow);

                const tanggalExpRow = document.createElement('p');
                tanggalExpRow.textContent = `Tanggal EXP: ${matchingRow[headers.indexOf('Tanggal EXP')]?.replace(/\r|\n/g, '') || 'Tidak Diketahui'}`;
                resultTable.appendChild(tanggalExpRow);

                const statusRow = document.createElement('p');
                statusRow.textContent = `Status: ${matchingRow[headers.indexOf('Status')] || 'Tidak Diketahui'}`;
                resultTable.appendChild(statusRow);

                // Divider
                const divider = document.createElement('div');
                divider.className = 'divider';
                resultTable.appendChild(divider);

                // Rencana Tindak Lanjut, Tanggal Pembekalan, Tanggal Help Session, Tanggal Ujian
                const rencanaRow = document.createElement('p');
                rencanaRow.classList.add('rencana'); // Menambahkan kelas untuk membuat bold
                rencanaRow.textContent = `Rencana Tindak Lanjut: ${matchingRow[headers.indexOf('Rencana Tindak Lanjut')]?.replace(/\r|\n/g, '') || 'Tidak Ada'}`;
                resultTable.appendChild(rencanaRow);

                const tanggalPembekalanRow = document.createElement('p');
                tanggalPembekalanRow.textContent = `Tanggal Pembekalan: ${matchingRow[headers.indexOf('Tanggal Pembekalan')]?.replace(/\r|\n/g, '') || 'Tidak Diketahui'}`;
                resultTable.appendChild(tanggalPembekalanRow);

                const tanggalHelpSessionRow = document.createElement('p');
                tanggalHelpSessionRow.textContent = `Tanggal Help Session: ${matchingRow[headers.indexOf('Tanggal Help Session')]?.replace(/\r|\n/g, '') || 'Tidak Diketahui'}`;
                resultTable.appendChild(tanggalHelpSessionRow);
                
                const tanggalUjianIndex = headers.indexOf('Tanggal Uji'); // Ambil index kolom tanggal ujian
                
                const tanggalUjian = matchingRow[tanggalUjianIndex]; // Ambil data berdasarkan kolom
                           
                const tanggalUjianRow = document.createElement('p');
                tanggalUjianRow.textContent = `Tanggal Ujian: ${tanggalUjian?.trim().replace(/\r|\n/g, '') || 'Tidak Diketahui'}`;
                resultTable.appendChild(tanggalUjianRow);

                resultDiv.appendChild(resultTable);
            } else {
                resultDiv.textContent = 'PN tidak ditemukan.';
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('result').textContent = 'Terjadi kesalahan saat mengambil data.';
        })
        .finally(() => {
            loadingDiv.style.display = 'none'; // Sembunyikan animasi loading setelah selesai
        });
});
