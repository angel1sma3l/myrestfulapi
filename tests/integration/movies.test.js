const request = require('supertest');
const { Movie } = require('../../models/movie');
const mongoose = require('mongoose');
let server;


describe('/api/movies', () => {
        beforeEach(() => { server = require('../../index'); });
        afterEach( async () => {
          await server.close();
          await Movie.deleteMany({});
        });
    
    describe('GET /', () => {
        it('should get all movies', async () => {
            //creating some movies
            Movie.collection.insertMany([
                { 
                    title: 'movie1',
                    genre: { 
                        genreId: mongoose.Types.ObjectId(),
                        name: 'genre1'
                    },
                    numberInStock: 5,
                    dailyRentalRate: 1
                },
                {
                    title: 'movie2',
                    genre: { 
                        genreId: mongoose.Types.ObjectId(),
                        name: 'genre2'
                    },
                    numberInStock: 5,
                    dailyRentalRate: 1
                }
            ]);
            const res = await request(server).get('/api/movies');
            
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(m => m.title === 'movie1')).toBeTruthy();
            expect(res.body.some(m => m.title === 'movie2')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return a movie if valid id is passed', async () => {
            const movie = new Movie({
                title: 'movie1',
                genre: { 
                    genreId: mongoose.Types.ObjectId(),
                    name: 'genre1'
                }, 
                numberInStock: 5,
                dailyRentalRate: 1
            });
            await movie.save();

            const res = await request(server).get('/api/movies/' + movie._id);
            
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('title', movie.title);
        });

        it('should return a 404 error if invalid id is passed', async () => {
            
            const res = await request(server).get('/api/movies/1');
            
            expect(res.status).toBe(404);
        });
    });

    // describe('POST /', () => {
        
    //     let token;    
    //     let title = 'movie1';
    //     let genreId;
        

    //     const exec = async () => {
    //         return await request(server)
    //         .post('/api/movies/')
    //         .set('x-auth-token', token)
    //         .send({ 
    //             title: title,
	//             genreId: genreId,
	//             numberInStock: 5,
	//             dailyRentalRate: 1
    //         });
    //     }

    //     beforeEach(() => { 
    //         token = new User().generateAuthToken(); 
    //         genreId = mongoose.Types.ObjectId().toHexString();
        
    //     });

    //     it('should return 401 error if client is not logged in', async () => {
    //         token = '';

    //         const res = await exec();

    //         expect(res.status).toBe(401);
    //     });

    //     it('should return 400 error if movie title is less than 5 letters', async () => {
    //         title = '1234';
    //         const res = await exec();

    //         expect(res.status).toBe(400);
    //     });

    //     it('should return 400 error if movie is more than 255 letters', async () => {
    //         //name with more than 50 character
    //         title = new Array(258).join('a'); //this will put 'a' between each element.

    //         const res = await exec();

    //         expect(res.status).toBe(400);
    //     });

    //     it('should save the movie if it is valid', async () => {
            
    //         const res = await exec();

    //         const movie = await Movie.find({ title: 'movie1' });

    //         expect(movie).not.toBeNull();
    //     });

    //     it('should return a movie if is valid', async () => {
            
    //         const res = await exec();

    //         expect(res.body).toHaveProperty('_id');
    //         expect(res.body).toHaveProperty('title', 'movie1');
    //     });

    // });

    // describe('PUT /:id', () => {
    //     let token; 
    //     let newTitle; 
    //     let movie; 
    //     let id; 
    
    //     const exec = async () => {
    //       return await request(server)
    //         .put('/api/movies/' + id)
    //         .set('x-auth-token', token)
    //         .send({ title: newTitle });
    //     }
    
    //     beforeEach(async () => {
    //       // Before each test we need to create a movie and 
    //       // put it in the database.      
    //       movie = new Movie({ 
    //         title: 'movie1',
    //         genreId: mongoose.Types.ObjectId().toHexString(),
    //         numberInStock: 5,
    //         dailyRentalRate: 1 
    //     });
    //         await movie.save();
          
    //       token = new User().generateAuthToken();     
    //       id = movie._id; 
    //       newTitle = 'updatedName'; 
    //     })
    
    //     it('should return 401 if client is not logged in', async () => {
    //       token = ''; 
    
    //       const res = await exec();
    
    //       expect(res.status).toBe(401);
    //     });
    
    //     it('should return 400 if movie is less than 5 characters', async () => {
    //       newName = '1234'; 
          
    //       const res = await exec();
    
    //       expect(res.status).toBe(400);
    //     });
    
    //     it('should return 400 if movie is more than 250 characters', async () => {
    //       newName = new Array(258).join('a');
    
    //       const res = await exec();
    
    //       expect(res.status).toBe(400);
    //     });
    
    //     it('should return 404 if id is invalid', async () => {
    //       id = 1;
    
    //       const res = await exec();
    
    //       expect(res.status).toBe(404);
    //     });
    
    //     it('should return 404 if movie with the given id was not found', async () => {
    //       id = mongoose.Types.ObjectId();
    
    //       const res = await exec();
    
    //       expect(res.status).toBe(404);
    //     });
    
    //     it('should update the movie if input is valid', async () => {
    //       await exec();
    
    //       const updatedMovie = await Movie.findById(movie._id);
    
    //       expect(updatedMovie.title).toBe(newTitle);
    //     });
    
    //     it('should return the updated genre if it is valid', async () => {
    //       const res = await exec();
    
    //       expect(res.body).toHaveProperty('_id');
    //       expect(res.body).toHaveProperty('title', newTitle);
    //     });
    //   });  
    
    //   describe('DELETE /:id', () => {
    //     let token; 
    //     let genre; 
    //     let id; 
    
    //     const exec = async () => {
    //       return await request(server)
    //         .delete('/api/genres/' + id)
    //         .set('x-auth-token', token)
    //         .send();
    //     }
    
    //     beforeEach(async () => {
    //       // Before each test we need to create a genre and 
    //       // put it in the database.      
    //       genre = new Genre({ name: 'genre1' });
    //       await genre.save();
          
    //       id = genre._id; 
    //       token = new User({ isAdmin: true }).generateAuthToken();     
    //     })
    
    //     it('should return 401 if client is not logged in', async () => {
    //       token = ''; 
    
    //       const res = await exec();
    
    //       expect(res.status).toBe(401);
    //     });
    
    //     it('should return 403 if the user is not an admin', async () => {
    //       token = new User({ isAdmin: false }).generateAuthToken(); 
    
    //       const res = await exec();
    
    //       expect(res.status).toBe(403);
    //     });
    
    //     it('should return 404 if id is invalid', async () => {
    //       id = mongoose.Types.ObjectId();//SHOULD PUT 1 
          
    //       const res = await exec();
    
    //       expect(res.status).toBe(404);
    //     });
    
    //     it('should return 404 if no genre with the given id was found', async () => {
    //       id = mongoose.Types.ObjectId();
    
    //       const res = await exec();
    
    //       expect(res.status).toBe(404);
    //     });
    
    //     it('should delete the genre if input is valid', async () => {
    //       await exec();
    
    //       const genreInDb = await Genre.findById(id);
    
    //       expect(genreInDb).toBeNull();
    //     });
    
    //     it('should return the removed genre', async () => {
    //       const res = await exec();
    
    //       expect(res.body).toHaveProperty('_id', genre._id.toHexString());
    //       expect(res.body).toHaveProperty('name', genre.name);
    //     });
    //   }); 
});