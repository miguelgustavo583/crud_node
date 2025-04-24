const express = require('express');
const app = express();
const handlebars = require('express-handlebars').create({
    defaultLayout: 'main',
    helpers: {
        eq: function (a, b) { return a === b; },
        formatDate: function (date) {
            if (!date) return '';
            const d = new Date(date);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
    },
});
const bodyParser = require('body-parser');
const post = require('./models/post');

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.render('primeira_pagina');
});

app.post('/cadastrar', function(req, res){
    post.create({
        nome: req.body.nome,
        telefone: req.body.telefone,
        origem: req.body.origem,
        data_contato: req.body.data_contato,
        observacao: req.body.observacao
    }).then(function(){
        res.send("Agendamento criado com sucesso!")
 
    }).catch(function(erro){
        res.redirect("erro ao criar o post: " +erro)
    })
 })
 

app.get('/consulta', function (req, res) {
    post.findAll().then((posts) => {
        res.render('consulta', { posts });
    }).catch((erro) => {
        res.send('Erro ao listar os posts: ' + erro);
    });
});

app.get('/editar/:id', function (req, res) {
    post.findByPk(req.params.id).then((post) => {
        if (!post) {
            return res.send('Post não encontrado');
        }
        res.render('editar', { post: post.toJSON() });
    }).catch((erro) => {
        res.send('Erro ao buscar o post: ' + erro);
    });
});

app.post('/atualizar/:id', function (req, res) {
    post.update({
        nome: req.body.nome,
        telefone: req.body.telefone,
        origem: req.body.origem,
        data_contato: req.body.data_contato,
        observacao: req.body.observacao
    }, {
        where: { id: req.params.id }
    }).then(() => {
        res.redirect('/consulta');
    }).catch((erro) => {
        res.send('Erro ao atualizar o post: ' + erro);
    });
});

app.get('/excluir/:id', function (req, res) {
    post.destroy({ where: { id: req.params.id } }).then(() => {
        res.redirect('/consulta');
    }).catch((erro) => {
        res.send('Erro ao excluir o post: ' + erro);
    });
});

app.listen(8081, () => {
    console.log('Servidor Ativo!, escreva na URL (localhost:8081) para acessar o site');
});