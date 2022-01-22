const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");


//Aqui tienen una forma de llamar a cada uno de los modelos
// const {Movies,Genres,Actor} = require('../database/models');

//Aquí tienen otra forma de llamar a los modelos creados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add:(req, res)=> {
        db.Genre.findAll()
        .then(allGenres => {
            
            res.render('moviesAdd', {allGenres});
        })
        .catch(error=>{
            res.send(error)
        })
        
    },
    create: (req,res)=> {
        db.Movie.create(req.body)
        .then(result=>{
            res.redirect(`/movies/detail/${result.id}`)
        })
        .catch(error=>{
            res.send(error)
        })
    },
    edit: (req,res)=> {
        db.Movie.findByPk(+req.params.id)
        .then(Movie =>{
            db.Genre.findAll()
            .then(allGenres=>{
                for(let i=0; i<allGenres.length; i++){
                    if(allGenres[i].id === Movie.genre_id){
                        Movie.genre=allGenres[i]
                    }
                }
                res.render('moviesEdit',{Movie, allGenres });
            })
            .catch(error=>{
                res.send(error)
            })
            
        })
        .catch(error=>{
            res.send(error)
        })
    },
    update: function (req,res) {
        let {title,rating,awards,length,genre_id} = req.body
        db.Movie.update({
            title:title,
            rating:rating,
            awards:awards,
            length:length,
            genre_id:genre_id
        },{
            where:{id:+req.params.id}
        })
        .then(confirm =>{
            res.redirect('/movies')
        })
        .catch(error=>{
            res.send(error)
        })
    },
    delete: (req,res)=> {
        db.Movie.findByPk(+req.params.id)
        .then(Movie =>{
            res.render('moviesDelete',{Movie});
        })
        .catch(error=>{
            res.send(error)
        })
        
    },
    destroy: (req,res)=> {
        db.Movie.destroy({
            where:{id:+req.params.id}
        })
        .then(confirm=>{
            res.redirect('/movies')
        })
        .catch(error=>{
            res.send(error)
        })
    }
}

module.exports = moviesController;