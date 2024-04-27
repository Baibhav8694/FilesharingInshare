const dropZone = document.querySelector(".drop-zone");
const browseBtn = document.querySelector(".browseBtn");
const fileInput = document.querySelector("#fileinput");
const bgProgress = document.querySelector(".bg-progress");

const  percentDiv = document.querySelector("#percent");
const progressBar = document.querySelector(".progress-bar");
const progressContainer = document.querySelector(".progress-container");

const toast = document.querySelector(".toast");
const sharingContainer = document.querySelector(".sharing-container");
const fileURLInput = document.querySelector("#fileURL");
const copyBtn = document.querySelector("#copyBtn");

const emailForm = document.querySelector("#emailForm");
const host = "http://localhost:3000/";
const uploadURL = `${host}api/files`;
const emailURL =  `${host}api/files/send`;

const maxAllowedSize = 100 * 1024 * 1024;

dropZone.addEventListener("dragover", (e)=>{
    e.preventDefault();
    if(!dropZone.classList.contains("dragged")){
        dropZone.classList.add("dragged");
    }
});

dropZone.addEventListener("dragleave", ()=>{
    dropZone.classList.remove("dragged");
});

dropZone.addEventListener("drop", (e)=>{
    e.preventDefault();
    dropZone.classList.remove("dragged");
    const files = e.dataTransfer.files;
    console.log(files);
    if(files.length){
        fileInput.files = files;
        uploadFile();
    }
});

fileInput.addEventListener("change", ()=>{
    uploadFile();
})

browseBtn.addEventListener("click", ()=>{
    fileInput.click();
});

copyBtn.addEventListener("click", ()=>{
    fileURLInput.select();
    document.execCommand("copy");
    showToast("Link Copied!")
})

const uploadFile = ()=>{
    console.log("file added uploading");

  file = fileInput.files[0];
  const formData = new FormData();
  formData.append("file",file);

  //show the uploader
  progressContainer.style.display = "block";

  // upload file
  const xhr = new XMLHttpRequest();

  // listen for upload progress
  xhr.upload.onprogress = function (event) {
    // find the percentage of uploaded
    let percent = Math.round((100 * event.loaded) / event.total);
    progressPercent.innerText = percent;
    const scaleX = `scaleX(${percent / 100})`;
    bgProgress.style.transform = scaleX;
    progressBar.style.transform = scaleX;
  };

  // handle error
  xhr.upload.onerror = function () {
    showToast(`Error in upload: ${xhr.status}.`);
     // reset the input
    resetFileInput();
  };

  // listen for response which will give the link
  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
        console.log(xhr.response);
      onUploadSuccess(JSON.parse(xhr.response));
    }
  };

  xhr.open("POST", uploadURL);
  xhr.send(formData);
};

const updateProgress =(e)=>{
    const percent = Math.round((e.loaded)/(e.total)) * 100;
    bgProgress.style.width = `${percent}%`;
    percentDiv.innerText = percent;
    progressBar.style.transform = `scaleX(${percent/100})`;
}

const onUploadSuccess = ({file})=>{
    console.log(file);
    resetFileInput()
    emailForm[2].removeAttribute("disabled");
    progressContainer.style.display = 'none';
    sharingContainer.style.display = 'block';
    fileURLInput.value = file;

}

const resetFileInput = ()=>{
    fileInput.value = "";
}

emailForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    // console.log("Submit form clicked");
    const url = fileURLInput.value;
    const formData = {
        uuid: url.split("/").splice(-1, 1)[0],
        emailTo: emailForm.elements["to-email"].value,
        emailFrom: emailForm.elements["from-email"].value,
    };
    console.table(formData);

    emailForm[2].setAttribute("disabled", "true");
    fetch(emailURL, {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
    })
    .then((res)=> res.json())
    .then((data) =>{
        if(data.success){
            sharingContainer.style.display = "none";
            showToast("Email sent successfully!");
        }
    });
});

let toastTimer;
const showToast = (mssg)=>{
    toast.innerText = mssg;
    toast.style.transform = "translate(-60%, 0)";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(()=>{
        toast.style.transform = "translate(-60%, 60px)";
    }, 2000);
}



 