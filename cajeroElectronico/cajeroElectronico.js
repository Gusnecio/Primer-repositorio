const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const usuarios = [
    { nombre: "Administrador", documento: "123456", contrasena: "admin12345", tipo: 1 },
    { nombre: "Gustavo", documento: "1007893929", contrasena: "1843", tipo: 2 }
];

let cajero = [
    { denominacion: 100000, cantidad: 0 },
    { denominacion: 50000, cantidad: 0 },
    { denominacion: 20000, cantidad: 0 },
    { denominacion: 10000, cantidad: 0 },
    { denominacion: 5000, cantidad: 0 }
];

let usuarioActual = null;

function iniciarSesion() {
    rl.question('Ingrese documento: ', documento => {
        rl.question('Ingrese contraseña: ', contrasena => {
            usuarioActual = usuarios.find(user => user.documento === documento && user.contrasena === contrasena);

            if (usuarioActual) {
                if (usuarioActual.tipo === 1) {
                    cargarCajero();
                } else if (usuarioActual.tipo === 2) {
                    if (cajero.every(billete => billete.cantidad === 0)) {
                        console.log("Cajero en mantenimiento, vuelva pronto.");
                        iniciarSesion();
                    } else {
                        retirarDinero();
                    }
                }
            } else {
                console.log("Usuario no existe o contraseña incorrecta.");
                iniciarSesion();
            }
        });
    });
}

function cargarCajero() {
    rl.question('Ingrese billetes de 100,000: ', billetes100000 => {
        cajero[0].cantidad += parseInt(billetes100000) || 0;

        rl.question('Ingrese billetes de 50,000: ', billetes50000 => {
            cajero[1].cantidad += parseInt(billetes50000) || 0;

            rl.question('Ingrese billetes de 20,000: ', billetes20000 => {
                cajero[2].cantidad += parseInt(billetes20000) || 0;

                rl.question('Ingrese billetes de 10,000: ', billetes10000 => {
                    cajero[3].cantidad += parseInt(billetes10000) || 0;

                    rl.question('Ingrese billetes de 5,000: ', billetes5000 => {
                        cajero[4].cantidad += parseInt(billetes5000) || 0;

                        mostrarEstadoCajero();
                        iniciarSesion();
                    });
                });
            });
        });
    });
}

function mostrarEstadoCajero() {
    let total = 0;
    console.log("Estado del Cajero");
    cajero.forEach(billete => {
        let subtotal = billete.denominacion * billete.cantidad;
        total += subtotal;
        console.log(`Billetes de ${billete.denominacion}: ${billete.cantidad} (Subtotal: ${subtotal})`);
    });
    console.log(`Total en cajero: ${total}`);
}

function retirarDinero() {
    rl.question('Ingrese monto a retirar: ', monto => {
        monto = parseInt(monto);
        let montoOriginal = monto;
        let entrega = [];

        for (let billete of cajero) {
            let cantidadNecesaria = Math.floor(monto / billete.denominacion);
            let cantidadAEntregar = Math.min(cantidadNecesaria, billete.cantidad);

            if (cantidadAEntregar > 0) {
                entrega.push({ denominacion: billete.denominacion, cantidad: cantidadAEntregar });
                monto -= cantidadAEntregar * billete.denominacion;
                billete.cantidad -= cantidadAEntregar;
            }
        }

        if (monto > 0) {
            console.log("No se puede entregar la cantidad exacta solicitada. Intente con otro monto.");
            iniciarSesion();
        } else {
            console.log(`Se entregó ${montoOriginal}:`);
            entrega.forEach(e => console.log(`Billetes de ${e.denominacion}: ${e.cantidad}`));
            mostrarEstadoCajero();
            iniciarSesion();
        }
    });
}

iniciarSesion();
