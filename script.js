// 🔥 CLOUDINARY CONFIG
const CLOUD_NAME = "dwyjbotvs";
const UPLOAD_PRESET = "mobile_upload";

// LOADING
setTimeout(() => {
  document.getElementById("loader").style.display = "none";
  document.getElementById("app").style.display = "block";
}, 2000);

// SOUND
function playSound() {
  const sound = document.getElementById("clickSound");
  if (sound) sound.play().catch(() => {});
}

// UPLOAD (CLOUDINARY)
window.uploadFile = async function () {

  playSound();

  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if (!file) {
    alert("❗ Select file first!");
    return;
  }

  // Reset UI
  document.getElementById("progressBar").style.width = "0%";
  document.getElementById("qrcode").innerHTML = "";
const formData = new FormData();
formData.append("file", file);
formData.append("upload_preset", UPLOAD_PRESET);

try {

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  console.log("Cloudinary response:", data);

    if (!res.ok || !data.secure_url) {
      alert("❌ Upload failed (Check console)");
      return;
    }

    const url = data.secure_url;

    // PROGRESS ANIMATION
    let progress = 0;
    const bar = document.getElementById("progressBar");

    const interval = setInterval(() => {
      progress += 10;
      if (bar) bar.style.width = progress + "%";
      if (progress >= 100) clearInterval(interval);
    }, 100);

    // SHOW FILE LINK
    const fileUrl = document.getElementById("fileUrl");
    if (fileUrl) {
      fileUrl.innerHTML = `<a href="${url}" target="_blank">${url}</a>`;
    }

    // QR GENERATE
    new QRCode(document.getElementById("qrcode"), {
      text: url,
      width: 200,
      height: 200
    });

    alert("✅ Upload + QR Ready 🔥");

  } catch (e) {
    console.log("Upload error:", e);
    alert("❌ Upload error (Network / CORS)");
  }
};

// SCANNER
window.startScanner = function () {

  playSound();

  const reader = document.getElementById("reader");
  reader.innerHTML = ""; // reset scanner

  const scanner = new Html5Qrcode("reader");

  scanner.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },

    (decodedText) => {
      playSound();
      window.open(decodedText, "_blank");
      scanner.stop();
    },

    (err) => {
      console.log("Scan error:", err);
    }
  ).catch(err => {
    console.log("Camera start error:", err);
    alert("❌ Camera access denied");
  });
};
