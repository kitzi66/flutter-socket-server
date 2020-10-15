const { io } = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands()

bands.addBand(new Band('Jarabe de Palo'))
bands.addBand(new Band('Soda Estereo'))
bands.addBand(new Band('Cerati'))
bands.addBand(new Band('Heroes del Silencio'))

console.log(bands)


// Mensajes de sockets
io.on('connection', client => {
    console.log('Cliente conectado')

    client.emit('active-bands', bands.getBands())

    client.on('disconnect', () => {
        console.log('cliente desconectado')
    })

    client.on('mensaje', (payload) => {
        console.log(`Mensaje ${payload.nombre}!!!!`)

        io.emit('mensaje', { admin: 'Nuevo mensaje' })
    })

    /*client.on('emitir-mensaje', (payload) => {
        console.log(payload)
            //io.emit('nuevo-mensaje', payload) // emite a todos
        client.broadcast.emit('nuevo-mensaje', payload) // emite a todos menos al que lo emitio
    })*/

    client.on('vote-band', (payload) => {
        bands.voteBand(payload.id)
        io.emit('active-bands', bands.getBands())
    })

    client.on('add-band', (payload) => {
        const band = new Band(payload.name)
        bands.addBand(band)
        io.emit('active-bands', bands.getBands())
    })

    client.on('delete-band', (payload) => {
        bands.deleteBand(payload.id)
        io.emit('active-bands', bands.getBands())
    })
});