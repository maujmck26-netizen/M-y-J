// Base de datos local para alimentar dinámicamente los modales
const datosModales = {
    "1": { titulo: "Tus gustos...", texto: "Cada que conozco un poco mas de tus gustos me sigo asombrando de lo parecidos que somos y de lo compatibles que somos. Ademas sos muy inteligente y culta y no dejo de aprender cosas con vos, cada día es algo nuevo.", img: "./img/nota-1.gif" },
    "2": { titulo: "Tu ternura...", texto: "La forma en la que le das color a mis días con cada mensajito tuyo, y cuando me tratas de amor o mi niño... es como un abracito a mi corazon, el cual te eligiría en este y en cualquier universo, porque sos la niña a la que ama con todo de sí, y que daría lo que fuese por cuidar esa sonrrisa y ese brillo tan hermoso que tenes.", img: "./img/nota-2.gif" },
    "3": { titulo: "tu belleza...", texto: "Cualquier foto que veo tuya es la razon de la mejor sonrrisa de cada día. Sos una belelza total, ns si porque estoy enamorado de vos pero al menos para mí sos y siiempre serás la mina mas hermosa que existe. No es lo mas importante, desde luego, pero te voy a recordar lo bella que sos cada día, asi como vos me lo ecuerdas simplemente eligiendome cada dia.", img: "./img/nota-3.gif" },
    "4": { titulo: "Lo facil que haces todo...", texto: "Con vos todo es tan facil... sonrreir, bromear, pasarla bien, ser tierno, ser molestoso, aprender con tus datos curiosos... pensar a futuro, pensar en lo que queremos, pensar en lo que haremos cuando nos veamos... con vs es muy facil querer mirar hacia adelante porque me das la seguridad de que no encontraré una mina la mitad de buena que vos... porque nadie se compara a vos, sos perfecta asi como sos, y lo que mas amo de vos es todo lo que sos, cada cosa buena, cada cosa mala y cada cosa que capaz pensás q es rara pero solo me hacen enamorarme mas de vos.", img: "./img/j-1.jpg" }
};

// Captura de selectores HTML
const botonesIniciales = document.querySelectorAll('.btn-opcion');
const pantallaInicial = document.getElementById('pantalla-inicial');
const btnEscurridizo = document.getElementById('btn-escurridizo');
const modal = document.getElementById('mi-modal');
const tarjetas = document.querySelectorAll('.tarjeta');

// --- LÓGICA DEL BOTÓN ESCURRI DIZO (IZQUIERDA) ---
function moverBotónAleatorio() {
    // Activamos la posición absoluta mediante CSS
    btnEscurridizo.classList.add('esquivando');

    // Medidas del botón y de la ventana del navegador
    const anchoBoton = btnEscurridizo.offsetWidth;
    const altoBoton = btnEscurridizo.offsetHeight;
    const anchoPantalla = window.innerWidth;
    const altoPantalla = window.innerHeight;

    // Calculamos los límites máximos para que nunca se salga de la pantalla
    const maxTop = altoPantalla - altoBoton - 20;
    const maxLeft = anchoPantalla - anchoBoton - 20;

    // Generamos una posición completamente aleatoria pero segura
    const randomTop = Math.floor(Math.random() * maxTop);
    const randomLeft = Math.floor(Math.random() * maxLeft);

    // Aplicamos las nuevas coordenadas al botón
    btnEscurridizo.style.top = `${Math.max(20, randomTop)}px`;
    btnEscurridizo.style.left = `${Math.max(20, randomLeft)}px`;
}

// Evento para computadoras (cuando pasa el puntero por encima)
btnEscurridizo.addEventListener('mouseenter', moverBotónAleatorio);

// Evento para celulares (cuando se intenta presionar en la pantalla táctil)
btnEscurridizo.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Evita que se dispare el evento click normal
    moverBotónAleatorio();
});


// --- LÓGICA ORIGINAL CORREGIDA Y MANTENIDA ---

// 1. DESVANECIMIENTO DEL TELÓN INICIAL (Se activa con el botón de la derecha)
botonesIniciales.forEach(boton => {
    boton.addEventListener('click', (e) => {
        // Solo avanza si NO es el botón escurridizo
        if (e.target.id !== 'btn-escurridizo') {
            pantallaInicial.classList.add('desvanecido');
        }
    });
});

// 2. ABRIR CADA MODAL CON SU TEXTO E IMAGEN ASOCIADA
tarjetas.forEach(tarjeta => {
    tarjeta.addEventListener('click', () => {
        const id = tarjeta.getAttribute('data-info');
        const info = datosModales[id];

        document.getElementById('modal-titulo').innerText = info.titulo;
        document.getElementById('modal-texto').innerText = info.texto;
        document.getElementById('modal-imagen').src = info.img;

        modal.showModal();
    });
});

// 3. CERRAR EL MODAL MEDIANTE EL BOTÓN INTERNO
document.getElementById('btn-cerrar').addEventListener('click', () => {
    modal.close();
});

// 4. CERRAR EL MODAL SI SE HACE CLIC EN LA ZONA OSCURA EXTERIOR (BACKDROP)
modal.addEventListener('click', (e) => {
    const rect = modal.getBoundingClientRect();
    const clicDentro = (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
    );
    if (!clicDentro) {
        modal.close();
    }
});

// --- LÓGICA DEL CARRUSEL TÁCTIL EN COLUMNA (POEMA) ---
const pista = document.querySelector('.carrusel-pista');
const imagenesCarrusel = document.querySelectorAll('.carrusel-imagen');

if (pista && imagenesCarrusel.length > 0) {
    let indiceActual = 0;
    let tiempoInicialX = 0;
    let tiempoFinalX = 0;
    let intervaloAuto;

    function cambiarImagen(indice) {
        indiceActual = indice;
        pista.style.transform = `translateX(-${indiceActual * 50}%)`;
    }

    function iniciarAutoPlay() {
        intervaloAuto = setInterval(() => {
            indiceActual = (indiceActual + 1) % imagenesCarrusel.length;
            cambiarImagen(indiceActual);
        }, 3000); // Cambia automáticamente CADA 1 SEGUNDO
    }

    function detenerAutoPlay() {
        clearInterval(intervaloAuto);
    }

    // Eventos táctiles para deslizar con el dedo
    pista.addEventListener('touchstart', (e) => {
        detenerAutoPlay(); 
        tiempoInicialX = e.touches[0].clientX;
    }, { passive: true });

    pista.addEventListener('touchend', (e) => {
        tiempoFinalX = e.changedTouches[0].clientX;
        const diferenciaX = tiempoInicialX - tiempoFinalX;

        if (diferenciaX > 30 && indiceActual < imagenesCarrusel.length - 1) {
            cambiarImagen(indiceActual + 1);
        } else if (diferenciaX < -30 && indiceActual > 0) {
            cambiarImagen(indiceActual - 1);
        }
        
        iniciarAutoPlay(); 
    }, { passive: true });

    iniciarAutoPlay();
}
