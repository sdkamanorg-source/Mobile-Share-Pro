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

// UPLOAD
window.uploadFile = async function () {

  playSound();

  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if (!file) {
    alert("❗ Select file first!");
    return;
  }

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
      alert("❌ Upload failed");
      return;
    }

    const url = data.secure_url;

    // ✅ IMPORTANT DEBUG
    console.log("FINAL URL:", url);

    // Progress
    let progress = 0;
    const bar = document.getElementById("progressBar");
    const interval = setInterval(() => {
      progress += 10;
      if (bar) bar.style.width = progress + "%";
      if (progress >= 100) clearInterval(interval);
    }, 100);

    // Show link
    document.getElementById("fileUrl").innerHTML =
      `<a href="${url}" target="_blank">${url}</a>`;

    // QR
    new QRCode(document.getElementById("qrcode"), {
      text: url,
      width: 200,
      height: 200
    });

    alert("✅ QR Ready");

  } catch (e) {
    console.log("Upload error:", e);
    alert("❌ Upload error");
  }
};

// SCANNER (🔥 FINAL FIX)
window.startScanner = function () {

  playSound();

  const reader = document.getElementById("reader");
  reader.innerHTML = "";

  const scanner = new Html5Qrcode("reader");

  scanner.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },

    (decodedText) => {

      console.log("SCANNED:", decodedText);

      // ❗ STOP CAMERA FIRST
      scanner.stop();

      // ❗ VALIDATE LINK
      if (!decodedText.startsWith("http")) {
        alert("❌ Invalid QR (Not a link)");
        return;
      }

      // 🔥 TRY AUTO OPEN
      try {
        window.location.href = decodedText;
      } catch (e) {
        console.log("Redirect failed:", e);
      }

      // 🔥 ALWAYS SHOW BUTTON (backup)
      reader.innerHTML = `
        <div style="text-align:center;">
          <p>✅ Scan Successful</p>
          <p style="font-size:12px;word-break:break-all;">${decodedText}</p>
          <a href="${decodedText}" target="_blank">
            <button style="padding:12px 20px;font-size:16px;">
              Open File 🔗
            </button>
          </a>
        </div>
      `;
    },

    (err) => {
      console.log("Scan error:", err);
    }
  ).catch(err => {
    console.log("Camera error:", err);
    alert("❌ Camera blocked");
  });
};
