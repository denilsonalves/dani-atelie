const Mask = {
  apply(input, func) {
    setTimeout(function() {
      input.value = Mask[func](input.value);
    }, 1);
  },
  formatBRL(value) {
    value = value.replace(/\D/g, "");
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value / 100);
  }
};

// Função de máscara de valores monetários (antigo)
// const input = document.querySelector('input[name="price"]');
// input.addEventListener("keydown", function(e) {
//   setTimeout(function() {
//     let { value } = e.target;
//     value = value.replace(/\D/g, "");
//     value = new Intl.NumberFormat("pt-BR", {
//       style: "currency",
//       currency: "BRL"
//     }).format(value / 100);

//     e.target.value = value;
//   }, 1);
// });

// JS RESPONSÁVEL PELO ENVIO DAS FOTOS
const PhotosUpload = {
  input: "",
  preview: document.querySelector("#photos-preview"),
  uploadLimit: 6,
  files: [],

  handleFileInput(event) {
    const { files: filesList } = event.target;
    PhotosUpload.input = event.target;

    if (PhotosUpload.hasLimit(event)) {
      return;
    }
    // tranformando o fileList no array
    Array.from(filesList).forEach(file => {
      PhotosUpload.files.push(file);

      const reader = new FileReader();

      reader.onload = () => {
        const image = new Image(); // criando um <img /> do html
        image.src = String(reader.result);

        const container = PhotosUpload.getContainer(image);

        PhotosUpload.preview.appendChild(container);
      };
      reader.readAsDataURL(file);
    });

    PhotosUpload.input.files = PhotosUpload.getAllFiles();
  },

  getAllFiles() {
    // ClipboardEvent("").clipboardData => para usar no firefox
    // DataTransfer() => para usar no chrome
    const dataTrans = new ClipboardEvent("").clipboardData || DataTransfer();

    PhotosUpload.files.forEach(file => {
      dataTrans.items.add(file);
    });

    return dataTrans.files;
  },

  getContainer(image) {
    const container = document.createElement("div");
    container.classList.add("photo");

    container.onclick = PhotosUpload.removePhoto;

    container.appendChild(image);
    container.appendChild(PhotosUpload.getRemoveButton());

    return container;
  },

  hasLimit(event) {
    const { uploadLimit, input, preview } = PhotosUpload;
    const { files: fileList } = input;

    if (fileList.length > uploadLimit) {
      alert(`Envie no máximo ${uploadLimit} fotos`);
      event.preventDefault();
      return true;
    }

    const photosDiv = [];
    preview.childNodes.forEach(item => {
      if (item.classList && item.classList.value == "photo") {
        photosDiv.push(item);
      }
    });

    const totalphotos = fileList.length + photosDiv.length;
    if (totalphotos > uploadLimit) {
      alert("Você deve escolher no máximo 6 fotos");
      event.preventDefault;
      return true;
    }

    return false;
  },

  getRemoveButton() {
    const button = document.createElement("i");
    button.classList.add("material-icons");
    button.innerHTML = "close";
    return button;
  },

  removePhoto(event) {
    // pega a tag <div class="photo"> a partir da tag <i>
    const photoDiv = event.target.parentNode;
    const photosArray = Array.from(PhotosUpload.preview.children);
    const index = photosArray.indexOf(photoDiv);

    // splice => recebe o index e remover o elemento da lista
    PhotosUpload.files.splice(index, 1);

    // atualiza a lista files
    PhotosUpload.input.files = PhotosUpload.getAllFiles();

    photoDiv.remove();
  },

  removeOldPhoto(event) {
    const photoDiv = event.target.parentNode;
    // procura o id da foto
    if (photoDiv.id) {
      // recebo o input da foto selecionada
      const removedFiles = document.querySelector(
        'input[name = "removed_files"]'
      );
      // concatena os ids das fotos removidas
      if (removedFiles) {
        removedFiles.value += `${photoDiv.id},`;
      }
    }
    // remove a Div da foto selecionada
    photoDiv.remove();
  }
};
