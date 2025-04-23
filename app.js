//Informacion Cancion
const tituloCancion = document.querySelector('.reproductor-musica h3');
const nombreArtista = document.querySelector('.reproductor-musica p');
//Progreso Cancion
const progreso = document.getElementById('progreso');
const cancion = document.getElementById('cancion');
const iconoControl = document.getElementById('iconoControl')
const botonReproducirPausar = document.querySelector('.controles button.boton-reproducir-pausar');
//botones Reproductor
const botonAtras = document.querySelector('.controles button.atras');
const botonAdelante= document.querySelector('.controles button.adelante');
const botonAleatorio= document.querySelector('.controles button.aleatorio');
const botonRepetir= document.querySelector('.controles button.repetir');
//Volumen
const volumenGuardado = localStorage.getItem('volumen');
const sliderVolumen = document.getElementById('sliderVolumen');
//Tiempo de Cancion
const tiempoActual = document.getElementById('tiempoActual');
const duracionTotal = document.getElementById('duracionTotal');
//Seleccion de Canciones
const playlistContainer = document.getElementById('playlist-container');

document.getElementById('musica-input').addEventListener('change', function(e){
    const files = Array.from(e.target.files);
    files.forEach(file => {
        const url = URL.createObjectURL(file);
        const nombreArchivo = file.name.replace(/\.[^/.]+$/, "");

        canciones.push({
            titulo: nombreArchivo,
            nombre: 'Local file',
            fuente: url
        })
    })
    actualizarPlaylist();
    if(canciones.length === files.length){
        actualizarInfoCancion();
    }
})

function actualizarPlaylist(){
    playlistContainer.innerHTML = '';
    canciones.forEach((cancionItem, index)=>{
        const li = document.createElement('li')
        li.textContent = `${cancionItem.titulo} - ${cancionItem.nombre}`

        li.onclick = () => {
            indiceCancionActual = index;
            actualizarInfoCancion();
            reproducirCancion()
        }

        if(index === indiceCancionActual){
            li.classList.add('active')
        }


        playlistContainer.appendChild(li)
    })
}


const canciones = [
]

let indiceCancionActual = 0;

let modoAleatorio = false;
let modoRepetir = false;


function actualizarInfoCancion(){
    tituloCancion.textContent = canciones[indiceCancionActual].titulo;
    nombreArtista.textContent = canciones[indiceCancionActual].nombre;
    cancion.src = canciones[indiceCancionActual].fuente;
    cancion.loop = modoRepetir;
    actualizarPlaylist();
}

cancion.addEventListener('loadedmetadata', function(){
    progreso.max = cancion.duration;
    progreso.value = cancion.currentTime;
})

botonReproducirPausar.addEventListener('click', reproducirPausar);

function reproducirPausar(){
    if(cancion.paused){
        reproducirCancion();

    }else{
        pausarCancion();

    }
    
}
function reproducirCancion(){
    cancion.play();
    iconoControl.classList.add('bi-pause-fill')
    iconoControl.classList.remove('bi-play-fill')
}

function pausarCancion(){
    cancion.pause();
    iconoControl.classList.remove('bi-pause-fill')
    iconoControl.classList.add('bi-play-fill')
}

cancion.addEventListener('timeupdate', function(){
    if(!cancion.paused){
        progreso.value = cancion.currentTime;
    }
})

progreso.addEventListener('input', function(){
    cancion.currentTime = progreso.value;
})

botonAdelante.addEventListener('click', function(){
   if(modoRepetir){
    cancion.currentTime = 0;
    reproducirCancion();
    return
   }

    if (modoAleatorio){
        indiceCancionActual = obtenerIndiceAleatorio()
    }else{
        indiceCancionActual = (indiceCancionActual + 1) % canciones.length;
    }
    actualizarInfoCancion();
    reproducirCancion();
})

botonAtras.addEventListener('click', function(){
    if(modoRepetir){
        cancion.currentTime = 0;
        reproducirCancion();
        return
       }
    if (modoAleatorio){
        indiceCancionActual = obtenerIndiceAleatorio()
    }else{
        indiceCancionActual = (indiceCancionActual - 1) % canciones.length;
    }
    actualizarInfoCancion();
    reproducirCancion();
})

botonAleatorio.addEventListener('click', function(){
    if(modoAleatorio){
        modoAleatorio = false;
    }else{
        modoAleatorio = true;
        modoRepetir = false;
        botonRepetir.classList.remove('active')
    }
    botonAleatorio.classList.toggle('active')
    cancion.loop = modoRepetir;
})

function obtenerIndiceAleatorio(){
    let nuevoIndice;
    do{
        nuevoIndice = Math.floor(Math.random()*canciones.length)
    }while(nuevoIndice === indiceCancionActual && canciones.length>1)
        return nuevoIndice
}

cancion.addEventListener('ended', function(){
    if(modoRepetir){
        cancion.currentTime = 0;
        reproducirCancion();
        return;
    }
    if(modoAleatorio){
        indiceCancionActual = obtenerIndiceAleatorio()
    }else{
        indiceCancionActual = (indiceCancionActual + 1)% canciones.length
    }

    actualizarInfoCancion()
    reproducirCancion()
})

botonRepetir.addEventListener('click', function(){
    if(modoRepetir){
        modoRepetir = false;
    }else{
        modoRepetir = true;
        modoAleatorio = false;
        botonAleatorio.classList.remove('active')
    }
    botonRepetir.classList.toggle('active')
    cancion.loop = modoRepetir;
})

function cambiarVolumen(nivel) {
    if (nivel >= 0 && nivel <= 1) {
        cancion.volume = nivel;
    }
}

if (volumenGuardado !== null) {
    cancion.volume = parseFloat(volumenGuardado);
    sliderVolumen.value = volumenGuardado;
}

sliderVolumen.addEventListener('input', function () {
    cambiarVolumen(sliderVolumen.value);
    localStorage.setItem('volumen', sliderVolumen.value);
});

function formatearTiempo(segundos) {
    const min = Math.floor(segundos / 60);
    const seg = Math.floor(segundos % 60);
    return `${min}:${seg.toString().padStart(2, '0')}`;
}

cancion.addEventListener('loadedmetadata', function () {
    duracionTotal.textContent = formatearTiempo(cancion.duration);
});

cancion.addEventListener('timeupdate', function () {
    tiempoActual.textContent = formatearTiempo(cancion.currentTime);
});

actualizarInfoCancion()