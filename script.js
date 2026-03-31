import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } 
from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js";

// 🔥 PASTE YOUR FIREBASE CONFIG HERE
const firebaseConfig = {
  apiKey: "PASTE",
  authDomain: "PASTE",
  projectId: "PASTE",
  storageBucket: "PASTE",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// LOADING
setTimeout(()=>{
  document.getElementById("loader").style.display="none";
  document.getElementById("app").style.display="block";
},2000);

// SOUND
function playSound(){
  document.getElementById("clickSound").play();
}

// UPLOAD
window.uploadFile = function(){

  playSound();

  const file = document.getElementById("fileInput").files[0];
  if(!file) return alert("Select file");

  const storageRef = ref(storage, "files/" + Date.now() + file.name);
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on("state_changed",
    (snapshot)=>{
      let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      document.getElementById("progressBar").style.width = progress + "%";
    },
    (error)=>{
      alert("Upload Error");
    },
    async ()=>{
      const url = await getDownloadURL(uploadTask.snapshot.ref);

      document.getElementById("qrcode").innerHTML="";
      new QRCode(document.getElementById("qrcode"), url);

      alert("QR Ready 🔥");

      // AUTO DELETE (10 sec)
      setTimeout(async ()=>{
        await deleteObject(uploadTask.snapshot.ref);
        alert("File expired ❌");
      },10000);
    }
  );
}

// SCANNER
window.startScanner = function(){
  playSound();

  const scanner = new Html5Qrcode("reader");

  scanner.start(
    { facingMode:"environment" },
    { fps:10, qrbox:250 },
    (decodedText)=>{
      window.open(decodedText);
    }
  );
}
