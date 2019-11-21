const request = require('supertest');
const { Rental } = require('../../models/rental');
const { User } = require('../../models/user');
const { Movie } = require('../../models/movie');
const mongoose = require('mongoose');
const moment = require('moment');//to calculate date and time.


describe('/api/returns', () => {
    let server;
    let customerId;
    let movieId;
    let token;
    let rental;
    let movie;

    const exec = () => {
        return request(server)
        .post('/api/returns/')
        .set('x-auth-token', token)
        .send({ customerId, movieId });
    }

    beforeEach( async () => { 
        server = require('../../index');
        token = new User().generateAuthToken(); 
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '1234567'
            },
            movie: {
                _id: movieId,
                title: '12345',
                dailyRentalRate: 2
            }
        });
        await rental.save();

        movie = new Movie({
            _id: movieId,
            title: 'movie1',
            genre: { name: '12345' },
            dailyRentalRate: 2,
            numberInStock: 10
        });
        await movie.save();

    });

    afterEach( async () => {
         await server.close();
         await Movie.deleteMany({});
         await Rental.deleteMany({});
    });

        it('should return 400 if not customerId is provided', async () => {
            customerId = '';
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if not movieId is provided', async () => {
            movieId = '';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 404 if rental not found with movieId/CustomerId', async () => {
            await Rental.deleteMany({});

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 400 if rental already processed', async () => {
            rental.dateReturned = new Date();
            await rental.save();

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 200 if valid request', async () => {
            
            const res = await exec();
            expect(res.status).toBe(200);
        });

        it('should set dateReturned', async () => {
            const res = await exec();

            const rentalIndb = await Rental.findById(rental._id);
            const diff = new Date() - rentalIndb.dateReturned;
            expect(diff).toBeLessThan(10 * 1000);
        });

        it('should calculate rentalFee numberOfDay by movie.dailyRentalRate', async () => {
            rental.dateOut = moment().add(-7, 'days').toDate();
            await rental.save();

            await exec();

            const rentalIndb = await Rental.findById(rental._id);

            expect(rentalIndb.rentalFee).toBe(14);
        });

        it('should increase movie in Stock if valid input', async () => {
            
            await exec();

            const movieIndb = await Movie.findById(movieId);

            expect(movieIndb.numberInStock).toBe(movie.numberInStock + 1);
        });

        it('should return movie if valid input', async () => {
            const res = await exec();

            expect(Object.keys(res.body)).toEqual(expect.arrayContaining([
                'customer', 'movie', 'dateReturned', 'rentalFee'
            ]));
        });

});