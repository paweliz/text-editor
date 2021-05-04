const editor = document.querySelector(".text-area");
const boldBtn = document.querySelector('[title="Bold"]');
const italicBtn = document.querySelector('[title="Italics"]');
const ulBtn = document.querySelector('[title="Unordered List"]');
const exportBtn = document.getElementById("export-btn");
const importBtn = document.getElementById("import-btn");

boldBtn.addEventListener("click", () => {
  formatText("bold");
});

italicBtn.addEventListener("click", () => {
  formatText("italic");
});

ulBtn.addEventListener("click", () => {
  formatText("insertunorderedlist");
});

const formatText = (cmdName) => {
  document.execCommand(cmdName, false, null);
};

const downloadToFile = (content, filename, contentType) => {
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType });

  a.href = URL.createObjectURL(file);
  a.download = filename;
  a.click();

  URL.revokeObjectURL(a.href);
};

const handleUploadFile = () => {
  const selectedFiles = document.getElementById("file").files;

  if (selectedFiles.length <= 0) {
    return false;
  }

  const fr = new FileReader();

  fr.onload = function (e) {
    //console.log(e);
    const jsonObj = JSON.parse(e.target.result);
    const importedText = jsonObj.text;
    editor.innerHTML = importedText;
  };

  fr.readAsText(selectedFiles.item(0));
  /* *** Security Issue *** 
  There is probable security issue, due to the lack of sanitazation JSON file before loading through innerHTML. 
  1) That is client-only app, so only possibility to get hacked is just by yourself or by sending JSON with script to someone and that person will load it.
  2) To sanitaze, I will use package like https://github.com/cure53/DOMPurifyinstead of writing all by myself.*/
};

exportBtn.addEventListener("click", () => {
  const savedText = {
    text: editor.innerHTML
  };
  const data = JSON.stringify(savedText);
  console.log(data);
  downloadToFile(data, "saved-text.JSON", "application/json");
});

importBtn.addEventListener("click", () => {
  handleUploadFile();
});
