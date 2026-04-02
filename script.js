const CLOUD_NAME = "dwyjbotvs";
const UPLOAD_PRESET = "mobile_upload";

let sendLock = false;
let scanLock = false;

// LOADER
window.onload = () => {
  document.getElementById("loader").style.display = "none";
  document.getElementById("app").style.display = "block";
};

// SOUND
function playSound() {
  const s = document.getElementById("clickSound");
  if (s) s.play().catch(() => {});
}

// 🔥 UPLOAD WITH REAL PROGRESS
window.uploadFile = async function () {

  if (sendLock) {
    alert("⏳ Wait 15 sec before next send");
    return;
  }

  playSound();

  const file = document.getElementById("fileInput").files[0];
  if (!file) return alert("Select file");

  const bar = document.getElementById("progressBar");
  const qrBox = document.getElementById("qrcode");

  bar.style.width = "0%";
  qrBox.innerHTML = "";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {

    const xhr = new XMLHttpRequest();

    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`);

    // 🔥 REAL PROGRESS
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        let percent = (e.loaded / e.total) * 100;
        bar.style.width = percent + "%";
      }
    };

    xhr.onload = () => {
      const data = JSON.parse(xhr.responseText);

      if (!data.secure_url) {
        alert("Upload failed");
        return;
      }

      const url = data.secure_url;

      // QR
      new QRCode(qrBox, url);

      alert("✅ QR Ready");

      // 🔥 QR AUTO DELETE 1 MIN
      setTimeout(() => {
        qrBox.innerHTML = "";
        alert("QR expired ⏳");
      }, 60000);

      // 🔥 SEND LOCK 15s
      sendLock = true;
      setTimeout(() => sendLock = false, 15000);
    };

    xhr.send(formData);

  } catch (e) {
    alert("Upload error");
  }
};

// 🔥 GOOGLE SCAN OPEN
window.startScanner = function () {

  if (scanLock) {
    alert("⏳ Wait 5 sec");
    return;
  }

  playSound();

  // 🔥 OPEN GOOGLE LENS
  window.location.href = "https://lens.google.com/";

  scanLock = true;
  setTimeout(() => scanLock = false, 5000);
};
