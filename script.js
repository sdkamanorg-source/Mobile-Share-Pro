// 🔥 CLOUDINARY CONFIG
const CLOUD_NAME = "dwyjbotvs";
const UPLOAD_PRESET = "mobile_upload";

// UPLOAD
window.uploadFile = async function () {

  const file = document.getElementById("fileInput").files[0];

  if (!file) {
    alert("Select file first");
    return;
  }

  // reset
  document.getElementById("qrcode").innerHTML = "";
  document.getElementById("fileUrl").innerText = "";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    console.log(data);

    // ❌ if upload fail
    if (!data.secure_url) {
      alert("Upload failed");
      return;
    }

    const url = data.secure_url.trim();

    // ✅ VERY IMPORTANT CHECK
    if (!url.startsWith("https://")) {
      alert("Invalid URL");
      return;
    }

    // ✅ SHOW LINK
    document.getElementById("fileUrl").innerHTML =
      `<a href="${url}" target="_blank">${url}</a>`;

    // ✅ QR FIX (MAIN FIX)
    const qrBox = document.getElementById("qrcode");
    qrBox.innerHTML = "";

    new QRCode(qrBox, url); // 👈 SIMPLE & STABLE

    console.log("QR DATA:", url);

    alert("QR Ready");

  } catch (err) {
    console.log(err);
    alert("Upload error");
  }
};


// SCANNER (SIMPLE + WORKING)
window.startScanner = function () {

  const scanner = new Html5Qrcode("reader");

  scanner.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },

    (text) => {

      console.log("SCANNED:", text);
      alert(text);

      scanner.stop();

      // ✅ FORCE OPEN
      window.location.href = text;
    },

    (err) => {}
  );
};
