// process.env.NODE_ENV = 'test';
let server = require('../app');
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let expect = chai.expect;
chai.use(chaiHttp);
User = require('../models/user');
let uri_signup = '/api/user/signup'
let uri_login = '/api/user/login'
let uri_refresh = '/api/user/refresh'

let user_data = {
    email: 'euloma@mail.com',
    name: 'Eugenia Lopez',
    password: '#test123',
    username: 'eugeniacristina',
}

let wrong_user_data = {
    email: "wrong_euge@mail.com",
    password: "#wrong123"
}

let wrong_jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMDVlYmEyZDcwYTVlNjY5YjZmOTBkMCIsImV4cGlyZXMiOjE1NDM5MDg2NzQ5MzksInJlZnJlc2giOnRydWUsImlhdCI6MTU0Mzg5MTg3NH0.PG2atefsJ-nCsWGmDVsIagjvhNAGJnh71HoQut-fPFw"'




async function signup(custom_user_data) {
    await User.remove({});
    await chai.request(server).post(uri_signup).send(custom_user_data);
}
async function login(custom_user_data){
    let response = await chai.request(server).get(uri_login).auth(custom_user_data.email, custom_user_data.password)
    return response.body
}



describe('POST /user/signup', () => {
    beforeEach( async() => {
        await User.remove({})
    });
    it('should sign up and create a new user', async () => {
        try {
            let res = await chai.request(server).post(uri_signup).send(user_data)
            res.should.have.status(200);
        } catch (error) {
            console.log(error);
            error.should.have.status(200);
        }
    })
    it('should return status 409 if email already used', async () => {
        try {
            await chai.request(server).post(uri_signup).send(user_data)
            let res = await chai.request(server).post(uri_signup).send(user_data)
            res.should.have.status(409)
            res.body.message.should.equal('Error signing up the user')
            res.body.details.should.equal('Email already used')
        } catch (error) {
            console.log(error);
            error.should.have.status(409);
        }
    })
});

describe('GET /user/login', () => {
    beforeEach( async() => {
        await User.remove({})
        await chai.request(server).post(uri_signup).send(user_data)
    })
    it('Status 200 when login in with user', async () => {
        try {
            let res = await chai.request(server).get(uri_login).auth(user_data.email, user_data.password)
            // console.log(res)
            res.body.should.have.property("jwt").to.be.an("string");
            res.body.should.property("jwtExpiration");
            res.body.should.be.a('object');
            expect(res.body.jwt).to.not.empty;
        } catch(error) {
            console.log(error);
            error.response.should.have.property(200);
            
        }
    });
    it('Status 401 when try to log with an unauthorized user', async () => {
        try {
            let res = await chai.request(server).get(uri_login).auth(wrong_user_data.email, wrong_user_data.password)
            res.should.have.status(401);
            res.body.should.have.property('code')             
            res.body.code.should.be.equal('USR007')             
            res.body.should.have.property('message')             
            res.body.details.should.be.equal('User does not have the permission to make this action')
        } catch (error) {
            console.log(error)
            error.should.have.status(401);
            error.body.should.have.property('code')             
            error.body.code.should.be.equal('USR007')             
            error.body.should.have.property('message')             
            error.body.details.should.be.equal('User does not have the permission to make this action')
        }
    })
})

describe('GET /api/user/refresh', () => {
    let user_refresh_token = null;
    beforeEach(async () => {
        await signup(user_data)
        user_refresh_token = (await login(user_data)).refreshToken
    })
    it('Status 200 if ok send refresh token', async () => {
        try {
            let res = await chai.request(server).get(uri_refresh).set('Authorization', 'JWT ' + user_refresh_token)
            res.should.have.status(200);
            res.body.should.have.property("jwt").to.be.an("string");
            res.body.should.property("jwtExpiration");
            res.body.should.be.a('object');
            expect(res.body.jwt).to.not.empty;
        } catch(error) {
            console.log(error)
            error.response.should.have.status(200);
        }
    })
    it('Status 401 should reject because of unauthorized token', async () => {
        try {
            let res = await chai.request(server).get(uri_refresh).set('Authorization', 'JWT ' +  wrong_jwt)
            res.should.have.status(401)
        } catch(error) {
            error.response.should.have.status(401);
            error.response.body.should.have.property('code')             
            error.response.body.code.should.be.equal('USR007')             
            error.response.body.should.have.property('message')             
            error.response.body.details.should.be.equal('User does not have the permission to make this action')
        }
    })
});

    