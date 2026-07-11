(() => {
  const receiverInput = document.getElementById('receiverInput');
  const playBtn = document.getElementById('playBtn');
  const resetBtn = document.getElementById('resetBtn');
  const copyBtn = document.getElementById('copyBtn');

  const screenCompose = document.getElementById('screenCompose');
  const screenResult = document.getElementById('screenResult');

  const receiverPreview = document.getElementById('previewReceiver');
  const subtitlePreview = document.getElementById('previewSubtitle');
  const miniBar = document.getElementById('miniBar');

  const finalReceiver = document.getElementById('finalReceiver');
  const finalSubtitle = document.getElementById('finalSubtitle');

  const senderName = document.getElementById('senderName');

  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toastText');

  let currentText = '';

  const fixedBirthdayText = `Hi kiddo.

Gak kerasa ya, sekarang umurmu udah 19 tahun. Tepat di hari ini, tanggal 12 Juli 19 tahun yang lalu, kau terlahir. Gak kerasa juga udah 19 tahun kau melangkah di dunia ini, ya.

Terimakasih karena 19 tahun yang lalu kau memilih untuk terlahir ke dunia ini. Aku tau, pasti selama 19 tahun ini banyak hal yang sudah kau lewati, entah itu senang maupun sedih, tapi aku benar-benar bersyukur karena kau ada di dunia ini, bersama ku dan yang lain.

Walaupun hubungan antara kita berawal dari keperluan lore, yang di mana engkau menjadi anak ku dan aku menjadi ayah mu, tapi di luar itu semua, aku benar-benar bangga karena kau bisa sampai sejauh ini. Aku juga senang karena kau bisa memanjangkan rambut mu dan mewarnai nya. Aku tau ini sedikit konyol dan keluar topik, tapi apa yang ingin ku katakan adalah bahwa aku bangga kepada mu.

Terimakasih telah terlahir di dunia ini, Happy Birthday to you.

From your Papa in Lore.`;

  function sanitizeName(v) {
    return (v || '').toString().trim().replace(/\s+/g, ' ');
  }

  function showToast(msg) {
    toastText.textContent = msg;
    toast.classList.add('show');
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => toast.classList.remove('show'), 1600);
  }

  function syncPreviewName() {
    const n = sanitizeName(receiverInput.value);
    receiverPreview.textContent = n ? n : 'Nama Penerima';
    finalReceiver.textContent = receiverPreview.textContent;
  }

  function updateMiniProgress(p) {
    const clamped = Math.max(0, Math.min(100, p));
    miniBar.style.width = clamped + '%';
  }

  function setComposeUI() {
    screenCompose.hidden = false;
    screenResult.hidden = true;
    updateMiniProgress(0);
    finalSubtitle.textContent = '(ucapan akan muncul di sini setelah selesai)';
    subtitlePreview.textContent = 'Isi nama penerima, lalu tekan Play → Finish.';
  }

  function setResultUI() {
    screenCompose.hidden = true;
    screenResult.hidden = false;
  }

  function buildCopyText() {
    const n = sanitizeName(receiverInput.value) || 'Nama Penerima';
    return `Selamat Ulang Tahun, ${n}!\n\n${currentText}\n\n— ${senderName.textContent || 'Phainon'}`;
  }

  function runFlowProperly() {
    const n = sanitizeName(receiverInput.value);
    const safeName = n ? n : 'Nama Penerima';

    receiverPreview.textContent = safeName;
    finalReceiver.textContent = safeName;

    currentText = fixedBirthdayText;

    // show compose with progress
    screenResult.hidden = true;
    screenCompose.hidden = false;

    updateMiniProgress(0);

    const steps = [10, 28, 47, 66, 82, 100];
    const labels = [
      'Memulai login... (misi dibuka)',
      'Mengumpulkan energi bintang...',
      'Menyusun pesan...',
      'Mengunci pesan ke kapsul...',
      'Menunggu sinyal...'
    ];

    subtitlePreview.textContent = 'Memulai...';

    let i = 0;
    const interval = setInterval(() => {
      const target = steps[i] ?? 100;
      updateMiniProgress(target);

      if (i < labels.length) subtitlePreview.textContent = labels[i];
      i++;

      if (target >= 100) {
        clearInterval(interval);
        finalSubtitle.textContent = currentText;
        setResultUI();
        showToast('Misi selesai!');
      }
    }, 520);
  }

  receiverInput.addEventListener('input', () => {
    syncPreviewName();
    if (!screenResult.hidden) {
      finalSubtitle.textContent = '(ucapan akan muncul di sini setelah selesai)';
      currentText = '';
    }
  });

  playBtn.addEventListener('click', runFlowProperly);

  resetBtn.addEventListener('click', () => {
    receiverInput.value = '';
    currentText = '';
    syncPreviewName();
    setComposeUI();
    showToast('Reset');
  });

  copyBtn.addEventListener('click', async () => {
    const text = buildCopyText();
    try {
      await navigator.clipboard.writeText(text);
      showToast('Tersalin!');
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      showToast('Tersalin!');
    }
  });

  syncPreviewName();
  setComposeUI();
})();

