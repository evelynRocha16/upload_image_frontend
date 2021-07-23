var dimensao = '';

var arquivo;

const _URL = window.URL || window.webkitURL;

console.log(currentLocation);
var myForm = document.querySelector('#formUpload');

myForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    let input = document.querySelector('#nameInput').value;
    
    let formData = new FormData();

    if(input !== '' && (arquivo !== '' || arquivo !== undefined)) {
            
            formData.append('file', arquivo);
            formData.append('name', input);

            $.ajax({
                enctype: 'multipart/form-data',
                url: "http://localhost:3000/api/upload",
                data: formData,
                type: 'post',
                processData: false,
                contentType: false,
                success: (result) => {
                  $( "footer" ).html(result);
                  clearForm();
                }
              });

        
    } else {
        $( "footer" ).html('Não foi possível fazer o upload.');
        setTimeout(() => {
            $( "footer" ).html('');
        }, 1000);
        
    }
});


loadImage = (img, src) => {
    return new Promise((resolve, reject) => {
        img.src = src;
        img.completed ? resolve(img) : img.addEventListener('load', function () {
            resolve(img)
        });
        img.addEventListener('error', reject);
    })
}

clearForm = () => {
    setTimeout(() => {
        document.querySelector('#nameInput').value = '';
        document.querySelector('#fileInput').value = '';
        $('#labelFile').html('Selecione um arquivo');
        $( "footer" ).html('');
    }, 1000);
}

resizeImage = (src, options) => {

    return loadImage(document.createElement('img'), src).then(function (image) {

        var canvas = document.createElement('canvas');

        if (options.width && !options.height) {
            options.height = image.height * (options.width / image.width)
        } else if (!options.width && options.height) {
            options.width = image.width * (options.height / image.height)
        }

        Object.assign(canvas, options);

        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);

        return new Promise(function (resolve) {
            canvas.toBlob(resolve, options.type || options.type, options.quality)
        })
    })
}



$("#fileInput").change(function (e) {
    let file, src;
    if ((file = this.files[0])) {
        src = _URL.createObjectURL(file);
    
        let img = document.querySelector("#original");
        img.src = src;

        img.onload = function () {
            dimensao = `${this.width}x${this.height}`;
            $( "#labelFile" ).html(file.name);

            if(dimensao !== '1280x576') {
                resizeImage(src, {width: 1280, type: file.type}).then(function (blob) {
                    arquivo = blobToFile(blob, file.name);
                 });
            } else {
                arquivo = file;
            }
            
        };
        
    }
});

blobToFile = (theBlob, fileName) => {       
    return new File([theBlob], fileName, { lastModified: new Date().getTime(), type: theBlob.type })
}