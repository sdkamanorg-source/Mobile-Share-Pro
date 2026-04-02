// 🔥 CLOUDINARY CONFIG
const CLOUD_NAME = "dwyjbotvs";
const UPLOAD_PRESET = "mobile_upload"; // ⚠️ apna preset name daalo

// LOADING
setTimeout(()=>{
  document.getElementById("loader").style.display="none";
  document.getElementById("app").style.display="block";
},2000);

// SOUND
function playSound(){
  const sound = document.getElementById("clickSound");
  if(sound) sound.play().catch(()=>{});
}

// UPLOAD (CLOUDINARY)
window.uploadFile = async function(){

  playSound();

  const file = document.getElementById("fileInput").files[0];
  if(!file){
    alert("Select file first!");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try{

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if(!data.secure_url){
      alert("Upload failed ❌");
      console.log(data);
      return;
    }

    const url = data.secure_url;

    // PROGRESS fake (instant fill)
    document.getElementById("progressBar").style.width = "100%";

    // QR generate
    document.getElementById("qrcode").innerHTML="";
    new QRCode(document.getElementById("qrcode"), url);

    alert("✅ QR Ready 🔥");

  }catch(e){
    console.log(e);
    alert("Upload error ❌");
  }
}

// SCANNER
window.startScanner = function(){

  playSound();

  const scanner = new Html5Qrcode("reader");

  scanner.start(
    { facingMode:"environment" },
    { fps:10, qrbox:250 },
    (decodedText)=>{
      window.open(decodedText, "_blank");
      scanner.stop();
    }
  );
}
