const CLOUD_NAME = "dwyjbotvs";
const UPLOAD_PRESET = "mobile_upload";

let sending = false;
let receiving = false;

// LOADER
window.onload = () => {
  document.getElementById("loader").style.display = "none";
  document.getElementById("app").style.display = "block";
};

// SOUND
function playSound() {
  const s = document.getElementById("clickSound");
  if (s) s.play().catch(()=>{});
}

// 🔥 SEND
window.uploadFile = function () {

  if (receiving) {
    alert("❌ Stop receiving first");
    return;
  }

  if (sending) {
    alert("⏳ Wait before sending again");
    return;
  }

  const file = document.getElementById("fileInput").files[0];
  if (!file) return alert("Select file");

  playSound();

  sending = true;

  const bar = document.getElementById("progressBar");
  const qrBox = document.getElementById("qrcode");

  bar.style.width = "0%";
  qrBox.innerHTML = "";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const xhr = new XMLHttpRequest();

  xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`);

  xhr.upload.onprogress = (e) => {
    let p = (e.loaded / e.total) * 100;
    bar.style.width = p + "%";
  };

  xhr.onload = () => {
    const data = JSON.parse(xhr.responseText);

    if (!data.secure_url) {
      alert("Upload failed");
      sending = false;
      return;
    }

    new QRCode(qrBox, data.secure_url);

    // QR expire
    setTimeout(() => {
      qrBox.innerHTML = "";
    }, 60000);

    // cooldown
    setTimeout(() => sending = false, 15000);
  };

  xhr.send(formData);
};

// 🔥 RECEIVE (IN-APP SCANNER)
window.startScanner = function () {

  if (sending) {
    alert("❌ Sending in progress");
    return;
  }

  if (receiving) {
    alert("Already scanning...");
    return;
  }

  playSound();

  receiving = true;

  const scanner = new Html5Qrcode("reader");

  scanner.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },

    (text) => {
      scanner.stop();
      receiving = false;

      window.location.href = text;
    },

    (err) => {}
  ).catch(() => {
    receiving = false;
    alert("Camera error");
  });
};
